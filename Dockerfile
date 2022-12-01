
from grafana/grafana:9.0.0-ubuntu

USER root

# -- replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# -- install basics 
RUN apt-get update && apt-get install -y sudo vim curl gnupg python make g++

# -- install yarn 
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt-get update && sudo apt-get install yarn -y 

# -- custom plugins 
COPY plugins /var/lib/grafana/plugins/
COPY dashboards /var/lib/grafana/dashboards/
COPY provisioning  /etc/grafana/provisioning/
COPY grafana.ini /etc/grafana/
COPY install_plugins.sh /var/lib/grafana/

# -- create admin user
RUN useradd -rm -d /home/admin -s /bin/bash -g root -G sudo -u 1001 admin ; passwd -d admin
RUN chown -R admin /etc/grafana && chmod -R 777 /etc/grafana
RUN chown -R admin /var/lib/grafana && chmod -R 777 /var/lib/grafana

# -- install node 
WORKDIR /var/lib/grafana
USER admin
ENV NVM_DIR /home/admin/.nvm
ENV NODE_VERSION 16.10.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash \
	&& source $NVM_DIR/nvm.sh \
	&& nvm install $NODE_VERSION \
	&& nvm alias default $NODE_VERSION \
	&& nvm use default \
	&& bash install_plugins.sh
#       && cd /var/lib/grafana/plugins/volcano-camera \
#	&& yarn install \
#	&& yarn dev \
#	&& cd /var/lib/grafana/plugins/volcano-alert-level \
#	&& yarn install \
#	&& yarn dev

# -- install image panel and HTML plugins
WORKDIR /var/lib/grafana/plugins
RUN grafana-cli plugins install dalvany-image-panel 
RUN grafana-cli plugins install aidanmountford-html-panel
