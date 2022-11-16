
VER="0.1"
NAME="maninthemiddle"

# -- Volume(s) to mount 
HOST_DIR="/amp/ftp/pub/sigrun/rapid"  
CONTAINER_DIR="/rapid"

# -- Ports
HOST_PORT="8000"
CONTAINER_PORT="8000"

# -- Build docker container
docker build -t $NAME:$VER . &&

# -- Run docker container 
docker run -d \
 -p $HOST_PORT:$CONTAINER_PORT \
 -v $HOST_DIR:$CONTAINER_DIR \
 $NAME:$VER

# -- Find Grafana
CONTAINER=`docker ps | grep $NAME:$VER | awk '{print $1}'`
PORT=`docker inspect $CONTAINER | grep HostPort | tail -1 | awk -F\" '{print $4}'`

echo $NAME:$VER up and running $CONTAINER
echo Try
echo http://`hostname`:$PORT
