
![npm](https://img.shields.io/npm/v/traefikjam)
[![Node Build](https://github.com/jojobyte/traefikjam/actions/workflows/node-build.yml/badge.svg)](https://github.com/jojobyte/traefikjam/actions/workflows/node-build.yml)
![Docker Image Version](https://img.shields.io/docker/v/jojobyte/traefikjam/latest?label=DockerHub)
[![Docker Build](https://github.com/jojobyte/traefikjam/actions/workflows/docker-build.yml/badge.svg)](https://github.com/jojobyte/traefikjam/actions/workflows/docker-build.yml)

# Traefik Jam

A small (zero dependency) Node.js CLI utility to convert Traefik Let's Encrypt certificates from acme.json to PEM files

## Node.js Install

```sh
npm install -g traefikjam

yarn global add traefikjam

pnpm add -g traefikjam
```
[Install from NPM](https://www.npmjs.com/package/traefikjam)

[Install from GitHub Packages](https://github.com/jojobyte/traefikjam/packages/1456711)

## Deno Usage
```sh
deno run --compat --unstable --allow-env \
  --allow-read --allow-write=./certs \
  bin/traefik-jam.js ./data/acme.json example.net
```

## CLI Usage
```sh
# show help
traefikjam -h

# extract all domains from ./data/acme.json
traefikjam ./data/acme.json

# extract example.net & github.com from ./data/acme.json
traefikjam ./data/acme.json example.net github.com

# watch ./data/acme.json and export selected domains on change
traefikjam --watch ./data/acme.json example.net github.com
```

## API Usage
```js
import { exportCerts } from 'traefikjam'
exportCerts('./path/to/acme.json', 'example.domain.com')
```

## Docker

```sh
# show help
docker run --rm -it \
  -v $PWD/data:/opt/app/data \
  -v $PWD/certs:/opt/app/certs \
  jojobyte/traefikjam:latest -- -h

# extract example.net from /acme.json
docker run --rm -it \
  -v $PWD/data:/opt/app/data \
  -v $PWD/certs:/opt/app/certs \
  jojobyte/traefikjam:latest -- ./data/acme.json example.net
```

[Install from Docker Hub](https://hub.docker.com/r/jojobyte/traefikjam)

[Install from GitHub Container Registry](https://github.com/jojobyte/traefikjam/pkgs/container/traefikjam)
