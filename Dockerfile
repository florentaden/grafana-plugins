ARG BUILDER_IMAGE=grafana/grafana:9.3.1-ubuntu
ARG RUNNER_IMAGE=grafana/grafana-oss:9.3.1
ARG RUN_USER=nobody

# -- builder: compile plugins

FROM ${BUILDER_IMAGE} as builder
USER root

# -- install basics
RUN apt-get update && apt-get install -y sudo vim curl gnupg python make g++ jq
ENV NODE_VERSION 16.10.0
ENV NPM_CACHE_FOLDER=/root/.cache/npm

SHELL ["/bin/bash", "--login", "-i", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN source ~/.nvm/nvm.sh
RUN nvm install $NODE_VERSION
RUN nvm alias default $NODE_VERSION
RUN nvm use default

# -- install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt-get update && sudo apt-get install yarn -y
RUN npm install -g package-json-merge

# -- compile plugins
COPY plugins /var/lib/grafana/plugins/
COPY build_plugins.sh /var/lib/grafana
WORKDIR /var/lib/grafana
RUN ./build_plugins.sh
# -- plugins' distribution artifacts in /var/lib/grafana/dist/

# -- end of builder

# -- now build runtime container image

FROM ${RUNNER_IMAGE}
USER root

SHELL ["/bin/bash", "--login", "-i", "-c"]

# -- install basics
RUN apk add --update ca-certificates tzdata curl jq

# -- custom plugins from builder
COPY --from=builder /var/lib/grafana/plugins/dist /var/lib/grafana/plugins/

# -- other configs
COPY dashboards /var/lib/grafana/dashboards/
COPY provisioning  /etc/grafana/provisioning/
COPY grafana.ini /etc/grafana/

# -- install image panel and HTML plugins
WORKDIR /var/lib/grafana/plugins
RUN grafana-cli plugins install dalvany-image-panel
RUN grafana-cli plugins install aidanmountford-html-panel
RUN grafana-cli plugins install marcusolsson-csv-datasource
RUN grafana-cli plugins install marcusolsson-json-datasource

# -- finally, extra scripts
COPY post-init.sh /
RUN chmod +x /post-init.sh

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
