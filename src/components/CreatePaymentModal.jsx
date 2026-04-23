import { useCallback, useEffect, useRef, useState } from 'react'

const initialPaymentForm = {
  studentName: '',
  studentId: '',
  amount: '',
  feeType: '',
}

function CreatePaymentModal({ isOpen, onClose, onSubmitPayment }) {
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm)
  const [submitSuccessOpen, setSubmitSuccessOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const modalRef = useRef(null)
  const successModalRef = useRef(null)
  const studentNameInputRef = useRef(null)
  const successOkButtonRef = useRef(null)
  const lastFocusedElementRef = useRef(null)

  const handlePrimaryClose = useCallback(() => {
    setPaymentForm(initialPaymentForm)
    setFormError('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    lastFocusedElementRef.current = document.activeElement

    window.requestAnimationFrame(() => {
      studentNameInputRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handlePrimaryClose()
        return
      }

      if (event.key !== 'Tab' || !modalRef.current) {
        return
      }

      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusedElementRef.current?.focus?.()
    }
  }, [handlePrimaryClose, isOpen])

  useEffect(() => {
    if (!submitSuccessOpen) {
      return
    }

    window.requestAnimationFrame(() => {
      successOkButtonRef.current?.focus()
    })
  }, [submitSuccessOpen])

  const handlePaymentChange = (event) => {
    const { name, value } = event.target
    setPaymentForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handlePaymentSubmit = (event) => {
    event.preventDefault()

    const amount = Number(paymentForm.amount)

    if (!paymentForm.studentName || !paymentForm.studentId || !paymentForm.feeType || !amount) {
      setFormError('Complete all fields with a valid amount before submitting.')
      return
    }

    setFormError('')

    onSubmitPayment?.({
      studentName: paymentForm.studentName,
      studentId: paymentForm.studentId,
      amount,
      feeType: paymentForm.feeType,
    })

    setPaymentForm(initialPaymentForm)
    onClose()
    setSubmitSuccessOpen(true)
  }

  return (
    <>
      {isOpen ? (
        <div className="dashboard-modal-overlay" role="presentation" onClick={handlePrimaryClose}>
          <section
            className="dashboard-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-payment-title"
            aria-describedby={formError ? 'create-payment-error' : undefined}
            ref={modalRef}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dashboard-payment-modal-title">
              <p className="eyebrow">Create Payment</p>
              <h2 id="create-payment-title">Payment Details</h2>
            </div>

            <form className="dashboard-payment-form" onSubmit={handlePaymentSubmit}>
              <label>
                Student Name
                <input
                  ref={studentNameInputRef}
                  type="text"
                  name="studentName"
                  value={paymentForm.studentName}
                  onChange={handlePaymentChange}
                  placeholder="Enter the student's full name"
                  required
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? 'create-payment-error' : undefined}
                />
              </label>

              <label>
                Student ID No.
                <input
                  type="text"
                  name="studentId"
                  value={paymentForm.studentId}
                  onChange={handlePaymentChange}
                  placeholder="Enter Student ID No."
                  required
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? 'create-payment-error' : undefined}
                />
              </label>

              <label>
                Amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="amount"
                  value={paymentForm.amount}
                  onChange={handlePaymentChange}
                  placeholder="Enter payment amount"
                  required
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? 'create-payment-error' : undefined}
                />
              </label>

              <label>
                Type of Fee
                <select
                  name="feeType"
                  value={paymentForm.feeType}
                  onChange={handlePaymentChange}
                  required
                  aria-invalid={Boolean(formError)}
                  aria-describedby={formError ? 'create-payment-error' : undefined}
                >
                  <option value="">Select fee type</option>
                  <option value="Department Fee">Department Fee</option>
                  <option value="Intramurals Fee">Intramurals Fee</option>
                  <option value="Expo Fee">Expo Fee</option>
                </select>
              </label>

              {formError ? (
                <p id="create-payment-error" className="auth-error" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="dashboard-payment-actions">
                <button
                  type="button"
                  className="dashboard-payment-cancel"
                  onClick={handlePrimaryClose}
                  aria-label="Cancel payment entry"
                >
                  Cancel
                </button>
                <button type="submit" className="dashboard-payment-submit">
                  Submit Payment
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {submitSuccessOpen ? (
        <div
          className="dashboard-modal-overlay"
          role="presentation"
          onClick={() => setSubmitSuccessOpen(false)}
        >
          <section
            className="dashboard-success-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-success-title"
            ref={successModalRef}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Payment Posted</p>
            <h2 id="payment-success-title">Payment submitted successfully.</h2>
            <button
              type="button"
              className="dashboard-payment-submit"
              onClick={() => setSubmitSuccessOpen(false)}
              ref={successOkButtonRef}
              aria-label="Close payment confirmation"
            >
              OK
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default CreatePaymentModal
