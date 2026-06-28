import { Download, FileText, Minus, Plus, Printer, RotateCcw } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import './App.css'

const initialPhrase = 'Нельзя выбрасывать подарки!'
const practiceRows = 20
const sheetTextWidthMm = 172
const cssPxPerMm = 96 / 25.4

type CopyRun = {
  text: string
  script: 'default' | 'latin'
}

const latinLetterPattern = /\p{Script=Latin}/u
const cyrillicLetterPattern = /\p{Script=Cyrillic}/u
const whitespacePattern = /\s/
const textMeasureCache = new Map<string, number>()
let measureCanvasContext: CanvasRenderingContext2D | null = null

function getMeasureContext() {
  if (typeof document === 'undefined') {
    return null
  }

  if (!measureCanvasContext) {
    measureCanvasContext = document.createElement('canvas').getContext('2d')
  }

  return measureCanvasContext
}

function getScriptForChar(char: string): CopyRun['script'] {
  if (latinLetterPattern.test(char)) {
    return 'latin'
  }

  if (cyrillicLetterPattern.test(char)) {
    return 'default'
  }

  return 'default'
}

function measureCopyText(value: string, fontSize: number) {
  const context = getMeasureContext()

  if (!context) {
    return value.length * fontSize * 0.58
  }

  let width = 0

  for (const char of value) {
    const script = getScriptForChar(char)
    const cacheKey = `${fontSize}:${script}:${char}`
    const cachedWidth = textMeasureCache.get(cacheKey)

    if (cachedWidth !== undefined) {
      width += cachedWidth
      continue
    }

    context.font =
      script === 'latin'
        ? `${fontSize}px "Playwrite US Trad", "Segoe Print", cursive`
        : `${fontSize}px "Propisi", "Primo", "Segoe Print", "Comic Sans MS", cursive`

    const measuredWidth = context.measureText(char).width
    textMeasureCache.set(cacheKey, measuredWidth)
    width += measuredWidth
  }

  return width
}

function findLastSoftBreak(value: string) {
  for (let index = value.length - 1; index > 0; index -= 1) {
    if (whitespacePattern.test(value[index])) {
      return index
    }
  }

  return -1
}

function wrapCopyLine(line: string, fontSize: number) {
  if (!line) {
    return ['']
  }

  const maxWidth = sheetTextWidthMm * cssPxPerMm
  const rows: string[] = []
  let currentLine = ''

  for (const char of line) {
    const candidateLine = `${currentLine}${char}`

    if (currentLine && measureCopyText(candidateLine, fontSize) > maxWidth) {
      const breakIndex = findLastSoftBreak(currentLine)

      if (breakIndex > 0) {
        rows.push(currentLine.slice(0, breakIndex).trimEnd())
        currentLine = `${currentLine.slice(breakIndex).trimStart()}${char}`
      } else {
        rows.push(currentLine)
        currentLine = char
      }
    } else {
      currentLine = candidateLine
    }
  }

  rows.push(currentLine)

  return rows
}

function buildSampleRows(value: string, fontSize: number) {
  return value.replace(/\r\n/g, '\n').split('\n').flatMap((line) => wrapCopyLine(line, fontSize))
}

function splitPhraseByScript(value: string) {
  const runs: CopyRun[] = []
  let currentScript: CopyRun['script'] = 'default'

  for (const char of value) {
    let script: CopyRun['script'] = currentScript

    if (latinLetterPattern.test(char)) {
      script = 'latin'
    } else if (cyrillicLetterPattern.test(char)) {
      script = 'default'
    }

    const currentRun = runs.at(-1)

    if (currentRun && currentRun.script === script) {
      currentRun.text += char
    } else {
      runs.push({ text: char, script })
    }

    currentScript = script
  }

  return runs
}

function App() {
  const [sourcePhrase, setSourcePhrase] = useState(initialPhrase)
  const [studentName, setStudentName] = useState('Настя')
  const [fontSize, setFontSize] = useState(32)
  const [, setFontMetricsVersion] = useState(0)

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) {
      return
    }

    document.fonts.ready.then(() => {
      textMeasureCache.clear()
      setFontMetricsVersion((version) => version + 1)
    })
  }, [])

  const phrase = sourcePhrase.trimEnd()
  const sampleRows = buildSampleRows(phrase, fontSize)
  const emptyRows = Math.max(0, practiceRows + 1 - sampleRows.length)
  const sheetStyle = {
    '--copy-size': `${fontSize}px`,
  } as CSSProperties

  return (
    <main className="app-shell">
      <section className="control-panel" aria-label="Настройки листа">
        <div className="brand-row">
          <div className="brand-mark">
            <FileText size={22} strokeWidth={1.8} />
          </div>
          <div>
            <p className="eyebrow">Генератор прописей</p>
            <h1>Пропись как тетрадный лист</h1>
          </div>
        </div>

        <label className="field">
          <span>Имя в шапке</span>
          <input value={studentName} onChange={(event) => setStudentName(event.target.value)} />
        </label>

        <label className="field">
          <span>Фраза для листа</span>
          <textarea
            value={sourcePhrase}
            onChange={(event) => setSourcePhrase(event.target.value)}
            rows={4}
            spellCheck="false"
          />
        </label>

        <div className="settings-grid">
          <label className="range-field">
            <span>Размер текста</span>
            <div className="stepper">
              <button type="button" onClick={() => setFontSize((value) => Math.max(24, value - 1))}>
                <Minus size={16} />
              </button>
              <output>{fontSize}px</output>
              <button type="button" onClick={() => setFontSize((value) => Math.min(42, value + 1))}>
                <Plus size={16} />
              </button>
            </div>
          </label>
        </div>

        <div className="action-row">
          <button className="secondary-button" type="button" onClick={() => setSourcePhrase(initialPhrase)}>
            <RotateCcw size={17} />
            Сбросить
          </button>
          <button className="primary-button" type="button" onClick={() => window.print()}>
            <Printer size={17} />
            Печать / PDF
          </button>
        </div>

        <p className="note">
          Фраза печатается образцом сверху. Длинные строки переносятся по ширине листа, а переносы в поле сохраняются.
        </p>
      </section>

      <section className="preview-stage" aria-label="Предпросмотр A4">
        <div className="preview-toolbar">
          <span>{practiceRows} строк для письма</span>
          <button type="button" onClick={() => window.print()}>
            <Download size={16} />
            PDF
          </button>
        </div>

        <article className="sheet" style={sheetStyle}>
          <div className="sheet-body">
            {phrase.trim() ? (
              <section className="practice-block">
                {sampleRows.map((sampleRow, rowIndex) => (
                  <div className="copy-row sample-row" key={`sample-${rowIndex}`}>
                    <p>
                      {splitPhraseByScript(sampleRow).map((run, index) => (
                        <span
                          className={run.script === 'latin' ? 'copy-run copy-run-latin' : 'copy-run'}
                          key={`${run.script}-${rowIndex}-${index}`}
                        >
                          {run.text || '\u00A0'}
                        </span>
                      ))}
                    </p>
                  </div>
                ))}
                {Array.from({ length: emptyRows }, (_, index) => (
                  <div
                    className="copy-row empty-row"
                    aria-label="Пустая строка для письма"
                    key={index}
                  />
                ))}
              </section>
            ) : (
              <div className="empty-state">Добавь фразу слева, и здесь появится лист.</div>
            )}
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
