'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CodeEditor from '@/components/CodeEditor'

export default function PlaygroundPage() {
  const [language, setLanguage] = useState('python')
  const [selectedExample, setSelectedExample] = useState(0)

  const examples = {
    python: [
      {
        name: 'Hello World',
        code: `print("Hello, World!")
result = "Python is running!"
result`
      },
      {
        name: 'List Comprehension',
        code: `numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(squared)
squared`
      },
      {
        name: 'Simple Function',
        code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = [fibonacci(i) for i in range(10)]
print(result)
result`
      }
    ],
    javascript: [
      {
        name: 'Hello World',
        code: `console.log("Hello, World!");
"JavaScript is running!"`
      },
      {
        name: 'Array Methods',
        code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log(doubled);
doubled;`
      },
      {
        name: 'Arrow Function',
        code: `const sum = (a, b) => a + b;
const result = sum(5, 3);
console.log('Sum:', result);
result;`
      }
    ]
  }

  useEffect(() => {
    // Load Pyodide for Python
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
    document.body.appendChild(script)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Code Playground
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Try Python and JavaScript code right in your browser
          </p>
        </motion.div>

        {/* Language Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setLanguage('python')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              language === 'python'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            🐍 Python
          </button>
          <button
            onClick={() => setLanguage('javascript')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              language === 'javascript'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            ⚡ JavaScript
          </button>
        </div>

        {/* Example Selector */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold">
            Try an example:
          </p>
          <div className="flex flex-wrap gap-3">
            {examples[language as keyof typeof examples].map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedExample(idx)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedExample === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <CodeEditor
            key={`${language}-${selectedExample}`}
            language={language}
            initialCode={examples[language as keyof typeof examples][selectedExample].code}
          />
        </div>

        {/* Flutter Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Flutter Widget Previews
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Examples of Flutter widgets I've built
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
                  Flutter #{i}
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
                  Custom Widget Example
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}