# Gravity Final Install Step Application

Bandwagon is an application you can fork and customize to add a final step to the [Gravity](https://github.com/gravitational/gravity) install wizard,
as described in the [custom installer](https://gravitational.com/gravity/docs/pack/#custom-installation-screen) documentation.

### Making Changes

```
make build
make run
```

If something is not working, do `make clean` and then repeat the commands above.

For Web UI development, [use these instructions](web/README.md) to start a local development server with hot updates.


### Enabling It In Your Application

To enable a web app as a custom installer step in your application, you just need to define an endpoint in
your manifest and then refer to it in the installer configuration section:

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

### Creating a Local User after an Automatic/Unattended Installation

After installing bandwagon with Gravity as part of an automatic/unattended
installation, you'll need to create a local user account and password to log
into the Gravity web app. See [Configuring Users](https://gravitational.com/gravity/docs/cluster/#configuring-users-tokens)
documentation section for the information on how to create a user.


## Contributing

The most common use of bandwagon shouldn't require merging changes back into the mainline,
but instead bundling the edited bandwagon in a [cluster image](https://goteleport.com/gravity/docs/pack/).
If you would like to upstream your changes, check out our [contributing guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).
