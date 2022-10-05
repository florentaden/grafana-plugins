
VER="0.1"
GP="/home/faden/work/dashboard/grafana-plugins"

# -- Build docker container
docker build -t grafana_dev:$VER . &&

# -- Run docker container 
docker run -d \
 -p 3000:3000 \
 grafana_dev:$VER
 #-v $GP:/var/lib/grafana/plugins \
 #grafana_dev:$VER

# -- Find Grafana
CONTAINER=`docker ps | grep grafana_dev:$VER | awk '{print $1}'`
PORT=`docker inspect $CONTAINER | grep HostPort | tail -1 | awk -F\" '{print $4}'`

echo grafana_dev:$VER up and running $CONTAINER
echo Try
echo http://`hostname`:$PORT
docker exec -it $CONTAINER /bin/bash 
