import { Download, FileText, Minus, Plus, Printer, RotateCcw } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import './App.css'

const initialPhrase = 'Нельзя выбрасывать подарки!'
const practiceRows = 20

function App() {
  const [sourcePhrase, setSourcePhrase] = useState(initialPhrase)
  const [studentName, setStudentName] = useState('Настя')
  const [fontSize, setFontSize] = useState(32)

  const phrase = sourcePhrase.trim()
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
          <input
            value={sourcePhrase}
            onChange={(event) => setSourcePhrase(event.target.value)}
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
          Фраза печатается образцом в первой строке. Остальные строки остаются пустыми для
          самостоятельного письма до конца листа.
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
            {phrase ? (
              <section className="practice-block">
                <div className="copy-row sample-row">
                  <p>{phrase}</p>
                </div>
                {Array.from({ length: practiceRows }, (_, index) => (
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
