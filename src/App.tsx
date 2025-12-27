import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import './App.css'

import FileForm from './containers/file_form'

function App() {

  // Create react-query client
  const queryCLient = new QueryClient()

  return (
    <QueryClientProvider client={queryCLient}>
      <FileForm />
    </QueryClientProvider>
  )
}

export default App
