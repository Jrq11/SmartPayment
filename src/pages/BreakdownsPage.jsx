import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AIAssistant from '../components/AIAssistant'
import CreatePaymentModal from '../components/CreatePaymentModal'
import MainNavigation from '../components/MainNavigation'
import logo from '../Images/logo.png'

const startingBreakdowns = [
  {
    id: 1,
    title: 'Expo Fee',
    schoolYear: 'All',
    amount: 350,
    dueDate: '2026-06-15',
    note: 'Applied to all year levels for the annual expo.',
    attachmentName: 'expo-fee.xlxs',
  },
  {
    id: 2,
    title: 'Intramurals Fee',
    schoolYear: 'All',
    amount: 250,
    dueDate: '2026-07-01',
    note: 'Collection for intramurals participation.',
    attachmentName: 'Intramurals-fee.xlxs',
  },
]

function BreakdownsPage() {
  const navigate = useNavigate()
  const [accountOpen, setAccountOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [schoolYear, setSchoolYear] = useState('All')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [error, setError] = useState('')
  const [breakdowns, setBreakdowns] = useState(startingBreakdowns)
  const [selectedBreakdownId, setSelectedBreakdownId] = useState(null)
  const [sentBreakdownIds, setSentBreakdownIds] = useState([])
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(amount)
    if (!title.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !dueDate) {
      setError('Enter a payment title, amount, and due date.')
      return
    }

    setBreakdowns((current) => [
      {
        id: Date.now(),
        title: title.trim(),
        schoolYear,
        amount: parsedAmount,
        dueDate,
        note: note.trim(),
        attachmentName,
      },
      ...current,
    ])

    setTitle('')
    setSchoolYear('All')
    setAmount('')
    setDueDate('')
    setNote('')
    setAttachmentName('')
    setError('')
  }

  const handleSendToAllStudents = (breakdownId) => {
    setSentBreakdownIds((current) =>
      current.includes(breakdownId) ? current : [...current, breakdownId],
    )
    setSelectedBreakdownId(null)
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar reveal-first">
        <div className="dashboard-title-wrap">
          <div className="dashboard-dropdown dashboard-account-dropdown">
            <button
              type="button"
              className={
                accountOpen
                  ? 'dashboard-logo-button dashboard-logo-button-open'
                  : 'dashboard-logo-button'
              }
              onClick={() => setAccountOpen((open) => !open)}
              aria-label="Open account menu"
            >
              <img className="dashboard-logo" src={logo} alt="CCS logo" />
            </button>
            {accountOpen ? (
              <div className="dashboard-dropdown-menu dashboard-account-menu">
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false)
                    navigate('/login', { replace: true })
                  }}
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
          <div>
            <p className="eyebrow">CCS Treasurer</p>
            <h1>Payment Breakdowns</h1>
          </div>
        </div>

        <MainNavigation
          showCreatePayment
          onCreatePayment={() => {
            setAccountOpen(false)
            setCreatePaymentOpen(true)
          }}
        />
      </header>

      <section className="content-grid breakdowns-grid">
        <form className="payment-card reveal-second" onSubmit={handleSubmit}>
          <h2>Create breakdown</h2>

          <label>
            Payment title
            <input
              type="text"
              placeholder="Department Fee"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            School year
            <select value={schoolYear} onChange={(event) => setSchoolYear(event.target.value)}>
              <option value="All">All</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </label>

          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </label>

          <label>
            Due date
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </label>

          <label>
            Note
            <input
              type="text"
              placeholder="Optional note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>

          <label>
            Attachment
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.doc,.docx"
              onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? '')}
            />
          </label>

          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit">Save Breakdown</button>
        </form>

        <aside className="activity-card reveal-third">
          <h2>Created breakdowns</h2>
          <ul className="breakdown-list">
            {breakdowns.map((entry) => (
              <li key={entry.id} className="breakdown-item-wrapper">
                <button
                  type="button"
                  className={
                    selectedBreakdownId === entry.id
                      ? 'breakdown-item breakdown-item-active'
                      : 'breakdown-item'
                  }
                  onClick={() =>
                    setSelectedBreakdownId((current) => (current === entry.id ? null : entry.id))
                  }
                >
                  <div>
                    <p>{entry.title}</p>
                    <small>{entry.schoolYear}</small>
                    {entry.note ? <em>{entry.note}</em> : null}
                    {entry.attachmentName ? <em>{entry.attachmentName}</em> : null}
                  </div>
                  <div>
                    <strong>PHP {entry.amount.toFixed(2)}</strong>
                    <small>{entry.dueDate}</small>
                  </div>
                </button>

                {selectedBreakdownId === entry.id ? (
                  <div className="breakdown-actions">
                    <p>Send this breakdown to all students?</p>
                    <div className="breakdown-actions-row">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleSendToAllStudents(entry.id)}
                      >
                        Send to All Students
                      </button>
                      <button
                        type="button"
                        className="breakdown-dismiss"
                        onClick={() => setSelectedBreakdownId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {sentBreakdownIds.includes(entry.id) ? (
                  <p className="breakdown-status-note">Sent to all students.</p>
                ) : null}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <CreatePaymentModal
        isOpen={createPaymentOpen}
        onClose={() => setCreatePaymentOpen(false)}
      />

      <AIAssistant />
    </main>
  )
}

export default BreakdownsPage
