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
	"io/ioutil"
	"os"
	"os/exec"
	"strings"

	"github.com/alecthomas/template"
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
	action := "disable"
	if enabled {
		action = "enable"
	}
	out, err := gravityCommand("tunnel", action)
	if err != nil {
		return trace.Wrap(err, "failed to %v tunnel: %s", action, out)
	}
	log.Infof("Remote support %vd: %s.", out)
	return nil
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

// GetSiteInfo returns a JSON-formatted string with the site information.
func GetSiteInfo() (string, error) {
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
	out, err := gravityCommand("version")
	if err != nil {
		return false, trace.Wrap(err, "failed to determine gravity version: %s", out)
	}
	return strings.Contains(strings.ToLower(string(out)), "enterprise"), nil
}

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
