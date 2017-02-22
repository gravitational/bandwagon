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
	"fmt"
	"net/http"
)

// replyOK responds with the default OK JSON message.
func replyOK(w http.ResponseWriter) {
	replyJSON(w, map[string]string{"message": "OK"})
}

// replyJSON responds with the provided JSON object.
func replyJSON(w http.ResponseWriter, data interface{}) {
	bytes, err := json.Marshal(data)
	if err != nil {
		replyError(w, err.Error())
	}
	replyString(w, string(bytes))
}

// replyString responds with the provided string data with the assumption
// that it is a JSON-formatted string.
func replyString(w http.ResponseWriter, data string) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, data)
}

// replyError responds with the provided error message.
func replyError(w http.ResponseWriter, message string) {
	err := map[string]string{"message": message}
	bytes, _ := json.Marshal(err)
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, string(bytes), http.StatusInternalServerError)
}
