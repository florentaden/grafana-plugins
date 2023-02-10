#!/bin/bash

# run.sh runs grafana server in background
/run.sh &

# wait until grafana fully started
sleep 15

# run extra scripts, can call grafana api 
/post-init.sh &

# this wait for all background process ends, 
#   since Grafana never ends, so entrypoint.sh never ends, 
#   which makes the container not to exit 
wait
