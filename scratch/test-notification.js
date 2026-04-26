
async function testOrder() {
  const orderData = {
    customerName: "زبون تجريبي (Antigravity)",
    phone: "01234567890",
    governorate: "القاهرة",
    city: "مدينة نصر",
    address: "شارع التجربة - أوردر اختبار",
    items: [
      { id: "test-1", name: "لوحة خشبية ليزر", price: 250, quantity: 1 },
      { id: "test-2", name: "ساعة حائط مودرن", price: 450, quantity: 2 }
    ],
    totalPrice: 1150,
    paymentMethod: "cash_on_delivery"
  };

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    console.log("Test Order Result:", result);
  } catch (error) {
    console.error("Test Order Failed:", error);
  }
}

testOrder();
