
BASEPATH="/var/lib/grafana/plugins"
for plugin_name in volcano-camera volcano-alert-level 
do
	cd $BASEPATH/$plugin_name
	yarn install 
	yarn dev
done 

