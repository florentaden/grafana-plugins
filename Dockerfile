
from grafana/grafana:9.0.0-ubuntu

USER root

# -- install basics 
RUN apt-get update && apt-get install -y sudo vim curl gnupg

# -- install yarn 
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt-get update && sudo apt-get install yarn -y 

# -- install last version of node (v18.4.0 at the time)
#RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash 
#RUN bash $HOME/.nvm/nvm.sh
#RUN export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
#RUN nvm install v18.4.0

# -- create admin user
RUN useradd -rm -d /home/admin -s /bin/bash -g root -G sudo -u 1001 admin ; passwd -d admin
USER admin

# -- ADD plugins to grafana plugins dir
ADD grafana-plugins/fits-sites /var/lib/grafana/plugins/fits-sites/
ADD grafana-plugins/fits-observation /var/lib/grafana/plugins/fits-observation/
ADD grafana-plugins/geonet-map /var/lib/grafana/plugins/geonet-map/
ADD grafana-plugins/tilde-data /var/lib/grafana/plugins/tilde-data/
ADD grafana-plugins/tilde-datasummary /var/lib/grafana/plugins/tilde-datasummary/
ADD grafana-plugins/volcano-camera /var/lib/grafana/plugins/volcano-camera/
ADD install_plugin.sh /home/admin/

RUN sudo chown -R admin /var
