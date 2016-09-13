package gravity

import (
	"fmt"
	"os/exec"
	"strings"

	"github.com/gravitational/trace"
)

// CreateUser creates a new admin user with the provided email and password.
func CreateUser(email, password string) error {
	out, err := gravityCommand("user", "create", email, "--type=admin",
		fmt.Sprintf("--email=%s", email), fmt.Sprintf("--password=%s", password))
	fmt.Printf("create user output: %s\n", string(out))
	return trace.Wrap(err)
}

// SetRemoteSupport enables/disables remote support with Gravitational OpsCenter.
func SetRemoteSupport(on bool) error {
	siteName, err := GetLocalSite()
	if err != nil {
		return trace.Wrap(err)
	}
	action := "on"
	if !on {
		action = "off"
	}
	out, err := gravityCommand("site", "support", siteName, action)
	fmt.Printf("set remote support output: %s\n", string(out))
	return trace.Wrap(err)
}

// CompleteInstall marks the site installation step as complete.
func CompleteInstall() error {
	siteName, err := GetLocalSite()
	if err != nil {
		return trace.Wrap(err)
	}
	out, err := gravityCommand("site", "complete", siteName)
	fmt.Printf("complete install output: %s\n", string(out))
	return trace.Wrap(err)
}

// GetSiteInfo returns a JSON-formatted string with the site information.
func GetSiteInfo() (string, error) {
	siteName, err := GetLocalSite()
	if err != nil {
		return "", trace.Wrap(err)
	}
	out, err := gravityCommand("site", "info", siteName, "--output=json")
	fmt.Printf("get site info output: %s\n", string(out))
	return string(out), trace.Wrap(err)
}

// GetLocalSite returns the name of the locally installed site.
func GetLocalSite() (string, error) {
	out, err := gravityCommand("local-site")
	fmt.Printf("get local site output: %s\n", string(out))
	return string(out), trace.Wrap(err)
}

// gravityCommand runs the gravity command line tool with the provided arguments
// using locally running gravity site as OpsCenter.
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

const (
	// gravityURL is the URL of the gravity site k8s service running locally
	gravityURL = "https://gravity-site.kube-system.svc.cluster.local:33009"
)
