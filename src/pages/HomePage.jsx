import React, { useState } from "react";
import AmountDue from "../components/AmountDue";
import PaymentsList from "../components/PaymentsList";

const HomePage = () => {
    const [sum, setSum] = useState(null);

    const handleSumUpdate = (amount) => {
        setSum(amount);
    };

    return (
        <>
           <section className="bg-secondary">
                <div className="container">
                    <h1 className="text-white text-center">Invoice</h1>
                </div>
            </section> 
            <section>
                <AmountDue onSumUpdate={handleSumUpdate} /> 
            </section>
            <section>
                <PaymentsList sum={sum} />
            </section>
        </>
    )
}

export default HomePage;
