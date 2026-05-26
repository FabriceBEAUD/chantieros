import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import { Chantiers, Finance, Situations, RH, Securite, Planning, AO, Materiel } from './pages/Pages'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/chantiers"  element={<Chantiers />} />
          <Route path="/planning"   element={<Planning />} />
          <Route path="/finance"    element={<Finance />} />
          <Route path="/situations" element={<Situations />} />
          <Route path="/rh"         element={<RH />} />
          <Route path="/securite"   element={<Securite />} />
          <Route path="/ao"         element={<AO />} />
          <Route path="/materiel"   element={<Materiel />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
