#!/usr/bin/env node

process.removeAllListeners('warning')

import { cmd } from '../src/index.js'
import pkg from '../package.json' assert { type: 'json' }

const { name, description, version } = pkg

if (['-h','--help'].includes(process.argv[2])) {
  // console.info(`\x1b[91mtraefik-jam\x1b[0m \x1b[92mv${pkg.version}\x1b[0m\n`)
  // console.info(`\x1b[2m${'USAGE:'}\x1b[0m`)
  console.info(`
  \x1b[91m${name}\x1b[0m \x1b[92mv${version}\x1b[0m
    \x1b[2m${description.split('k L').join('k\n    L')}\x1b[0m

  \x1b[1m${'USAGE:'}\x1b[0m
      \x1b[1m${name}\x1b[0m \x1b[91m${'[./path/to/acme.json]'}\x1b[0m \x1b[93m${'[...domains]'}\x1b[0m
  `)
} else {
  cmd(process.argv[2] || './data/acme.json', process.argv.slice(3))
}