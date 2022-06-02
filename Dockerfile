FROM node:18-alpine

LABEL maintainer="jojobyte <byte@jojo.io>"

ENV APP_DIR /opt/app

WORKDIR $APP_DIR

ADD ./ $APP_DIR

RUN npm link

ENTRYPOINT /usr/local/bin/traefikjam $@

VOLUME /acme.json $APP_DIR/certs

CMD /usr/local/bin/traefikjam
