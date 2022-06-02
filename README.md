# Traefik Jam

A small (zero dependency) Node.js CLI utility to convert Traefik Let's Encrypt certificates from acme.json to PEM files

```sh
npm install -g traefikjam

yarn global add traefikjam

pnpm add -g traefikjam
```

# Usage
```sh
traefikjam ./data/acme.json example.net github.com
```

# Docker
```sh
docker run --rm -it \
  -v $PWD/data/acme.json:/acme.json \
  -v $PWD/certs:/opt/app/certs \
  jojobyte/traefikjam:latest -- -h
```