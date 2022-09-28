import path from 'node:path'
import fs from 'node:fs'
import url from 'node:url'
import { parse, compileScript } from 'vue/compiler-sfc'
import prettier from 'prettier'

const root = path.dirname(url.fileURLToPath(import.meta.url))
const index = fs.readFileSync(path.resolve(root, 'src', 'index.vue'), 'utf-8')

const { descriptor } = parse(index)
const { script, scriptSetup } = descriptor

let content = ''

if (script || scriptSetup) {
  if (scriptSetup) {
    const compiled = compileScript(descriptor, {
      id: 'abc'
    })

    content = compiled.content
  } else if (script) {
    content = script.content
  }
}

content = prettier.format(
  content,
  {
    parser: 'typescript',
    printWidth: 100,
    arrowParens: 'avoid',
    bracketSpacing: true,
    endOfLine: 'lf',
    jsxBracketSameLine: false,
    quoteProps: 'as-needed',
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
    vueIndentScriptAndStyle: false
  }
)

fs.writeFileSync(path.resolve(root, 'src/index.ts'), content, 'utf-8')
