import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { fetchTotalSumPrice } from "../utils";

const AmountDue = ({ onSumUpdate }) => {
    const [sum, setSum] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAmountDue = async () => {
            try {
                const amount = await fetchTotalSumPrice();
                setSum(amount);
                onSumUpdate(amount); // 使用 callback 傳回 sum 值
            } catch (error) {
                console.error("Error fetching amount:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAmountDue();
    }, [onSumUpdate]);

    return (
        <div className="text-center p-4">
            <h1>Amount Due:</h1> 
            {loading ? (
                <BouncingText>Loading...</BouncingText>
            ) : (
                <p>Sum Price: ${sum}</p>
            )}
        </div>
    );
};

export default AmountDue;

const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
`;

const BouncingText = styled.p`
    font-size: 1.5em;
    color: #333;
    animation: ${bounce} 1.4s infinite;
`;
