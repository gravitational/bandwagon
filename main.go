package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"
	"strings"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"
	"github.com/gravitational/trace"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/info", infoHandler).Methods("GET")
	r.HandleFunc("/api/complete", completeHandler).Methods("POST")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("/opt/bandwagon/web/dist")))
	http.ListenAndServe(":8000", r)
}

func infoHandler(w http.ResponseWriter, r *http.Request) {
	siteName, err := getLocalSite()
	if err != nil {
		replyError(w, err.Error())
		return
	}

	out, err := gravityCommand("site", "info", siteName, "--output=json")
	if err != nil {
		replyError(w, err.Error())
		return
	}

	replyString(w, string(out))
}

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
	log.Infof("request: %v", req)

	out, err := gravityCommand("user", "create", req.Email, "--type=admin",
		fmt.Sprintf("--email=%s", req.Email), fmt.Sprintf("--password=%s", req.Password))
	if err != nil {
		replyError(w, err.Error())
		return
	}
	log.Infof("user create: %s", string(out))

	siteName, err := getLocalSite()
	if err != nil {
		replyError(w, err.Error())
		return
	}

	var supportFlag string
	if req.Support {
		supportFlag = "on"
	} else {
		supportFlag = "off"
	}

	out, err = gravityCommand("site", "support", siteName, supportFlag)
	if err != nil {
		replyError(w, err.Error())
		return
	}
	log.Infof("site support: %s", string(out))

	out, err = gravityCommand("site", "complete", siteName)
	if err != nil {
		replyError(w, err.Error())
		return
	}

	replyOK(w)
}

func replyOK(w http.ResponseWriter) {
	replyJSON(w, map[string]string{"message": "OK"})
}

func replyJSON(w http.ResponseWriter, data interface{}) {
	bytes, err := json.Marshal(data)
	if err != nil {
		replyError(w, err.Error())
	}
	replyString(w, string(bytes))
}

func replyString(w http.ResponseWriter, data string) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, data)
}

func replyError(w http.ResponseWriter, message string) {
	err := map[string]string{"error": message}
	bytes, _ := json.Marshal(err)
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, string(bytes), http.StatusInternalServerError)
}

func getLocalSite() (string, error) {
	out, err := gravityCommand("local-site")
	if err != nil {
		return "", trace.Wrap(err)
	}
	return string(out), nil
}

func gravityCommand(a ...string) ([]byte, error) {
	args := []string{"--insecure"}
	args = append(args, a...)
	args = append(args, fmt.Sprintf("--ops-url=%v", gravityURL))
	fmt.Printf("command: gravity %s\n", strings.Join(args, " "))
	command := exec.Command("gravity", args...)
	out, err := command.Output()
	fmt.Printf("output: %s\n", string(out))
	return out, trace.Wrap(err)
}

type CompleteRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Support  bool   `json:"support"`
}

const gravityURL = "https://gravity-site.kube-system.svc.cluster.local:33009"
