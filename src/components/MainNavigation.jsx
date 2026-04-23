import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { studentGroups } from '../data/studentData'

const NavLabel = ({ icon, children }) => (
  <span className="dashboard-nav-label">
    <svg
      className="dashboard-nav-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon} />
    </svg>
    <span>{children}</span>
  </span>
)

const navIcons = {
  createPayment:
    'M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5Z',
  dashboard:
    'M4 5a2 2 0 0 1 2-2h4.8a2 2 0 0 1 2 2v4.8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm0 9.2a2 2 0 0 1 2-2h4.8a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.8ZM15.2 5a2 2 0 0 1 2-2H22a2 2 0 0 1 2 2v4.8a2 2 0 0 1-2 2h-4.8a2 2 0 0 1-2-2V5Zm0 9.2a2 2 0 0 1 2-2H22a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2h-4.8a2 2 0 0 1-2-2v-4.8Z',
  students:
    'M9 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6 1a2.5 2.5 0 1 0-2.45-3h-.1a4.9 4.9 0 0 1-1.08 2.24A4.5 4.5 0 0 1 15 12ZM4 18a5 5 0 1 1 10 0v1H4v-1Zm11 1v-1a6.9 6.9 0 0 0-1.05-3.66A4.5 4.5 0 0 1 20 18v1h-5Z',
  breakdowns:
    'M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.4a2 2 0 0 0-.59-1.41l-3.4-3.4A2 2 0 0 0 14.6 4H6Zm7 1.5V9a1 1 0 0 0 1 1h3.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h7Z',
  transactions:
    'M12 3a9 9 0 1 0 9 9 1 1 0 1 0 2 0A11 11 0 1 1 12 1a1 1 0 1 0 0 2Zm1 4a1 1 0 1 0-2 0v5.1c0 .27.11.52.29.71l3.5 3.5a1 1 0 1 0 1.42-1.42L13 11.59V7Z',
  logout:
    'M9 4a2 2 0 0 0-2 2v2a1 1 0 1 0 2 0V6h7v12H9v-2a1 1 0 1 0-2 0v2a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H9Zm-3.7 7.3a1 1 0 0 0 0 1.4l2.8 2.8a1 1 0 1 0 1.4-1.4L8.42 13H14a1 1 0 1 0 0-2H8.42l1.08-1.1a1 1 0 1 0-1.4-1.4l-2.8 2.8Z',
}

function MainNavigation({ showCreatePayment = false, onCreatePayment, onLogout, logoutOnly = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [studentsOpen, setStudentsOpen] = useState(false)

  const isActive = (path) => pathname === path
  const isStudentsActive = pathname.startsWith('/students/')

  const handleNavigate = (path) => {
    navigate(path)
    setStudentsOpen(false)
  }

  const handleLogout = () => {
    setStudentsOpen(false)

    if (onLogout) {
      onLogout()
      return
    }

    navigate('/login', { replace: true })
  }

  if (logoutOnly) {
    return (
      <nav className="dashboard-nav" aria-label="Dashboard sections">
        <button
          type="button"
          className="dashboard-nav-logout"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <svg
            className="dashboard-nav-icon dashboard-nav-logout-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d={navIcons.logout} />
          </svg>
        </button>
      </nav>
    )
  }

  return (
    <nav className="dashboard-nav" aria-label="Dashboard sections">
      {showCreatePayment ? (
        <button
          type="button"
          className="dashboard-primary-action"
          onClick={() => {
            setStudentsOpen(false)
            onCreatePayment?.()
          }}
        >
          <NavLabel icon={navIcons.createPayment}>Create Payment</NavLabel>
        </button>
      ) : null}

      <button
        type="button"
        className={isActive('/dashboard') ? 'dashboard-nav-active' : ''}
        onClick={() => handleNavigate('/dashboard')}
      >
        <NavLabel icon={navIcons.dashboard}>Dashboard</NavLabel>
      </button>

      <div className="dashboard-dropdown">
        <button
          type="button"
          className={
            studentsOpen || isStudentsActive
              ? 'dashboard-dropdown-trigger dashboard-dropdown-open dashboard-nav-active'
              : 'dashboard-dropdown-trigger'
          }
          onClick={() => setStudentsOpen((open) => !open)}
        >
          <NavLabel icon={navIcons.students}>Students</NavLabel>
        </button>

        {studentsOpen ? (
          <div className="dashboard-dropdown-menu">
            {Object.entries(studentGroups).map(([slug, group]) => (
              <button
                key={slug}
                type="button"
                className={
                  pathname === `/students/${slug}`
                    ? 'dashboard-dropdown-item dashboard-dropdown-item-active'
                    : 'dashboard-dropdown-item'
                }
                onClick={() => handleNavigate(`/students/${slug}`)}
              >
                {group.title}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className={isActive('/breakdowns') ? 'dashboard-nav-active' : ''}
        onClick={() => handleNavigate('/breakdowns')}
      >
        <NavLabel icon={navIcons.breakdowns}>Breakdowns</NavLabel>
      </button>

      <button
        type="button"
        className={isActive('/transactions') ? 'dashboard-nav-active' : ''}
        onClick={() => handleNavigate('/transactions')}
      >
        <NavLabel icon={navIcons.transactions}>Transactions</NavLabel>
      </button>

      <button
        type="button"
        className="dashboard-nav-logout"
        onClick={handleLogout}
        aria-label="Logout"
        title="Logout"
      >
        <svg
          className="dashboard-nav-icon dashboard-nav-logout-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d={navIcons.logout} />
        </svg>
      </button>

    </nav>
  )
}

export default MainNavigation
