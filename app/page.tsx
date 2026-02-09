'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Sparkles, Moon, Sun } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Check if user is already selected
    const savedUser = localStorage.getItem('selectedUser')
    if (savedUser) {
      router.push('/tracker')
    }

    // Load dark mode preference
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true')
    }
  }, [router])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
  }

  const selectUser = (username: string) => {
    localStorage.setItem('selectedUser', username)
    router.push('/tracker')
  }

  if (!mounted) return null

  return (
    <main className={`min-h-screen p-6 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-black'
        : 'bg-gradient-to-br from-gray-100 via-white to-gray-50'
    }`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
          darkMode
            ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-black shadow-xl shadow-yellow-500/50'
            : 'bg-gradient-to-br from-gray-800 to-black text-yellow-400 shadow-xl'
        }`}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-yellow-500/10' : 'bg-gray-300/20'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-amber-500/10' : 'bg-gray-400/20'
        }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse ${
          darkMode ? 'bg-yellow-600/10' : 'bg-gray-300/20'
        }`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="inline-block animate-bounce">
            <Sparkles size={48} className={darkMode ? 'text-yellow-400 drop-shadow-lg' : 'text-amber-600 drop-shadow-lg'} />
          </div>
          <h1 className={`text-5xl font-black mb-2 drop-shadow-2xl tracking-tight ${
            darkMode
              ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent'
              : 'text-gray-900'
          }`}>
            Health Tracker
          </h1>
          <p className={`text-lg font-medium drop-shadow-md ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Select your profile to continue</p>
        </div>

        <div className="space-y-5">
          <button
            onClick={() => selectUser('Lamisa')}
            className={`group w-full rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 transform ${
              darkMode
                ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-black'
                : 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white'
            }`}
            style={{
              transform: 'perspective(1000px) rotateX(0deg)',
              boxShadow: darkMode 
                ? '0 20px 60px rgba(251, 191, 36, 0.5), 0 0 0 1px rgba(255,255,255,0.2) inset'
                : '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.2) inset'
            }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className={`p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 ${
                darkMode ? 'bg-black/30' : 'bg-white/20'
              }`}>
                <User size={32} className={`drop-shadow-lg ${darkMode ? 'text-black' : 'text-yellow-400'}`} />
              </div>
              <span className="text-3xl font-bold drop-shadow-lg">Lamisa</span>
            </div>
          </button>

          <button
            onClick={() => selectUser('Raed')}
            className={`group w-full rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 transform ${
              darkMode
                ? 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-600 text-black'
                : 'bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-gray-700 text-white'
            }`}
            style={{
              transform: 'perspective(1000px) rotateX(0deg)',
              boxShadow: darkMode 
                ? '0 20px 60px rgba(245, 158, 11, 0.5), 0 0 0 1px rgba(255,255,255,0.2) inset'
                : '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.2) inset'
            }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className={`p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 ${
                darkMode ? 'bg-black/30' : 'bg-white/20'
              }`}>
                <User size={32} className={`drop-shadow-lg ${darkMode ? 'text-black' : 'text-yellow-400'}`} />
              </div>
              <span className="text-3xl font-bold drop-shadow-lg">Raed</span>
            </div>
          </button>
        </div>

        <div className={`text-center text-sm mt-8 animate-pulse ${
          darkMode ? 'text-yellow-400/80' : 'text-gray-600'
        }`}>
          <p className="drop-shadow-md">✨ Tap on your name to start tracking ✨</p>
        </div>
      </div>
    </main>
  )
}

