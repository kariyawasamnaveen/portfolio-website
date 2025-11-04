'use client'
import { useEffect, useRef, useState } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default function CodeEditor({ language = 'python', initialCode = '' }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return

    const lang = language === 'python' ? python() : javascript()
    
    const view = new EditorView({
      doc: initialCode,
      extensions: [basicSetup, lang, oneDark],
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [language, initialCode])

  const runCode = async () => {
    if (!viewRef.current) return
    
    const code = viewRef.current.state.doc.toString()
    setLoading(true)
    setOutput('Running...')

    try {
      if (language === 'javascript') {
        const result = eval(code)
        setOutput(String(result))
      } else {
        // Python - using Pyodide
        setOutput('Loading Python environment...')
        // @ts-ignore
        const pyodide = await window.loadPyodide()
        const result = await pyodide.runPythonAsync(code)
        setOutput(String(result))
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div ref={editorRef} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden" />
      
      <button
        onClick={runCode}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>

      {output && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  )
}