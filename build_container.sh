
NAME="volcano-dashboard"
HOST_PORT="3001"
CONTAINER_PORT="3000"

# -- Build docker container
docker build -t $NAME . &&

# -- Run docker container
docker run -d \
 -p $HOST_PORT:$CONTAINER_PORT \
 -e GF_DEFAULT_APP_MODE='development' \
 $NAME

# -- Find Grafana
CONTAINER=`docker ps | grep $NAME | awk '{print $1}'`
PORT=`docker inspect $CONTAINER | grep HostPort | tail -1 | awk -F\" '{print $4}'`

echo grafana_dev up and running $CONTAINER
echo Try
echo http://`hostname`:$PORT

# -- talk to API to create a new user
curl -XPOST -H "Content-Type: application/json" -d '{"name": "User", "email": "", "login": "user", "password":"user"}' http:///admin:admin@$HOSTNAME:$HOST_PORT/api/admin/users
