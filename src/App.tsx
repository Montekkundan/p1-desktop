import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import './App.css'
import { Toaster } from 'sonner'
import ControlLayer from './layouts/ControlLayer'
import AuthButton from './components/Global/AuthButton'
import Widget from './components/Global/Widget'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ControlLayer>
        <AuthButton />
        <Widget />
      </ControlLayer>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
