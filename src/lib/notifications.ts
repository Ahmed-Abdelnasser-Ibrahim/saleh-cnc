import nodemailer from "nodemailer";

interface OrderNotificationData {
  orderId: string;
  customerName: string;
  totalPrice: number;
  items: any[];
  phone: string;
  address: string;
}

export async function sendOrderNotificationToAdmin(data: OrderNotificationData) {
  // إعداد وسيلة الإرسال (SMTP)
  // ملاحظة: يجب إعداد هذه المتغيرات في ملف .env
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsHtml = data.items
    .map(
      (item) => `<li>${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} ج.م</li>`
    )
    .join("");

  const mailOptions = {
    from: `"Saleh CNC System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🔔 أوردر جديد وصل! (#${data.orderId.slice(-6)})`,
    html: `
      <div style="direction: rtl; font-family: cairo, sans-serif; border: 2px solid #fbbf24; padding: 20px; border-radius: 10px;">
        <h2 style="color: #fbbf24;">فيه أوردر جديد وصل يا صالح! 🚀</h2>
        <p><strong>العميل:</strong> ${data.customerName}</p>
        <p><strong>رقم الموبايل:</strong> ${data.phone}</p>
        <p><strong>العنوان:</strong> ${data.address}</p>
        <hr />
        <h3>المنتجات:</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>إجمالي المبلغ:</strong> ${data.totalPrice} ج.م</p>
        <hr />
        <a href="https://saleh-cnc.com/admin" style="background: #fbbf24; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">فتح لوحة التحكم</a>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent successfully");
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}
