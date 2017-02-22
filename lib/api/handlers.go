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
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/gravitational/bandwagon/lib/gravity"
	"github.com/gravitational/trace"
)

// SetupHandlers configures API handlers.
func SetupHandlers() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/info", infoHandler).Methods("GET")
	router.HandleFunc("/api/complete", completeHandler).Methods("POST")
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
	info, err := gravity.GetSiteInfo()
	if err != nil {
		replyError(w, err.Error())
		return
	}
	replyString(w, string(info))
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
}

const (
	// assetsDir is where static web assets are stored in the container we're running in
	assetsDir = "/opt/bandwagon/web/dist"
)
