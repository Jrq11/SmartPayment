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

const breakdownTitles = ['Department Fee', 'Intramurals Fee', 'Expo Fee']

const getOverallPaymentStatus = (payments) =>
  Object.values(payments).every((status) => status === 'Paid') ? 'Paid' : 'Pending'

function DashboardPage() {
  const [createdTransactions, setCreatedTransactions] = useState([])
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false)

  const sampleTransactions = useMemo(() => {
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
              name: student.name,
              detail: `${feeType} Payment`,
              amount: feeAmounts[feeType] ?? 0,
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

      return left.name.localeCompare(right.name)
    })
  }, [])

  const transactions = useMemo(
    () => [...createdTransactions, ...sampleTransactions],
    [createdTransactions, sampleTransactions],
  )
  const recentTransactions = useMemo(() => transactions.slice(0, 3), [transactions])

  const totalCollected = useMemo(
    () => transactions.reduce((total, item) => total + item.amount, 0),
    [transactions],
  )

  const collectedByFee = useMemo(
    () =>
      breakdownTitles.map((feeType) => ({
        feeType,
        amount: transactions
          .filter((transaction) => transaction.detail === `${feeType} Payment`)
          .reduce((total, transaction) => total + transaction.amount, 0),
      })),
    [transactions],
  )

  const studentTotals = useMemo(() => {
    let paid = 0
    let unpaid = 0

    Object.values(studentGroups).forEach((group) => {
      Object.values(group.blocks).forEach((students) => {
        students.forEach((student) => {
          if (getOverallPaymentStatus(student.payments) === 'Paid') {
            paid += 1
          } else {
            unpaid += 1
          }
        })
      })
    })

    return { paid, unpaid }
  }, [])

  const unpaidYearLevels = useMemo(
    () =>
      Object.entries(studentGroups).map(([slug, group], index) => {
        const blockBreakdown = Object.entries(group.blocks).map(([blockName, students]) => ({
          blockName,
          value: students.filter((student) => getOverallPaymentStatus(student.payments) !== 'Paid')
            .length,
        }))

        const value = blockBreakdown.reduce(
          (total, students) =>
            total + students.value,
          0,
        )

        return {
          id: `${slug}-${index}`,
          label: `Unpaid ${group.title.replace(' Students', '')}`,
          value,
          blockBreakdown,
        }
      }),
    [],
  )

  const unpaidFeeCounts = useMemo(() => {
    const counts = {
      'Department Fee': 0,
      'Intramurals Fee': 0,
      'Expo Fee': 0,
    }

    Object.values(studentGroups).forEach((group) => {
      Object.values(group.blocks).forEach((students) => {
        students.forEach((student) => {
          Object.entries(student.payments).forEach(([feeType, paymentStatus]) => {
            if (paymentStatus !== 'Paid') {
              counts[feeType] += 1
            }
          })
        })
      })
    })

    return counts
  }, [])

  const paidFeeCounts = useMemo(
    () =>
      Object.fromEntries(
        breakdownTitles.map((feeType) => [
          feeType,
          transactions.filter((transaction) => transaction.detail === `${feeType} Payment`).length,
        ]),
      ),
    [transactions],
  )

  const summaryCards = [
    {
      label: 'Total Payments Collected',
      value: `PHP ${totalCollected.toLocaleString()}`,
      breakdown: collectedByFee,
    },
    {
      label: 'Paid Students',
      value: studentTotals.paid,
      breakdown: breakdownTitles.map((feeType) => ({
        feeType,
        amount: paidFeeCounts[feeType],
      })),
      breakdownPrefix: '',
    },
    {
      label: 'Unpaid Students',
      value: studentTotals.unpaid,
      breakdown: breakdownTitles.map((feeType) => ({
        feeType,
        amount: unpaidFeeCounts[feeType],
      })),
      breakdownPrefix: '',
    },
  ]

  const handleCreatePaymentSubmit = (payment) => {
    setCreatedTransactions((current) => [
      {
        id: Date.now(),
        name: payment.studentName,
        detail: `${payment.feeType} Payment`,
        amount: payment.amount,
        paidAt: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ])
  }

  return (
    <main className="dashboard-page">
      <a href="#dashboard-main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header className="dashboard-topbar reveal-first">
        <div className="dashboard-title-wrap">
          <img className="dashboard-logo" src={logo} alt="CCS logo" />
          <div>
            <p className="eyebrow">CCS Treasurer</p>
            <h1>Dashboard</h1>
          </div>
        </div>

        <MainNavigation
          showCreatePayment
          onCreatePayment={() => {
            setCreatePaymentOpen(true)
          }}
        />
      </header>

      <section id="dashboard-main-content" className="dashboard-summary reveal-second" tabIndex="-1">
        {summaryCards.map((card) => (
          <article key={card.label} className="dashboard-stat-card">
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            {card.breakdown ? (
              <div className="dashboard-stat-breakdown">
                {card.breakdown.map((item) => (
                  <div key={item.feeType} className="dashboard-stat-breakdown-row">
                    <span>{item.feeType}</span>
                    <strong>
                      {card.breakdownPrefix === ''
                        ? item.amount.toLocaleString()
                        : `PHP ${item.amount.toLocaleString()}`}
                    </strong>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="dashboard-year-grid reveal-second">
        {unpaidYearLevels.map((item) => (
          <article key={item.id} className="dashboard-stat-card dashboard-year-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <div className="dashboard-stat-breakdown">
              {item.blockBreakdown.map((block) => (
                <div key={block.blockName} className="dashboard-stat-breakdown-row">
                  <span>{block.blockName}</span>
                  <strong>{block.value}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-transactions reveal-third">
        <div className="dashboard-section-copy">
          <h2>Recent Transactions</h2>
          <p>Latest payments processed for student collections.</p>
        </div>

        <div className="dashboard-transaction-list">
          {recentTransactions.map((transaction) => (
            <article key={transaction.id} className="dashboard-transaction-row">
              <div>
                <h3>{transaction.name}</h3>
                <p>{transaction.detail}</p>
              </div>
              <strong>PHP {transaction.amount.toLocaleString()}</strong>
            </article>
          ))}
        </div>
      </section>

      <CreatePaymentModal
        isOpen={createPaymentOpen}
        onClose={() => setCreatePaymentOpen(false)}
        onSubmitPayment={handleCreatePaymentSubmit}
      />
      <AIAssistant breakdownTitles={breakdownTitles} unpaidFeeCounts={unpaidFeeCounts} />
    </main>
  )
}

export default DashboardPage
