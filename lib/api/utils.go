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
	err := map[string]string{"error": message}
	bytes, _ := json.Marshal(err)
	w.Header().Set("Content-Type", "application/json")
	http.Error(w, string(bytes), http.StatusInternalServerError)
}
