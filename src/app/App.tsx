
import { AppProviders } from './providers'
import { AppRouter } from './router'
import './styles/App.css'

function App() {

  return (
    <>
    <AppProviders>
      <AppRouter />
    </AppProviders>
    </>
  )
}

export default App
