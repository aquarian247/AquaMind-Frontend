import React, { createContext, useContext, useState, useEffect } from 'react'

const RBACContext = createContext()

export function RBACProvider({ children }) {
  const [currentGeography, setCurrentGeography] = useState('global')
  const [isDark, setIsDark] = useState(false)

  // Apply dark mode class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const value = {
    currentGeography,
    setCurrentGeography,
    isDark,
    setIsDark,
  }

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>
}

export function useRBAC() {
  const context = useContext(RBACContext)
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider')
  }
  return context
}

