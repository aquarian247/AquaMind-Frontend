import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RBACProvider } from './lib/RBACContext'
import OperationsManager from './pages/OperationsManager'


function App() {
  return (
    <RBACProvider>
      <Router>
        <Routes>
          <Route path="/" element={<OperationsManager />} />
        </Routes>
      </Router>
    </RBACProvider>
  )
}

export default App

