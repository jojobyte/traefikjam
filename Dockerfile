FROM node:18-alpine

LABEL maintainer="jojobyte <byte@jojo.io>"

ENV APP_DIR /opt/app

WORKDIR $APP_DIR

ADD ./ $APP_DIR

RUN npm link

ENTRYPOINT ["/usr/local/bin/traefikjam"]

VOLUME $APP_DIR/data $APP_DIR/certs

CMD ["-w", "./data/acme.json"]
