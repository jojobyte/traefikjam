FROM node:18-alpine

LABEL maintainer="jojobyte <jojobyte@0t.lc>"

ENV APP_DIR /opt/app

WORKDIR $APP_DIR

ADD ./ $APP_DIR

RUN npm link

ENTRYPOINT /usr/local/bin/traefikjam $@

VOLUME /acme.json $APP_DIR/certs

CMD /usr/local/bin/traefikjam
