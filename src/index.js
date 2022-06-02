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

  let data = JSON.parse((await fs.promises.readFile(file === '.' ? `${file}/acme.json` : file)).toString())

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

  // console.log('no data certs', data)

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

    const [cf] = await saveBase64(`${d}.crt`, cert, outputDir)
    const [kf] = await saveBase64(`${d}.key`, skey, outputDir)
    const [tf] = await save(`${d}.json`, JSON.stringify(dom), outputDir)

    console.info(`saved ${main}`, [cf, kf, tf])
  })
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
 * Save Base64 file
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
export async function saveBase64(file, data, outputDir = 'certs/') {
  return await save(file, Buffer.from(data, 'base64').toString(), outputDir)
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