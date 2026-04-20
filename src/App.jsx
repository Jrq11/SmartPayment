import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminPage from './pages/AdminPage'
import BreakdownsPage from './pages/BreakdownsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import StudentsPage from './pages/StudentsPage'
import TransactionsPage from './pages/TransactionsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/breakdowns" element={<BreakdownsPage />} />
      <Route path="/students/:yearLevel" element={<StudentsPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
