import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CrewBuilderPage from './pages/CrewBuilderPage'
import CrewViewPage from './pages/CrewViewPage'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crew" element={<CrewBuilderPage />} />
        <Route path="/crew/:id" element={<CrewViewPage />} />
      </Routes>
    </Layout>
  )
}

export default App