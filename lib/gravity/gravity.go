/*
Copyright 2017-2018 Gravitational, Inc.

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

package gravity

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"os/exec"
	"text/template"

	"github.com/gravitational/trace"
	log "github.com/sirupsen/logrus"
)

// CreateUser creates a new admin user with the provided email and password.
func CreateUser(email, password string) error {
	userResource, err := ioutil.TempFile("", "user")
	if err != nil {
		return trace.Wrap(err)
	}
	defer os.Remove(userResource.Name())
	err = userTemplate.Execute(userResource, map[string]string{
		"name":     email,
		"password": password,
	})
	if err != nil {
		return trace.Wrap(err)
	}
	out, err := gravityCommand("resource", "create", "-f", userResource.Name())
	if err != nil {
		return trace.Wrap(err, "failed to create user resource: %s", out)
	}
	log.Infof("Created user resource: %s.", string(out))
	return nil
}

// ConfigureRemoteSupport enables or disables configured trusted cluster.
func ConfigureRemoteSupport(enabled bool) error {
	infoS, err := GetClusterInfo()
	if err != nil {
		return trace.Wrap(err)
	}
	var info clusterInfo
	if err := json.Unmarshal([]byte(infoS), &info); err != nil {
		return trace.Wrap(err)
	}
	if !info.RemoteSupportConfigured {
		log.Info("Remote support is not configured.")
		return nil
	}
	action := "disable"
	if enabled {
		action = "enable"
	}
	out, err := gravityCommand("tunnel", action)
	if err != nil {
		return trace.Wrap(err, "failed to %v tunnel: %s", action, out)
	}
	log.Infof("Remote support %vd: %s.", action, out)
	return nil
}

// clusterInfo is a subset of the local cluster info
type clusterInfo struct {
	// RemoteSupportConfigured indicates whether local cluster has remote
	// support configured (enabled or disabled trusted cluster)
	RemoteSupportConfigured bool `json:"remoteSupportConfigured"`
}

// CompleteInstall marks the site installation step as complete.
func CompleteInstall(support bool) error {
	// remote support actions are available only in enterprise edition
	isEnterprise, err := IsEnterprise()
	if err != nil {
		return trace.Wrap(err, "failed to determine edition")
	}
	if isEnterprise {
		err := ConfigureRemoteSupport(support)
		if err != nil {
			return trace.Wrap(err, "failed to configure remote support")
		}
	}
	out, err := gravityCommand("site", "complete")
	if err != nil {
		return trace.Wrap(err, "failed to complete install: %s", out)
	}
	log.Infof("Install completed: %s.", out)
	return nil
}

// GetClusterInfo returns a JSON-formatted string with the local cluster information.
func GetClusterInfo() (string, error) {
	out, err := gravityCommand("site", "info", "--output=json")
	if err != nil {
		return "", trace.Wrap(err, "failed to get cluster info: %s", out)
	}
	log.Infof("Local cluster info: %s.", out)
	return string(out), nil
}

// IsEnterprise returns true if the local Telekube cluster is of enterprise
// edition.
func IsEnterprise() (bool, error) {
	bytes, err := gravityCommand("version", "--output=json")
	if err != nil {
		return false, trace.Wrap(err, "failed to determine gravity version: %s", bytes)
	}
	var ver version
	if err := json.Unmarshal(bytes, &ver); err != nil {
		return false, trace.Wrap(err, "failed to parse version as json: %s", bytes)
	}
	return ver.Edition == enterprise, nil
}

// version is a subset of the gravity version object
type version struct {
	// Edition is the product edition
	Edition string `json:"edition"`
}

// enterprise is the name of the Enterprise edition
const enterprise = "enterprise"

// gravityCommand runs the gravity command line tool with the provided arguments
// using locally running gravity site as OpsCenter.
func gravityCommand(a ...string) ([]byte, error) {
	args := []string{"--insecure", "--debug"}
	args = append(args, a...)
	command := exec.Command("gravity", args...)
	out, err := command.Output()
	return out, trace.Wrap(err)
}

// userTemplate is the template for a user resource
var userTemplate = template.Must(template.New("user").Parse(`kind: user
version: v2
metadata:
  name: {{.name}}
spec:
  type: admin
  password: {{.password}}
  roles: ["@teleadmin"]`))
