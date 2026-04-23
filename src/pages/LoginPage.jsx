import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../Images/logo.png'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!email.trim() || password.length < 4) {
      setError('Enter a valid email and password.')
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="auth-page">
      <a href="#login-main-content" className="skip-to-content">
        Skip to main content
      </a>

      <section className="auth-card reveal-first">
        <div className="auth-brand auth-brand-simple">
          <div>
            <p className="eyebrow">CCS Smart Payment</p>
            <h1>Sign In</h1>
          </div>
          <img className="auth-logo" src={logo} alt="CCS logo" />
        </div>

        <form id="login-main-content" onSubmit={handleSubmit} className="auth-form" noValidate>
          <label>
            Email
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="treasurer@school.edu"
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-form-error' : undefined}
            />
          </label>

          <label>
            Password
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              minLength={4}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-form-error' : undefined}
            />
          </label>

          {error ? (
            <p id="login-form-error" className="auth-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit">Sign In</button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
