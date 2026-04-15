import { useMemo, useState } from 'react'
import AIAssistant from '../components/AIAssistant'
import CreatePaymentModal from '../components/CreatePaymentModal'
import MainNavigation from '../components/MainNavigation'
import logo from '../Images/logo.png'
import { studentGroups } from '../data/studentData'

const feeAmounts = {
  'Department Fee': 300,
  'Intramurals Fee': 250,
  'Expo Fee': 350,
}

function TransactionsPage() {
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedFeeType, setSelectedFeeType] = useState('All')
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false)

  const transactions = useMemo(() => {
    const entries = []

    Object.entries(studentGroups).forEach(([yearSlug, group], groupIndex) => {
      Object.entries(group.blocks).forEach(([blockName, students], blockIndex) => {
        students.forEach((student, studentIndex) => {
          Object.entries(student.payments).forEach(([feeType, paymentStatus], paymentIndex) => {
            if (paymentStatus !== 'Paid') {
              return
            }

            const month = String(((groupIndex + paymentIndex) % 9) + 1).padStart(2, '0')
            const day = String(((studentIndex + blockIndex) % 9) + 10).padStart(2, '0')

            entries.push({
              id: `${yearSlug}-${blockName}-${student.id}-${feeType}`,
              studentName: student.name,
              studentId: `2026-${String(student.id).padStart(4, '0')}`,
              yearSlug,
              yearLabel: group.title.replace(' Students', ''),
              blockName,
              feeType,
              amount: feeAmounts[feeType] ?? 0,
              status: paymentStatus,
              paidAt: `2026-${month}-${day}`,
            })
          })
        })
      })
    })

    return entries.sort((left, right) => {
      if (left.paidAt !== right.paidAt) {
        return right.paidAt.localeCompare(left.paidAt)
      }

      return left.studentName.localeCompare(right.studentName)
    })
  }, [])

  const visibleTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesYear =
          selectedYear === 'All' || transaction.yearSlug === selectedYear
        const matchesFee =
          selectedFeeType === 'All' || transaction.feeType === selectedFeeType

        return matchesYear && matchesFee
      }),
    [selectedFeeType, selectedYear, transactions],
  )

  const totalCollected = visibleTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  )

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar reveal-first">
        <div className="dashboard-title-wrap">
          <img className="dashboard-logo" src={logo} alt="CCS logo" />
          <div>
            <p className="eyebrow">CCS Treasurer</p>
            <h1>Transactions</h1>
          </div>
        </div>

        <MainNavigation
          showCreatePayment
          onCreatePayment={() => {
            setCreatePaymentOpen(true)
          }}
        />
      </header>

      <section className="transactions-shell reveal-second">
        <div className="transactions-summary-card">
          <p className="eyebrow">Collected</p>
          <strong>PHP {totalCollected.toLocaleString()}</strong>
          <span>{visibleTransactions.length} posted payments</span>
        </div>

        <div className="transactions-filter-card">
          <label>
            School Year
            <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
              <option value="All">All</option>
              {Object.entries(studentGroups).map(([slug, group]) => (
                <option key={slug} value={slug}>
                  {group.title.replace(' Students', '')}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fee Type
            <select
              value={selectedFeeType}
              onChange={(event) => setSelectedFeeType(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Department Fee">Department Fee</option>
              <option value="Intramurals Fee">Intramurals Fee</option>
              <option value="Expo Fee">Expo Fee</option>
            </select>
          </label>
        </div>
      </section>

      <section className="transactions-panel reveal-third">
        <div className="dashboard-section-copy transactions-section-copy">
          <h2>Payment Records</h2>
          <p>Generated from the current BSCS sample students and their paid fee statuses.</p>
        </div>

        <div className="transactions-list">
          {visibleTransactions.map((transaction) => (
            <article key={transaction.id} className="transactions-row">
              <div className="transactions-row-main">
                <h3>{transaction.studentName}</h3>
                <p>
                  {transaction.studentId} • {transaction.yearLabel} • {transaction.blockName}
                </p>
              </div>

              <div className="transactions-row-meta">
                <span className="transactions-fee-chip">{transaction.feeType}</span>
                <strong>PHP {transaction.amount.toLocaleString()}</strong>
                <small>{transaction.paidAt}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CreatePaymentModal
        isOpen={createPaymentOpen}
        onClose={() => setCreatePaymentOpen(false)}
      />

      <AIAssistant />
    </main>
  )
}

export default TransactionsPage
