package api

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/gorilla/mux"

	"github.com/gravitational/bandwagon/lib/gravity"
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
	log.Infof("request: %v", req)

	err = gravity.CreateUser(req.Email, req.Password)
	if err != nil {
		replyError(w, err.Error())
		return
	}

	err = gravity.SetRemoteSupport(req.Support)
	if err != nil {
		replyError(w, err.Error())
		return
	}

	err = gravity.CompleteInstall()
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
