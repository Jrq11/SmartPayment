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
      <section className="auth-card reveal-first">
        <div className="auth-brand auth-brand-simple">
          <div>
            <p className="eyebrow">CCS Smart Payment</p>
            <h1>Sign In</h1>
          </div>
          <img className="auth-logo" src={logo} alt="CCS logo" />
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="treasurer@school.edu"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit">Sign In</button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
