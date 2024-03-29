import fs from 'node:fs'
import path from 'node:path'

/**
 * Read certificates from acme.json with optional filter
 *
 * @example
 *   // all certs in file
 *   exportCerts('./acme.json')
 *
 *   // only certs for github.com in file
 *   exportCerts('./acme.json', 'github.com')
 *
 *   // save certs to `certificates/` dir
 *   exportCerts('./acme.json', null, 'certificates/')
 *
 * @param {string} file path to acme.json
 * @param {string} [search=null] for this domain
 * @param {string} [outputDir='certs/'] output directory for certificates
 *
 * @void
 */
export async function exportCerts(
  file,
  search = null,
  outputDir = 'certs/'
) {
  console.info('export traefik certs for domain:', search)

  let fileData = await fs.promises.readFile(
    file === '.' ? `${file}/acme.json` : file,
    'utf8'
  )

  let data = await JSON.parse(fileData)

  if (!data) {
    return
  }

  if (!data.Certificates) {
    data = Object.values(data).flatMap(
      v => v.Certificates !== null ? v.Certificates : []
    )
  } else {
    data = data.Certificates
  }

  if (search !== null) {
    data = data.filter(
      v =>
        v.Domain?.Main?.includes(search) ||
        v.domain?.main?.includes(search)
    )
  }

  data.forEach(async c => {
    let {
      Certificate, Key, Domain,
      certificate, key, domain,
    } = c
    let dom = Domain || domain
    let main = dom.Main || dom.main
    let cert = Certificate || certificate
    let skey = Key || key

    let d = main.replace('*.', '_.')

    const [cf] = await save(`${d}.crt`, Buffer.from(cert, 'base64').toString(), outputDir)
    const [kf] = await save(`${d}.key`, Buffer.from(skey, 'base64').toString(), outputDir)
    const [tf] = await save(`${d}.json`, JSON.stringify(dom), outputDir)

    console.info(`saved ${main}`, [cf, kf, tf])
  })
}

/**
 * Watch certificates directory
 *
 * @example
 *   // watch all domains in file
 *   await watchCerts('./acme.json')
 *
 * @param {string} [inputDir='data/'] input directory for certificates
 * @param {string[]} targetDomains Array of domain strings to find
 *
 * @void
 */
export async function watchCerts(
  inputDir = './data/',
  targetDomains = process.argv.slice(3) || [],
) {
  const pp = path.parse(inputDir)
  const ac = new AbortController();
  const { signal } = ac;

  try {
    const watcher = fs.promises.watch(inputDir, { signal, persistent: true });
    const changes = {}

    console.group('watching')
    console.info('path', path.resolve(inputDir))
    console.info('domains', targetDomains)
    console.groupEnd()

    for await (const event of watcher) {
      const dir = path.resolve(path.join(pp.dir, event.filename))
      // console.info('event', event.eventType, dir)

      if (changes[event.filename]) {
        clearTimeout(changes[event.filename])
      }

      // prevent editors triggering multiple exports
      changes[event.filename] = setTimeout(() => {
        cmd(dir, targetDomains)
        delete changes[event.filename]
      }, 1000)
    }
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
}

/**
 * Save file
 *
 * @example
 *   let [filepath, dir] = save('./foobar.txt', 'foo', 'data/')
 *   // filepath === './data/foobar.txt'
 *   // dir === './data'
 *
 * @param {string} file Name of file to save
 * @param {string} data Data to save to file
 * @param {string} [outputDir='certs/'] Directory to output files
 *
 * @returns {[string,string]} File path and output directory
 */
export async function save(file, data, outputDir = 'certs/') {
  const fp = path.join(outputDir, file)

  fs.mkdirSync(outputDir, { recursive: true })

  await fs.createWriteStream(fp).write(data)

  return [fp, outputDir]
}

/**
 * Array contains any
 *
 * @example
 *   let contains = containsAny(['a', 'b', 'c'], ['x', 'b'])
 *   // contains === true
 *   let contains = containsAny(['a', 'b', 'c'], ['x', 'y', 'z'])
 *   // contains === false
 *
 * @param {string[]} hay Haystack
 * @param {string[]} needles Needles
 *
 * @returns {boolean} At least one of Needles exist in Haystack
 */
export function containsAny(hay, needles) {
  let found = false

  for (let needle of needles) {
    if (hay.includes(needle)) {
      found = true
      break
    }
  }

  return found
}

/**
 * Filter based on domains from Array | CLI Args
 *
 * @example
 *   cmd('./acme.json', ['foo','bar'])
 *   // e.g. given `traefik-jam ./acme.json foo bar`
 *   // targetDomains === ['foo', 'bar']
 *
 * @param {string} acmeFile Path to acme.json file
 * @param {string[]} targetDomains Array of domain strings to find
 *
 * @void
 */
export function cmd(
  acmeFile = process.argv[2] || './data/acme.json',
  targetDomains = process.argv.slice(3) || [],
) {
  if (targetDomains?.length > 0) {
    targetDomains.forEach(domain => exportCerts(acmeFile, domain))
  } else {
    exportCerts(acmeFile)
  }
}

export default exportCerts