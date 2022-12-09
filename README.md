# Volcano Dashboard

## Running Grafana Dashboard Container

Executing the command line script:
```
./build_container.sh
```
Will build and run the container, then you can navigate to http://localhost:3000 with login with id/password both `admin`.

To only build the container:
```
docker build -t volcano-dashboard .
```
The complete running environment requires another service to expose data store in GNS shared drive via http.

## Developing Plugins

Check the README under each `plugins`.

## TODO

Currently plugins built in dev mode only. There're some linting issue stop building to production mode.
