
IMAGE=volcano_dash
VER=version1.3
HOST_PORT=3000
CONTAINER_PORT=3000 # should stay like this?

# -- mount Sigrun's data directory (is it a good way?)
HOST_DIR=/amp/ftp/pub/sigrun/rapid
CONTAINER_DIR=/home/admin/rapid

# -- run container from image 
docker run -d -p $HOST_PORT:$CONTAINER_PORT -v $HOST_DIR:$CONTAINER_DIR $IMAGE:$VER

# -- container is now accessible but user can't login (mystery)
# -- update password for user admin to admin (standard)
CONTAINER=`docker ps | grep $IMAGE:$VER | awk '{print $1}'`
docker exec -it $CONTAINER grafana-cli admin reset-admin-password admin

# -- dashboards should be accessible 
echo Try to go to: http://$HOSTNAME:$HOST_PORT
