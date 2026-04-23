import { useState } from 'react'
import MainNavigation from '../components/MainNavigation'
import logo from '../Images/logo.png'
import { studentGroups } from '../data/studentData'

const startingAccounts = [
  {
    id: 1,
    name: 'Maria Santos',
    email: 'treasurer@ccs.edu',
    role: 'Treasurer',
    status: 'Active',
  },
]

const startingStudents = Object.entries(studentGroups).flatMap(([yearLevel, group]) =>
  Object.entries(group.blocks).flatMap(([block, students]) =>
    students.map((student) => ({
      ...student,
      yearLevel,
      block,
    })),
  ),
)

const startingFees = [
  {
    id: 1,
    name: 'Department Fee',
    defaultAmount: 300,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Intramurals Fee',
    defaultAmount: 250,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Expo Fee',
    defaultAmount: 350,
    status: 'Active',
  },
]

const startingBreakdowns = [
  {
    id: 1,
    title: 'Expo Fee',
    schoolYear: 'All',
    amount: 350,
    dueDate: '2026-06-15',
    note: 'Applied to all year levels for the annual expo.',
  },
]

const getStudentStatus = (payments) =>
  Object.values(payments).every((paymentStatus) => paymentStatus === 'Paid') ? 'Paid' : 'Unpaid'

function AdminPage() {
  const [sectionOpen, setSectionOpen] = useState({
    accountForm: false,
    accountList: false,
    feeForm: false,
    feeList: false,
    studentForm: false,
    studentList: false,
    breakdownForm: false,
    breakdownList: false,
  })

  const [accountName, setAccountName] = useState('')
  const [accountEmail, setAccountEmail] = useState('')
  const [accountRole, setAccountRole] = useState('Staff')
  const [accountPassword, setAccountPassword] = useState('')
  const [accounts, setAccounts] = useState(startingAccounts)
  const [accountError, setAccountError] = useState('')

  const [studentName, setStudentName] = useState('')
  const [studentProgram, setStudentProgram] = useState('BSCS')
  const [studentYearLevel, setStudentYearLevel] = useState('1st-year')
  const [studentBlock, setStudentBlock] = useState('Block A')
  const [students, setStudents] = useState(startingStudents)
  const [studentError, setStudentError] = useState('')

  const [fees, setFees] = useState(startingFees)
  const [feeName, setFeeName] = useState('')
  const [feeDefaultAmount, setFeeDefaultAmount] = useState('')
  const [feeError, setFeeError] = useState('')

  const [breakdownTitle, setBreakdownTitle] = useState(startingFees[0].name)
  const [breakdownSchoolYear, setBreakdownSchoolYear] = useState('All')
  const [breakdownAmount, setBreakdownAmount] = useState('')
  const [breakdownDueDate, setBreakdownDueDate] = useState('')
  const [breakdownNote, setBreakdownNote] = useState('')
  const [breakdowns, setBreakdowns] = useState(startingBreakdowns)
  const [breakdownError, setBreakdownError] = useState('')

  const handleCreateAccount = (event) => {
    event.preventDefault()

    if (!accountName.trim() || !accountEmail.trim() || accountPassword.length < 4) {
      setAccountError('Enter a name, email, and password with at least 4 characters.')
      return
    }

    setAccounts((prevAccounts) => [
      {
        id: Date.now(),
        name: accountName.trim(),
        email: accountEmail.trim(),
        role: accountRole,
        status: 'Pending',
      },
      ...prevAccounts,
    ])

    setAccountName('')
    setAccountEmail('')
    setAccountRole('Staff')
    setAccountPassword('')
    setAccountError('')
  }

  const handleCreateFee = (event) => {
    event.preventDefault()

    const parsedDefaultAmount = Number.parseFloat(feeDefaultAmount)
    const normalizedFeeName = feeName.trim()

    if (!normalizedFeeName || !Number.isFinite(parsedDefaultAmount) || parsedDefaultAmount <= 0) {
      setFeeError('Enter a fee name and a valid default amount.')
      return
    }

    const alreadyExists = fees.some(
      (fee) => fee.name.toLowerCase() === normalizedFeeName.toLowerCase(),
    )

    if (alreadyExists) {
      setFeeError('That fee already exists. Please use a different name.')
      return
    }

    const createdFee = {
      id: Date.now(),
      name: normalizedFeeName,
      defaultAmount: parsedDefaultAmount,
      status: 'Active',
    }

    setFees((currentFees) => [createdFee, ...currentFees])
    setFeeName('')
    setFeeDefaultAmount('')
    setFeeError('')
  }

  const handleCreateStudent = (event) => {
    event.preventDefault()

    if (!studentName.trim()) {
      setStudentError('Enter a student name.')
      return
    }

    const payments = Object.fromEntries(fees.map((fee) => [fee.name, 'Pending']))

    setStudents((currentStudents) => [
      {
        id: Date.now(),
        name: studentName.trim(),
        program: studentProgram,
        yearLevel: studentYearLevel,
        block: studentBlock,
        status: getStudentStatus(payments),
        payments,
      },
      ...currentStudents,
    ])

    setStudentName('')
    setStudentProgram('BSCS')
    setStudentYearLevel('1st-year')
    setStudentBlock('Block A')
    setStudentError('')
  }

  const handleCreateBreakdown = (event) => {
    event.preventDefault()

    const parsedAmount = Number.parseFloat(breakdownAmount)
    if (!breakdownTitle.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !breakdownDueDate) {
      setBreakdownError('Enter a payment title, amount, and due date.')
      return
    }

    setBreakdowns((currentBreakdowns) => [
      {
        id: Date.now(),
        title: breakdownTitle.trim(),
        schoolYear: breakdownSchoolYear,
        amount: parsedAmount,
        dueDate: breakdownDueDate,
        note: breakdownNote.trim(),
      },
      ...currentBreakdowns,
    ])

    setBreakdownTitle(fees[0]?.name ?? '')
    setBreakdownSchoolYear('All')
    setBreakdownAmount('')
    setBreakdownDueDate('')
    setBreakdownNote('')
    setBreakdownError('')
  }

  const toggleSectionPair = (sectionName) => {
    setSectionOpen((current) => {
      const formKey = `${sectionName}Form`
      const listKey = `${sectionName}List`
      const nextOpen = !current[formKey]

      return {
        ...current,
        [formKey]: nextOpen,
        [listKey]: nextOpen,
      }
    })
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar reveal-first">
        <div className="dashboard-title-wrap">
          <img className="dashboard-logo" src={logo} alt="CCS logo" />
          <div>
            <p className="eyebrow">Administration</p>
            <h1>Admin Data Control</h1>
          </div>
        </div>

        <MainNavigation logoutOnly />

      </header>

      <section className="content-grid admin-grid reveal-second">
        <form className="payment-card reveal-second" onSubmit={handleCreateAccount}>
          <div className="admin-card-header">
            <h2>Create staff account</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('account')}
            >
              {sectionOpen.accountForm ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.accountForm ? (
            <>

          <label>
            Full name
            <input
              type="text"
              placeholder="Enter staff name"
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="staff@school.edu"
              value={accountEmail}
              onChange={(event) => setAccountEmail(event.target.value)}
            />
          </label>

          <label>
            Role
            <select value={accountRole} onChange={(event) => setAccountRole(event.target.value)}>
              <option value="Staff">Staff</option>
              <option value="Treasurer">Treasurer</option>
              <option value="Admin">Admin</option>
            </select>
          </label>

          <label>
            Temporary password
            <input
              type="password"
              placeholder="Create temporary password"
              value={accountPassword}
              onChange={(event) => setAccountPassword(event.target.value)}
            />
          </label>

          {accountError ? <p className="auth-error">{accountError}</p> : null}
          <button type="submit">Create Account</button>
            </>
          ) : (
            <p className="admin-card-collapsed-note">Form minimized.</p>
          )}
        </form>

        <aside className="activity-card reveal-third">
          <div className="admin-card-header">
            <h2>Created accounts</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('account')}
            >
              {sectionOpen.accountList ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.accountList ? (
            <ul className="account-list">
              {accounts.map((account) => (
                <li key={account.id}>
                  <div>
                    <p>{account.name}</p>
                    <small>{account.email}</small>
                  </div>
                  <div>
                    <strong>{account.role}</strong>
                    <small>{account.status}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-card-collapsed-note">List minimized.</p>
          )}
        </aside>

        <form className="payment-card reveal-second" onSubmit={handleCreateFee}>
          <div className="admin-card-header">
            <h2>Create fee type</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('fee')}
            >
              {sectionOpen.feeForm ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.feeForm ? (
            <>

          <label>
            Fee name
            <input
              type="text"
              placeholder="Laboratory Fee"
              value={feeName}
              onChange={(event) => setFeeName(event.target.value)}
            />
          </label>

          <label>
            Default amount
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={feeDefaultAmount}
              onChange={(event) => setFeeDefaultAmount(event.target.value)}
            />
          </label>

          {feeError ? <p className="auth-error">{feeError}</p> : null}
          <button type="submit">Create Fee</button>
            </>
          ) : (
            <p className="admin-card-collapsed-note">Form minimized.</p>
          )}
        </form>

        <aside className="activity-card reveal-third">
          <div className="admin-card-header">
            <h2>Created fees</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('fee')}
            >
              {sectionOpen.feeList ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.feeList ? (
            <ul className="account-list">
              {fees.map((fee) => (
                <li key={fee.id}>
                  <div>
                    <p>{fee.name}</p>
                    <small>Default amount</small>
                  </div>
                  <div>
                    <strong>PHP {fee.defaultAmount.toFixed(2)}</strong>
                    <small>{fee.status}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-card-collapsed-note">List minimized.</p>
          )}
        </aside>

        <form className="payment-card reveal-second" onSubmit={handleCreateStudent}>
          <div className="admin-card-header">
            <h2>Create student record</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('student')}
            >
              {sectionOpen.studentForm ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.studentForm ? (
            <>

          <label>
            Student name
            <input
              type="text"
              placeholder="Enter student name"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
            />
          </label>

          <label>
            Program
            <select value={studentProgram} onChange={(event) => setStudentProgram(event.target.value)}>
              <option value="BSCS">BSCS</option>
            </select>
          </label>

          <label>
            Year level
            <select
              value={studentYearLevel}
              onChange={(event) => setStudentYearLevel(event.target.value)}
            >
              <option value="1st-year">1st Year</option>
              <option value="2nd-year">2nd Year</option>
              <option value="3rd-year">3rd Year</option>
              <option value="4th-year">4th Year</option>
            </select>
          </label>

          <label>
            Block
            <input
              type="text"
              placeholder="Enter block (e.g. Block A)"
              value={studentBlock}
              onChange={(event) => setStudentBlock(event.target.value)}
            />
          </label>

          {studentError ? <p className="auth-error">{studentError}</p> : null}
          <button type="submit">Create Student</button>
            </>
          ) : (
            <p className="admin-card-collapsed-note">Form minimized.</p>
          )}
        </form>

        <aside className="activity-card reveal-third">
          <div className="admin-card-header">
            <h2>Created students</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('student')}
            >
              {sectionOpen.studentList ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.studentList ? (
            <ul className="account-list">
              {students.map((student) => (
                <li key={student.id}>
                  <div>
                    <p>{student.name}</p>
                    <small>
                      {student.program} • {student.yearLevel} • {student.block}
                    </small>
                    <small>{Object.entries(student.payments).map(([name, status]) => `${name}: ${status}`).join(' • ')}</small>
                  </div>
                  <div>
                    <strong>{student.status}</strong>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-card-collapsed-note">List minimized.</p>
          )}
        </aside>

        <form className="payment-card reveal-second" onSubmit={handleCreateBreakdown}>
          <div className="admin-card-header">
            <h2>Create payment breakdown</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('breakdown')}
            >
              {sectionOpen.breakdownForm ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.breakdownForm ? (
            <>

          <label>
            Payment title
            <select
              value={breakdownTitle}
              onChange={(event) => setBreakdownTitle(event.target.value)}
            >
              {fees.map((fee) => (
                <option key={fee.id} value={fee.name}>
                  {fee.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            School year
            <select
              value={breakdownSchoolYear}
              onChange={(event) => setBreakdownSchoolYear(event.target.value)}
            >
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
              value={breakdownAmount}
              onChange={(event) => setBreakdownAmount(event.target.value)}
            />
          </label>

          <label>
            Due date
            <input
              type="date"
              value={breakdownDueDate}
              onChange={(event) => setBreakdownDueDate(event.target.value)}
            />
          </label>

          <label>
            Note
            <input
              type="text"
              placeholder="Optional note"
              value={breakdownNote}
              onChange={(event) => setBreakdownNote(event.target.value)}
            />
          </label>

          {breakdownError ? <p className="auth-error">{breakdownError}</p> : null}
          <button type="submit">Create Breakdown</button>
            </>
          ) : (
            <p className="admin-card-collapsed-note">Form minimized.</p>
          )}
        </form>

        <aside className="activity-card reveal-third">
          <div className="admin-card-header">
            <h2>Created breakdowns</h2>
            <button
              type="button"
              className="admin-card-toggle"
              onClick={() => toggleSectionPair('breakdown')}
            >
              {sectionOpen.breakdownList ? 'Minimize' : 'Expand'}
            </button>
          </div>

          {sectionOpen.breakdownList ? (
            <ul className="account-list">
              {breakdowns.map((breakdown) => (
                <li key={breakdown.id}>
                  <div>
                    <p>{breakdown.title}</p>
                    <small>
                      {breakdown.schoolYear} • Due {breakdown.dueDate}
                    </small>
                    {breakdown.note ? <small>{breakdown.note}</small> : null}
                  </div>
                  <div>
                    <strong>PHP {breakdown.amount.toFixed(2)}</strong>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-card-collapsed-note">List minimized.</p>
          )}
        </aside>

      </section>
    </main>
  )
}

export default AdminPage
