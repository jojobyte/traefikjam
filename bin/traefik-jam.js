#!/usr/bin/env node

import { cmd } from '../src/index.js'

if (['-h','--help'].includes(process.argv[2])) {
  console.log('\x1b[2mUsage:\x1b[0m \x1b[1mtraefik-jam\x1b[0m \x1b[2m\x1b[3m\x1b[91m[./acme.json]\x1b[0m \x1b[2m\x1b[3m\x1b[93m[...domains]\x1b[0m')
} else {
  cmd(process.argv[2] || './data/acme.json', process.argv.slice(3))
}