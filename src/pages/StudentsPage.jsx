import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AIAssistant from '../components/AIAssistant'
import CreatePaymentModal from '../components/CreatePaymentModal'
import MainNavigation from '../components/MainNavigation'
import { studentGroups } from '../data/studentData'

const getOverallPaymentStatus = (payments) =>
  Object.values(payments).every((status) => status === 'Paid') ? 'Paid' : 'Pending'

function StudentsPage() {
  const navigate = useNavigate()
  const { yearLevel } = useParams()
  const [selectedBlock, setSelectedBlock] = useState('Block A')
  const [accountOpen, setAccountOpen] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState('All')
  const [paymentView, setPaymentView] = useState('All')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifyFeeType, setNotifyFeeType] = useState('Department Fee')
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false)

  const currentGroup = yearLevel ? studentGroups[yearLevel] : null

  const blockNames = useMemo(
    () => (currentGroup ? Object.keys(currentGroup.blocks) : []),
    [currentGroup],
  )

  const students = currentGroup ? currentGroup.blocks[selectedBlock] ?? [] : []
  const unpaidStudentsForSelectedFee = useMemo(() => {
    if (notifyFeeType === 'All') {
      return []
    }

    return students.filter((student) => student.payments[notifyFeeType] === 'Pending')
  }, [notifyFeeType, students])

  const visibleStudents = useMemo(() => {
    const getLastName = (fullName) => {
      const parts = fullName.trim().split(/\s+/)
      return parts[parts.length - 1]
    }

    const alphabetical = [...students].sort((left, right) => {
      const lastNameCompare = getLastName(left.name).localeCompare(getLastName(right.name))

      if (lastNameCompare !== 0) {
        return lastNameCompare
      }

      return left.name.localeCompare(right.name)
    })

    if (selectedPaymentType === 'All') {
      return alphabetical
    }

    const prioritized = [...alphabetical].sort((left, right) => {
      const leftStatus = left.payments[selectedPaymentType]
      const rightStatus = right.payments[selectedPaymentType]

      if (leftStatus === rightStatus) {
        return 0
      }

      return leftStatus === 'Pending' ? -1 : 1
    })

    if (paymentView === 'All') {
      return prioritized
    }

    return prioritized.filter((student) => student.payments[selectedPaymentType] === paymentView)
  }, [paymentView, selectedPaymentType, students])

  useEffect(() => {
    setSelectedBlock('Block A')
  }, [yearLevel])

  useEffect(() => {
    setNotificationMessage('')
    setNotifyOpen(false)
  }, [selectedBlock, selectedPaymentType, yearLevel])

  const handleNotifyUnpaid = (event) => {
    event.preventDefault()
    if (unpaidStudentsForSelectedFee.length === 0) {
      setNotificationMessage(`No students in ${selectedBlock} have unpaid ${notifyFeeType}.`)
      setNotifyOpen(false)
      return
    }

    setNotificationMessage(
      `Reminder prepared for ${unpaidStudentsForSelectedFee.length} students in ${selectedBlock} with unpaid ${notifyFeeType}.`,
    )
    setNotifyOpen(false)
  }

  if (!currentGroup) {
    return <Navigate to="/dashboard" replace />
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
              <img className="dashboard-logo" src="/logo.png" alt="CCS logo" />
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
            <h1>{currentGroup.title}</h1>
          </div>
        </div>

        <MainNavigation
          showCreatePayment
          onCreatePayment={() => {
            setAccountOpen(false)
            setNotifyOpen(false)
            setCreatePaymentOpen(true)
          }}
        />
      </header>

      <section className="student-page-layout reveal-second">
        <aside className="student-blocks-card">
          <p className="eyebrow">Blocks</p>
          <h2>Select a block</h2>
          <div className="student-block-list">
            {blockNames.map((block) => (
              <button
                key={block}
                type="button"
                className={selectedBlock === block ? 'student-block-button student-block-button-active' : 'student-block-button'}
                onClick={() => setSelectedBlock(block)}
              >
                {block}
              </button>
            ))}
          </div>
        </aside>

        <section className="student-panel student-page-panel reveal-third">
          <div className="student-panel-header">
            <div>
              <p className="eyebrow">Students</p>
              <h2>{selectedBlock}</h2>
            </div>
            <div className="student-sort-controls">
              <label>
                Fee Type
                <select
                  value={selectedPaymentType}
                  onChange={(event) => setSelectedPaymentType(event.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Department Fee">Department Fee</option>
                  <option value="Intramurals Fee">Intramurals Fee</option>
                  <option value="Expo Fee">Expo Fee</option>
                </select>
              </label>

              <label>
                Status
                <select value={paymentView} onChange={(event) => setPaymentView(event.target.value)}>
                  <option value="All">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </label>

              <button
                type="button"
                className="student-notify-button"
                onClick={() => setNotifyOpen(true)}
              >
                Notify Unpaid
              </button>
            </div>
          </div>

          {notificationMessage ? (
            <p className="student-notification-note">{notificationMessage}</p>
          ) : null}

          <div className="student-panel-list">
            {visibleStudents.map((student) => (
              (() => {
                const overallStatus = getOverallPaymentStatus(student.payments)

                return (
                  <article key={student.id} className="student-panel-row">
                    <div className="student-panel-main">
                      <h3>{student.name}</h3>
                      <p>{student.program}</p>
                      <div className="student-payment-breakdown">
                        {Object.entries(student.payments).map(([paymentType, paymentStatus]) => (
                          <div key={paymentType} className="student-payment-item">
                            <span>{paymentType}</span>
                            <strong
                              className={
                                paymentStatus === 'Paid'
                                  ? 'student-status student-status-paid'
                                  : 'student-status student-status-unpaid'
                              }
                            >
                              {paymentStatus}
                            </strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <span
                      className={
                        overallStatus === 'Paid'
                          ? 'student-status student-status-paid'
                          : 'student-status student-status-unpaid'
                      }
                    >
                      {overallStatus}
                    </span>
                  </article>
                )
              })()
            ))}
          </div>
        </section>
      </section>

      {notifyOpen ? (
        <div
          className="dashboard-modal-overlay"
          role="presentation"
          onClick={() => setNotifyOpen(false)}
        >
          <section
            className="student-notify-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notify-unpaid-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dashboard-payment-modal-title">
              <p className="eyebrow">Notify Students</p>
              <h2 id="notify-unpaid-title">Send unpaid reminder</h2>
            </div>

            <form className="student-notify-form" onSubmit={handleNotifyUnpaid}>
              <label>
                Fee Type
                <select
                  value={notifyFeeType}
                  onChange={(event) => setNotifyFeeType(event.target.value)}
                >
                  <option value="Department Fee">Department Fee</option>
                  <option value="Intramurals Fee">Intramurals Fee</option>
                  <option value="Expo Fee">Expo Fee</option>
                </select>
              </label>

              <p className="student-notify-helper">
                This will notify all students in {selectedBlock} who still have unpaid{' '}
                {notifyFeeType}.
              </p>

              <div className="dashboard-payment-actions">
                <button
                  type="button"
                  className="dashboard-payment-cancel"
                  onClick={() => setNotifyOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="dashboard-payment-submit">
                  Notify Students
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      <CreatePaymentModal
        isOpen={createPaymentOpen}
        onClose={() => setCreatePaymentOpen(false)}
      />

      <AIAssistant />
    </main>
  )
}

export default StudentsPage
