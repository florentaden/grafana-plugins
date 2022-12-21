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

**Note:** 
If you've made changes to the plugin, specifying `--no-cache` option to force rebuild all plugins while rebuilding the container.

### Different admin password

The default `admin` user password is `admin`, which is not preferred.
Spcifying `-E GF_SECURITY_ADMIN_PASSWORD={mypassword}` to use your own password.
Also, `-E GF_SECURITY_ADMIN_USER={myuser}` to use different admin name.

You may use `env.list` as env file to make start command shorter and easier.

### Configuring OAuth Login

See `env.list` for Azure AD example and Github example.

Follow the [document](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-authentication/) to configure Grafana to authenticate users.

**Note: The default admin user/password still works after OAuth configured.** It's just allows normal user to login with OAuth.  

## Developing New Plugins

1. Add a new plugin under `plugins` directory.
2. Follow Grafana plugin development documents to develop the plugin.
3. (Development mode) After it's done, add the plugin's Id (the `id` in `plugin.json`) to `allow_loading_unsigned_plugins` config in the file `/grafana.ini` in this repo.

Then rebuild the container.

## Updating / Adding Dashboard

1. Make changes in Grafana console.
2. Find the the dashboard's code by navigating to dashboard's settings window, then select "JSON Model". Copy the JSON code.
3. Paste the copied JSON to the related file under `/dashboards` in this repo.

## About Plugin `sigrun-gnss`

The plugin `sigrun-gnss` which charts datasource from GNS internal shared folder. This requires a GNS internal host to mount the shared folder, then run the container built by this repo's `api` directory, to expose data via HTTP.

```
+------------+        +----------+         +-----------+             +--------------------+
| GNS shared |  mount | Docker   |  expose | API       |  http req   | Grafana browser    |
| folder     | ------ | host     | --------| container | <<========= | Sigrun-gnss plugin |
+------------+        +----------+         +-----------+             +--------------------+
                   (eg. kaizan.gns.cri.nz)
```

### Building API service

In `/api` directory, run
```
docker build -t sigrun-gnss-api .
```

### Running API service locally for testing

The host (localhost) should have a directory contains similar CSV format as Sigrun's data. Then,
```
docker run -d  -p {port}:{port} -v {host_dir}:{mount_dir}
```
to start the service. The exported endpoint will be `/data`.

Then from plugin part, you'll have to change the hostname:port in `plugins/sigrun-gnss/src/datasources.ts`. Find the `const path` in the source file:
```
const path =  "http://kaizen.gns.cri.nz:8000/data/?"; // assuming the rapidAPI container is running and has been built with the docker compose
```

Change it to your {localhost}:{port} to make the plugin work. 

## TODO

1. Currently plugin `sigrun-gnss` uses hard-coded URL to the datasource host. A way to configure it with environment variable would be ideal. However, can't find a way to support this in Grafana.