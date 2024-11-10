import React, { useState, useEffect } from "react";
import { createPayment, fetchPayments, deletePayment } from "../utils";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const PaymentsList = ({ sum }) => {
    const [payments, setPayments] = useState([]);
    const [name, setName] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [remainingLoan, setRemainingLoan] = useState(sum);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const initialPayments = await fetchPayments();
                setPayments(initialPayments);
                calculateRemainingLoan(initialPayments);
            } catch (error) {
                console.error("Error fetching initial payments:", error);
            }
        };
        loadPayments();
    }, [sum]);

    const calculateRemainingLoan = (paymentsList) => {
        const totalPaid = paymentsList.reduce((acc, payment) => {
            return acc + (parseFloat(payment.fields.transaction_amount) || 0);
        }, 0);
        setRemainingLoan(sum - totalPaid);
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        const currentTime = new Date().toISOString();
        const newPayment = {
            Name: name,
            transaction_amount: transactionAmount,
            time: currentTime,
            notes: notes,
        };

        try {
            Swal.fire({
                title: 'Adding payment...',
                text: 'Please wait a moment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await createPayment(newPayment);
            const updatedPayments = await fetchPayments();
            setPayments(updatedPayments);
            calculateRemainingLoan(updatedPayments);
            setName("");
            setTransactionAmount("");
            setNotes("");

            Swal.fire({
                icon: 'success',
                title: 'Payment added successfully!',
                showConfirmButton: false,
                timer: 1500
            });

            setShowForm(false);  // Hide form after adding payment
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error adding payment',
                text: error.message,
            });
            console.error("Error adding payment:", error);
        }
    };

    const handleDeletePayment = async (paymentId) => {
        try {
            Swal.fire({
                title: 'Deleting payment...',
                text: 'Please wait a moment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await deletePayment(paymentId);
            const updatedPayments = await fetchPayments();
            setPayments(updatedPayments);
            calculateRemainingLoan(updatedPayments);

            Swal.fire({
                icon: 'success',
                title: 'Payment deleted successfully!',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error deleting payment',
                text: error.message,
            });
            console.error("Error deleting payment:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="text-center">Payments List</h4>

            {/* Display list of payments */}
            <div className="list-group">
                {payments.map((payment) => (
                    <div key={payment.id} className="list-group-item">
                        <div className="row align-items-center">
                            <div className="col-md-3 col-sm-6">
                                <p><strong>Name:</strong> {payment.fields.Name}</p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <p><strong>Time:</strong> {new Date(payment.fields.time).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}</p>
                            </div>
                            <div className="col-md-2 col-sm-6">
                                <p><strong>Notes:</strong> {payment.fields.notes}</p>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <p><strong>Amount:</strong> ${payment.fields.transaction_amount}</p>
                            </div>
                            <div className="col-md-1 col-sm-6 text-end">
                                <button className="btn btn-danger" onClick={() => handleDeletePayment(payment.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <h3 className="text-center p-4">
                ---Remaining loan balance: ${remainingLoan !== null ? remainingLoan.toFixed(2) : 'Calculating...'}---
            </h3>

            {/* Toggle button to show/hide form */}
            <div className="text-center border-top">
                <button className="btn btn-secondary m-3" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Hide Form" : "Add"}
                </button>
            </div>

            {/* Conditionally render form */}
            {showForm && (
                <form onSubmit={handleAddPayment} className="mb-4">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="transactionAmount" className="form-label">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            id="transactionAmount"
                            value={transactionAmount}
                            onChange={(e) => setTransactionAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="notes" className="form-label">Notes</label>
                        <textarea
                            className="form-control"
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Payment</button>
                </form>
            )}
        </div>
    );
};

export default PaymentsList;
