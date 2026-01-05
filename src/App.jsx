/**
 * NetMood Analyzer - 최상위 컴포넌트
 */

import React from 'react'
import { NetworkProvider } from './context/NetworkContext.jsx'
import { EmotionProvider } from './context/EmotionContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import Dashboard from './components/Dashboard.jsx'
import Toast from './components/Toast.jsx'
import './App.css'

function App() {
  return (
    <NetworkProvider>
      <EmotionProvider>
        <NotificationProvider>
          <div className="app">
            <Dashboard />
            <Toast />
          </div>
        </NotificationProvider>
      </EmotionProvider>
    </NetworkProvider>
  )
}

export default App

