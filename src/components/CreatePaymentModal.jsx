import { useEffect, useState } from 'react'

const initialPaymentForm = {
  studentName: '',
  studentId: '',
  amount: '',
  feeType: '',
}

function CreatePaymentModal({ isOpen, onClose, onSubmitPayment }) {
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm)
  const [submitSuccessOpen, setSubmitSuccessOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setPaymentForm(initialPaymentForm)
    }
  }, [isOpen])

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
      return
    }

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
        <div className="dashboard-modal-overlay" role="presentation" onClick={onClose}>
          <section
            className="dashboard-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-payment-title"
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
                  type="text"
                  name="studentName"
                  value={paymentForm.studentName}
                  onChange={handlePaymentChange}
                  placeholder="Enter the student's full name"
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
                />
              </label>

              <label>
                Type of Fee
                <select name="feeType" value={paymentForm.feeType} onChange={handlePaymentChange}>
                  <option value="">Select fee type</option>
                  <option value="Department Fee">Department Fee</option>
                  <option value="Intramurals Fee">Intramurals Fee</option>
                  <option value="Expo Fee">Expo Fee</option>
                </select>
              </label>

              <div className="dashboard-payment-actions">
                <button type="button" className="dashboard-payment-cancel" onClick={onClose}>
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
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Payment Posted</p>
            <h2 id="payment-success-title">Payment submitted successfully.</h2>
            <button
              type="button"
              className="dashboard-payment-submit"
              onClick={() => setSubmitSuccessOpen(false)}
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
