
BASEPATH="/var/lib/grafana/plugins"
for PLUGIN in volcano-camera volcano-alert-level fits-observation fits-spatial-observation fits-sites quakesearch seis-stations static-plots
do
	echo "### INSTALLING $PLUGIN ###"
	cd $BASEPATH/$PLUGIN
	yarn install 
	yarn dev
done 

