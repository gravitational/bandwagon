## Bandwagon Web Client

#### To build with docker:

```
$ make
```

#### To build locally:

install nodejs >= 8.0.0

```
$ npm install
$ npm run build
```

#### To run a local development server:

```
$ npm run start -- --proxy=https://host:port/web/installer/site/YOUR-CLUSTER/complete/
```

For example, if the URL of your final installation step is `https://mycluster.example.com/web/installer/site/MARS/complete`
and you want to use it as a backend for your local bandwagon WEB development, you can start a dev server with the following:
```
$ npm run start -- --proxy=https://mycluster.example.com/web/installer/site/MARS/complete/
```


Then open `https://localhost:3001/web/`

