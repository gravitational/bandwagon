package main

import (
	"net/http"

	"github.com/gravitational/bandwagon/lib/api"
)

func main() {
	router := api.SetupHandlers()
	// we're running in a container so free of port collisions
	http.ListenAndServe(":8000", router)
}
