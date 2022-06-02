
![npm](https://img.shields.io/npm/v/traefikjam)
[![Node Build](https://github.com/jojobyte/traefikjam/actions/workflows/node-build.yml/badge.svg)](https://github.com/jojobyte/traefikjam/actions/workflows/node-build.yml)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/jojobyte/traefikjam?label=docker%20hub)
[![Docker Build](https://github.com/jojobyte/traefikjam/actions/workflows/docker-build.yml/badge.svg)](https://github.com/jojobyte/traefikjam/actions/workflows/docker-build.yml)

# Traefik Jam

A small (zero dependency) Node.js CLI utility to convert Traefik Let's Encrypt certificates from acme.json to PEM files

```sh
npm install -g traefikjam

yarn global add traefikjam

pnpm add -g traefikjam
```

# Usage
```sh
# show help
traefikjam -h

# extract all domains from ./data/acme.json
traefikjam ./data/acme.json

# extract example.net & github.com from ./data/acme.json
traefikjam ./data/acme.json example.net github.com
```

# Docker
```sh
# show help
docker run --rm -it \
  -v $PWD/data/acme.json:/acme.json \
  -v $PWD/certs:/opt/app/certs \
  jojobyte/traefikjam:latest -- -h

# extract example.net from /acme.json
docker run --rm -it \
  -v $PWD/data/acme.json:/acme.json \
  -v $PWD/certs:/opt/app/certs \
  jojobyte/traefikjam:latest -- /acme.json example.net
```