FROM ruby:2.2


#################
# Env variables #
#################
ENV NODE_VERSION 0.12.2
ENV NPM_VERSION 2.7.3

ENV SASS_VERSION 3.2.9
ENV COMPASS_VERSION 0.12.7

###################
# Install Node.js #
###################
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D 114F43EE0176B71C7BC219DD50A3051F888C628D

RUN curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
	&& curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
	&& gpg --verify SHASUMS256.txt.asc \
	&& grep " node-v$NODE_VERSION-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
	&& tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
	&& rm "node-v$NODE_VERSION-linux-x64.tar.gz" SHASUMS256.txt.asc \
	&& npm install -g npm@"$NPM_VERSION" \
	&& npm cache clear

##################
# Install addons #
##################
RUN gem install sass --version $SASS_VERSION
RUN gem install compass --version $COMPASS_VERSION
RUN npm install -g grunt-cli bower

RUN mkdir -p /data
WORKDIR /data
VOLUME ["/data"]

ADD docker-entrypoint.sh /data/docker-entrypoint.sh
ENTRYPOINT ["/data/docker-entrypoint.sh"]
CMD ["serve"]