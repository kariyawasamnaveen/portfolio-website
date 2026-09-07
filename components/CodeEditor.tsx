'use client'
import { useEffect, useRef } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const DEMO_CODE = {
  python: `# Fibonacci sequence with memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

results = [fibonacci(i) for i in range(10)]
print(results)
# → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
  javascript: `// Async data fetching with error handling
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

fetchUserData(42).then(console.log);
// → { success: true, data: { id: 42, name: 'Naveen' } }`
};

const DEMO_OUTPUT = {
  python: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
  javascript: '{ success: true, data: { id: 42, name: 'Naveen' } }'
};

export default function CodeEditor({ language = 'python', initialCode = '' }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const code = initialCode || DEMO_CODE[language as keyof typeof DEMO_CODE] || '';

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return

    const lang = language === 'python' ? python() : javascript()

    const view = new EditorView({
      doc: code,
      extensions: [
        basicSetup,
        lang,
        oneDark,
        EditorView.editable.of(false),
      ],
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [language, code])

  const sampleOutput = !initialCode ? DEMO_OUTPUT[language as keyof typeof DEMO_OUTPUT] : null;

  return (
    <div className="space-y-4">
      <div ref={editorRef} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden" />

      {sampleOutput && (
        <div className="bg-gray-900 border border-white/10 rounded-lg p-4 font-mono text-sm">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Sample Output
          </div>
          <span className="text-green-400">{sampleOutput}</span>
        </div>
      )}
    </div>
  )
}
