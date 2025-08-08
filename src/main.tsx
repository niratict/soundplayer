import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './app'
import './styles/tailwind.css'

const qc = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={qc}>
    <App />
  </QueryClientProvider>
)