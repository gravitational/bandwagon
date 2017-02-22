# Telekube Final Install Step Application

Bandwagon is the application you can fork, customize and tweak to set up last installation step of Telekube install wizard.

### Making Changes

```
make build
make run
```

If something is not working, do `make clean` and then repeat the commands above.

### Enabling It In Your Application

To enable a web app as a custom installer step in your application, you just need to define an endpoint in your manifest and then refer to it in the installer configuration section:

```yaml
apiVersion: bundle.gravitational.io/v2
kind: Bundle

...

endpoints:
  - name: "Setup"
    # name of Kubernetes service that serves the web page with this install step
    serviceName: bandwagon
    # this endpoint will be hidden from the list of general application endpoints
    hidden: true
    
...

installer:
  setupEndpoints:
    - "Setup" # name of the endpoint defined above
    
...
```
