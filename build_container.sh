
NAME="vdb-testing"
VER="0.1"
HOST_PORT="3000"
CONTAINER_PORT="3000"

# -- localhost path
DASHBOARDS_HOSTPATH="./dashboards"
DATASOURCE_HOSTPATH="./plugins"
PROVISION_HOSTPATH="./provisioning"

# -- container path
DASHBOARDS_CONTAINERPATH="/var/lib/grafana/dashboards"
DATASOURCE_CONTAINERPATH="/var/lib/grafana/plugins"
PROVISION_CONTAINERPATH="/etc/grafana/provisioning"

# -- Build docker container
docker build -t $NAME:$VER . &&

# -- Run docker container 
docker run -d \
 -p $HOST_PORT:$CONTAINER_PORT \
 -e GF_DEFAULT_APP_MODE='development' \
 $NAME:$VER

# -- Find Grafana
CONTAINER=`docker ps | grep $NAME:$VER | awk '{print $1}'`
PORT=`docker inspect $CONTAINER | grep HostPort | tail -1 | awk -F\" '{print $4}'`

echo grafana_dev:$VER up and running $CONTAINER
echo Try
echo http://`hostname`:$PORT
docker exec -it $CONTAINER /bin/bash 
