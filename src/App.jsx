
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeContext'
import { useLanguage } from './LanguageContext'
import './App.css'
import ThemeToggleCat from './components/ThemeToggleCat'

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('personal')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))

    // Check for overdue todos every minute
    const interval = setInterval(() => {
      todos.forEach(todo => {
        if (todo.dueDate && !todo.completed) {
          const now = new Date()
          const due = new Date(todo.dueDate)
          if (due <= now) {
            if (Notification.permission === "granted") {
              new Notification("Todo Reminder", {
                body: `Task "${todo.text}" is due!`,
                icon: "/favicon.svg"
              })
            }
          }
        }
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [todos])

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window) {
      Notification.requestPermission()
    }
  }, [])

  const addTodo = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setTodos([...todos, {
      text: input,
      completed: false,
      id: Date.now(),
      category,
      priority,
      dueDate,
    }])
    setInput('')
    setDueDate('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const { isDark, setIsDark } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const languages = {
    en: '🇬🇧', ja: '🇯🇵', es: '🇪🇸',
    fr: '🇫🇷', hi: '🇮🇳', de: '🇩🇪'
  }

  const categories = ['personal', 'work', 'shopping', 'health']
  const priorities = ['high', 'medium', 'low']

  return (
    <main className={`container ${isDark ? 'dark' : 'light'}`}>
      <div className="header background-design">
        <img src='/logo-icon.png' alt='logo' className='main-logo' />
        <div className="controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            {Object.entries(languages).map(([code, flag]) => (
              <option key={code} value={code}>{flag} {code.toUpperCase()}</option>
            ))}
          </select>
          <ThemeToggleCat isDark={isDark} setIsDark={setIsDark} />

        </div>
      </div>
      <div className='main-container'>
        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('addTodo')}
            className="todo-input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="priority-select"
          >
            {priorities.map(pri => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
          <button type="submit" className="add-button">{t('addButton')}</button>
        </form>
        <ul className="todo-list">
          <AnimatePresence>
            {todos.map(todo => (
              <motion.li
                key={todo.id}
                className={`todo-item priority-${todo.priority}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <motion.input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  whileHover={{ scale: 1.2 }}
                />
                <div className="todo-content">
                  <motion.span className={todo.completed ? 'completed' : ''}>
                    {todo.text}
                  </motion.span>
                  <div className="todo-meta">
                    <span className={`category-tag ${todo.category}`}>
                      {todo.category}
                    </span>
                    <span className="due-date">
                      {todo.dueDate && new Date(todo.dueDate).toLocaleString()}
                    </span>
                  </div>
                </div>
                <motion.div
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-icon"
                  whileHover={{ scale: 1.2, color: '#ff0000' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </motion.div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </main>
  )
}
