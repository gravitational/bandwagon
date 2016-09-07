package main

import (
	"html/template"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	//router.HandleFunc("/", index)
	router.PathPrefix("/").Handler(
		http.FileServer(http.Dir("/opt/bandwagon/web/dist")))
	http.ListenAndServe(":8000", router)
}

func index(w http.ResponseWriter, r *http.Request) {
	indexHTML, err := ioutil.ReadFile("/opt/bandwagon/web/dist/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	indexPage, err := template.New("index").Parse(string(indexHTML))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	indexPage.Execute(w, nil)
}
