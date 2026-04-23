import { useEffect, useMemo, useRef, useState } from 'react'
import { studentGroups } from '../data/studentData'

const defaultBreakdownTitles = ['Department Fee', 'Intramurals Fee', 'Expo Fee']

const createAssistantMessage = (text) => ({
  id: `assistant-${Date.now()}-${Math.random()}`,
  role: 'assistant',
  text,
})

const createUserMessage = (text) => ({
  id: `user-${Date.now()}-${Math.random()}`,
  role: 'user',
  text,
})

function AIAssistant({ breakdownTitles = defaultBreakdownTitles, unpaidFeeCounts }) {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantMode, setAssistantMode] = useState(null)
  const assistantMessagesRef = useRef(null)
  const [assistantMessages, setAssistantMessages] = useState([
    createAssistantMessage(
      'Ask me to send a breakdown to all students or notify students with unpaid fees.',
    ),
  ])

  const resolvedUnpaidFeeCounts = useMemo(() => {
    if (unpaidFeeCounts) {
      return unpaidFeeCounts
    }

    const counts = {
      'Department Fee': 0,
      'Intramurals Fee': 0,
      'Expo Fee': 0,
    }

    Object.values(studentGroups).forEach((group) => {
      Object.values(group.blocks).forEach((students) => {
        students.forEach((student) => {
          Object.entries(student.payments).forEach(([feeType, paymentStatus]) => {
            if (paymentStatus !== 'Paid' && typeof counts[feeType] === 'number') {
              counts[feeType] += 1
            }
          })
        })
      })
    })

    return counts
  }, [unpaidFeeCounts])

  useEffect(() => {
    if (!assistantOpen || !assistantMessagesRef.current) {
      return
    }

    assistantMessagesRef.current.scrollTop = assistantMessagesRef.current.scrollHeight
  }, [assistantMessages, assistantOpen])

  const appendAssistantMessages = (...messages) => {
    setAssistantMessages((current) => [...current, ...messages])
  }

  const handleAssistantAction = (action) => {
    if (action === 'send-breakdown') {
      setAssistantMode('send-breakdown')
      appendAssistantMessages(
        createUserMessage('Send a specific breakdown to all students.'),
        createAssistantMessage('Select which breakdown you want to send to all students.'),
      )
      return
    }

    setAssistantMode('notify-unpaid')
    appendAssistantMessages(
      createUserMessage('Notify unpaid students for a specific fee.'),
      createAssistantMessage('Choose a fee type and I will prepare the unpaid student notification.'),
    )
  }

  const handleBreakdownSend = (title) => {
    setAssistantMode(null)
    appendAssistantMessages(
      createUserMessage(`Send ${title} breakdown to all students.`),
      createAssistantMessage(`Queued ${title} breakdown for all students.`),
    )
  }

  const handleUnpaidNotification = (feeType) => {
    setAssistantMode(null)
    appendAssistantMessages(
      createUserMessage(`Notify students with unpaid ${feeType}.`),
      createAssistantMessage(
        `Prepared a reminder for ${resolvedUnpaidFeeCounts[feeType] ?? 0} students with unpaid ${feeType}.`,
      ),
    )
  }

  const handleAssistantSubmit = (event) => {
    event.preventDefault()

    const message = assistantInput.trim()

    if (!message) {
      return
    }

    const normalized = message.toLowerCase()
    let reply =
      'I can help send a breakdown to all students or notify students with unpaid Department, Intramurals, or Expo fees.'

    if (normalized.includes('breakdown') && normalized.includes('all')) {
      reply = 'Use the "Send breakdown" option below, then choose the breakdown to send.'
    } else if (normalized.includes('unpaid') || normalized.includes('notify')) {
      reply = 'Use the "Notify unpaid" option below, then choose which fee should be included.'
    } else if (normalized.includes('expo')) {
      reply = `There are ${resolvedUnpaidFeeCounts['Expo Fee'] ?? 0} students with unpaid Expo Fee in the sample data.`
    } else if (normalized.includes('intramurals')) {
      reply = `There are ${resolvedUnpaidFeeCounts['Intramurals Fee'] ?? 0} students with unpaid Intramurals Fee in the sample data.`
    } else if (normalized.includes('department')) {
      reply = `There are ${resolvedUnpaidFeeCounts['Department Fee'] ?? 0} students with unpaid Department Fee in the sample data.`
    }

    appendAssistantMessages(createUserMessage(message), createAssistantMessage(reply))
    setAssistantInput('')
  }

  return (
    <div className="dashboard-assistant">
      {assistantOpen ? (
        <section
          className="dashboard-assistant-panel"
          id="dashboard-ai-assistant-panel"
          aria-label="AI Assistant"
        >
          <p className="eyebrow">AI Assistant</p>
          <h2>Need help?</h2>
          <div className="dashboard-assistant-messages" ref={assistantMessagesRef} aria-live="polite">
            {assistantMessages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === 'assistant'
                    ? 'dashboard-assistant-message'
                    : 'dashboard-assistant-message dashboard-assistant-message-user'
                }
              >
                {message.text}
              </article>
            ))}
          </div>

          {assistantMode === null ? (
            <div className="dashboard-assistant-quick-actions">
              <button type="button" onClick={() => handleAssistantAction('send-breakdown')}>
                Send breakdown
              </button>
              <button type="button" onClick={() => handleAssistantAction('notify-unpaid')}>
                Notify unpaid
              </button>
            </div>
          ) : null}

          {assistantMode === 'send-breakdown' ? (
            <div className="dashboard-assistant-options">
              {breakdownTitles.map((title) => (
                <button key={title} type="button" onClick={() => handleBreakdownSend(title)}>
                  {title}
                </button>
              ))}
            </div>
          ) : null}

          {assistantMode === 'notify-unpaid' ? (
            <div className="dashboard-assistant-options">
              {breakdownTitles.map((title) => (
                <button key={title} type="button" onClick={() => handleUnpaidNotification(title)}>
                  {title}
                </button>
              ))}
            </div>
          ) : null}

          <form className="dashboard-assistant-form" onSubmit={handleAssistantSubmit}>
            <input
              type="text"
              value={assistantInput}
              onChange={(event) => setAssistantInput(event.target.value)}
              placeholder="Ask the assistant..."
            />
            <div className="dashboard-assistant-footer">
              <button type="button" onClick={() => setAssistantOpen(false)}>
                Close
              </button>
              <button type="submit">Send</button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="dashboard-assistant-button"
        onClick={() => setAssistantOpen((open) => !open)}
        aria-label={assistantOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={assistantOpen}
        aria-controls="dashboard-ai-assistant-panel"
      >
        <svg
          className="dashboard-assistant-button-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6.59L6.7 18.71A1 1 0 0 1 5 18v-3.18A3 3 0 0 1 4 12V5Zm3-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h.6c.55 0 1 .45 1 1v1.59l2.7-2.7A1 1 0 0 1 12 12h5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7Zm2 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1Z" />
        </svg>
      </button>
    </div>
  )
}

export default AIAssistant
