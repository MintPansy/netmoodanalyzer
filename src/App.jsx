/**
 * NetMood Analyzer - 최상위 컴포넌트
 */

import React from 'react'
import { NetworkProvider } from './context/NetworkContext.jsx'
import { EmotionProvider } from './context/EmotionContext.jsx'
import Dashboard from './components/Dashboard.jsx'
import './App.css'

function App() {
  return (
    <NetworkProvider>
      <EmotionProvider>
        <div className="app">
          <Dashboard />
        </div>
      </EmotionProvider>
    </NetworkProvider>
  )
}

export default App

