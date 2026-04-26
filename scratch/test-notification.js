
async function testOrder() {
  const orderData = {
    customer: "زبون تجريبي (Antigravity)",
    phone: "01234567890",
    city: "القاهرة",
    address: "شارع التجربة - أوردر اختبار",
    items: [
      { id: "test-1", name: "لوحة خشبية ليزر", price: 250, quantity: 1 },
      { id: "test-2", name: "ساعة حائط مودرن", price: 450, quantity: 2 }
    ],
    total: 1150,
    paymentMethod: "cash_on_delivery"
  };

  try {
    const response = await fetch('https://saleh-cnc-vp15.vercel.app/api/orders', {
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
