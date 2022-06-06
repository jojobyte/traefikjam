#!/usr/bin/env node

process.removeAllListeners('warning')
process.on('SIGTERM', () => process.exit());
process.on('SIGINT', () => process.exit());

import { cmd, watchCerts, containsAny } from '../src/index.js'
import pkg from '../package.json' assert { type: 'json' }

const { name, description, version } = pkg

let args = process.argv.slice(2).filter(
  arg => '-c' !== arg
)

if (containsAny(args, ['-h', '--help'])) {
  console.info(`
\x1b[91m${name}\x1b[0m \x1b[92mv${version}\x1b[0m
  \x1b[2m${description.split('k L').join('k\n  L')}\x1b[0m

\x1b[11m${'USAGE:'}\x1b[0m
  \x1b[1m${name}\x1b[0m \x1b[91m${'[./path/to/acme.json]'}\x1b[0m \x1b[93m${'[...domains]'}\x1b[0m

  \x1b[1m${name}\x1b[0m \x1b[95m${'-w'}\x1b[0m \x1b[91m${'[./path/to/acme.json]'}\x1b[0m \x1b[93m${'[...domains]'}\x1b[0m

\x1b[11m${'OPTIONS:'}\x1b[0m
  \x1b[11m${'-h, --help'}\x1b[0m      \x1b[2m${'Display this help info'}\x1b[0m
  \x1b[11m${'-w, --watch'}\x1b[0m     \x1b[2m${'Watch the ACME JSON file and re-export on change'}\x1b[0m
  `)
} else if (containsAny(args, ['-w', '--watch'])) {
  args = args.filter(
    arg => !['-w', '--watch'].includes(arg)
  )
  cmd(args[0] || './data/acme.json', args.slice(1))
  await watchCerts(args[0] || './data', args.slice(1))
} else {
  cmd(process.argv[2] || './data/acme.json', process.argv.slice(3))
}