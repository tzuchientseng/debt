const token = 'patMizGe2R2QAZjkO.fb7a1c9ac68f23aa8bb60874cad9a5ad6fbedb1697e1fffffcedea7fe1db781f';
const baseId = "appSKQSkCs8prCiDp";
const tableName = "Father";
const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;
const authHeader = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

// 定義函數來獲取 sum_price 總和
export const fetchTotalSumPrice = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: authHeader,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    // console.log({data});
    // 計算 sum_price 欄位的總和
    const totalSumPrice = data.records.reduce((sum, record) => {
      return sum + (parseFloat(record.fields.sum_price) || 0);
    }, 0);

    return totalSumPrice;
  } catch (error) {
    console.error("Error fetching sum_price:", error);
    throw error;
  }
};


const table2Name = "Payments";
const apiUrlPayments = `https://api.airtable.com/v0/${baseId}/${table2Name}`;

// Fetch Records (Read)
export const fetchPayments = async () => {
  try {
    const response = await fetch(apiUrlPayments, {
      method: "GET",
      headers: authHeader,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Create Record
export const createPayment = async (newPayment) => {
  try {
    // 確保 transaction_amount 是數字
    const formattedPayment = {
      Name: newPayment.Name,
      transaction_amount: parseFloat(newPayment.transaction_amount),
      time: newPayment.time,
      notes: newPayment.notes,
    };

    const response = await fetch(apiUrlPayments, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        fields: formattedPayment,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Update Record
export const updatePayment = async (paymentId, updatedFields) => {
  try {
    const response = await fetch(`${apiUrlPayments}/${paymentId}`, {
      method: "PATCH",
      headers: authHeader,
      body: JSON.stringify({
        fields: updatedFields
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
};

// Delete Record
export const deletePayment = async (paymentId) => {
  try {
    const response = await fetch(`${apiUrlPayments}/${paymentId}`, {
      method: "DELETE",
      headers: authHeader,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
};
