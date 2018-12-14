/*
Copyright 2017 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package api

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"k8s.io/client-go/util/homedir"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"

	"github.com/gravitational/trace"
	"github.com/tidwall/sjson"
	"github.com/tulip/bandwagon/lib/gravity"
	apiv1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

var kubeconfig *string

// SetupHandlers configures API handlers.
func SetupHandlers() *mux.Router {
	if home := homedir.HomeDir(); home != "" {
		kubeconfig = flag.String("kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to kubeconfig")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "absolute path to the kubeconfig file")
	}

	router := mux.NewRouter()
	router.HandleFunc("/api/info", infoHandler).Methods("GET")
	router.HandleFunc("/api/complete", completeHandler).Methods("POST")
	router.HandleFunc("/api/test", testHandler).Methods("GET")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir(assetsDir)))
	return router
}

// infoHandler returns information about locally running site
//
//   GET /api/info
//
// Response:
//
//   {
//     "endpoints": [
//       {
//         "name": "Web",
//         "description": "Web application endpoint",
//         "addresses": ["http://192.168.0.1"]
//       }
//     ]
//   }
func infoHandler(w http.ResponseWriter, r *http.Request) {
	info, err := gravity.GetClusterInfo()
	if err != nil {
		replyError(w, err.Error())
		return
	}
	replyString(w, string(info))
}

func getClientset() *kubernetes.Clientset {
	config, err := clientcmd.BuildConfigFromFlags("", *kubeconfig)
	if err != nil {
		panic(err)
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	return clientset
}

func updateConfigmap(hostname string, clientset *kubernetes.Clientset) {
	// Update factory configmap
	configMapClient := clientset.CoreV1().ConfigMaps(apiv1.NamespaceDefault)
	result, getErr := configMapClient.Get("tulip-factory", metav1.GetOptions{})
	if getErr != nil {
		panic(fmt.Errorf("Failed to get latest version of configmap: %v", getErr))
	}

	fqdn := fmt.Sprintf("https://%v", hostname)
	result.Data["conf.json"], _ = sjson.Set(result.Data["conf.json"], "aws\\.s3\\.endpoint", fqdn)
	result.Data["conf.json"], _ = sjson.Set(result.Data["conf.json"], "root_url", fqdn)
	_, updateErr := configMapClient.Update(result)
	if updateErr != nil {
		panic(fmt.Errorf("Updating configmap tulip-factory failed: %v", updateErr))
	}
}

func updateIngresses(hostname string, clientset *kubernetes.Clientset) {
	ingressClient := clientset.ExtensionsV1beta1().Ingresses(apiv1.NamespaceDefault)
	ingresses := [3]string{"tulip-factory", "tulip-factory-services", "onprem-images"}
	for _, ing := range ingresses {
		ig, getErr := ingressClient.Get(ing, metav1.GetOptions{})
		if getErr != nil {
			panic(fmt.Errorf("Failed to get latest version of ingress %v", getErr))
		}
		ig.Spec.TLS[0].Hosts[0] = hostname
		ig.Spec.Rules[0].Host = hostname
		_, updateErr := ingressClient.Update(ig)
		if updateErr != nil {
			panic(fmt.Errorf("Updating ingress failed: %v", updateErr))
		}
	}
}

// INGRESS_SVC_IP=$(kubectl -n default get svc nginx-ingress-controller -o jsonpath='{.spec.clusterIP}')
// # now we need to inject a HostAlias into the deployment as well
// kubectl -n default get deployment tulip-factory -o json --export | \
// 	jq -c --arg ingressIP $INGRESS_SVC_IP \
// 	' .spec.template.spec.hostAliases |= [{hostnames: ["'$DOMAIN'"], ip: $ingressIP}] ' | \
// kubectl -n default replace -f -

func updateDeployment(hostname string, clientset *kubernetes.Clientset) {
	svcClient := clientset.CoreV1().Services(apiv1.NamespaceDefault)
	svc, getErr := svcClient.Get("local-models", metav1.GetOptions{})
	if getErr != nil {
		panic(fmt.Errorf("Failed to get latest version of service %v", getErr))
	}

	fmt.Println(svc.Spec.ClusterIP)
	deploymentsClient := clientset.AppsV1().Deployments(apiv1.NamespaceDefault)
	dp, getErr := deploymentsClient.Get("tulip-factory", metav1.GetOptions{})
	if getErr != nil {
		panic(fmt.Errorf("Failed to get tulip-factory deployment: %v", getErr))
	}

	hostAlias := apiv1.HostAlias{Hostnames: []string{hostname}, IP: svc.Spec.ClusterIP}
	hostAliases := []apiv1.HostAlias{hostAlias}
	dp.Spec.Template.Spec.HostAliases = hostAliases
	_, updateErr := deploymentsClient.Update(dp)
	if updateErr != nil {
		panic(fmt.Errorf("Updating deployment tulip-factory failed: %v", updateErr))
	}
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	clientset := getClientset()
	updateConfigmap("onprem.tulip.co", clientset)
	updateIngresses("onprem.tulip.co", clientset)
	updateDeployment("onprem.tulip.co", clientset)
}

// completeHandler configures the site according to the data in the request
//
//   POST /api/complete
//
// Input:
//
//   CompleteRequest
//
// Response:
//
//   {
//     "message": "OK"
//   }
func completeHandler(w http.ResponseWriter, r *http.Request) {
	bytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		replyError(w, err.Error())
		return
	}

	var req CompleteRequest
	if err := json.Unmarshal(bytes, &req); err != nil {
		replyError(w, err.Error())
		return
	}

	clientset := getClientset()
	updateConfigmap(req.Hostname, clientset)
	updateIngresses(req.Hostname, clientset)
	updateDeployment(req.Hostname, clientset)

	err = gravity.CreateUser(req.Email, req.Password)
	if err != nil && !trace.IsAlreadyExists(err) {
		replyError(w, err.Error())
		return
	}

	err = gravity.CompleteInstall(req.Support)
	if err != nil {
		replyError(w, err.Error())
		return
	}

	replyOK(w)
}

// CompleteRequest is a request to complete site installation.
type CompleteRequest struct {
	// Email is the email of the admin user to create.
	Email string `json:"email"`
	// Password is the password of the admin user.
	Password string `json:"password"`
	// Support enables/disables remote support with Gravitational OpsCenter.
	Support bool `json:"support"`

	// Hostname for the installation
	Hostname string `json:"hostname"`
}

const (
	// assetsDir is where static web assets are stored in the container we're running in
	assetsDir = "/opt/bandwagon/web/dist"
)
