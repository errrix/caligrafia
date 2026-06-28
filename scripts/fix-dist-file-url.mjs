import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const indexPath = resolve('dist/index.html')
const html = readFileSync(indexPath, 'utf8')
  .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, '<script defer src="$1"></script>')
  .replace(/\s+crossorigin(?=[\s>])/g, '')

writeFileSync(indexPath, html)
