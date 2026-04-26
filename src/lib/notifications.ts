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
    subject: `🆕 أوردر جديد: ${data.customerName} (#${data.orderId.slice(-6).toUpperCase()})`,
    html: `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
          body { font-family: 'Cairo', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; color: white; border: 2px solid #fbbf24; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { text-align: center; border-bottom: 1px solid #333; pb-6; mb-6; }
          .title { color: #fbbf24; font-size: 24px; margin: 0; }
          .detail-row { margin: 15px 0; font-size: 16px; border-bottom: 1px solid #222; pb-2; }
          .label { color: #fbbf24; font-weight: bold; }
          .items-list { background: #1a1a1a; padding: 15px; border-radius: 12px; list-style: none; }
          .btn { display: block; background: #fbbf24; color: black; text-align: center; padding: 15px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 class="title">وصلك أوردر جديد يا صالح! 🚀</h2>
          </div>
          <div class="detail-row"><span class="label">العميل:</span> ${data.customerName}</div>
          <div class="detail-row"><span class="label">الموبايل:</span> ${data.phone}</div>
          <div class="detail-row"><span class="label">العنوان:</span> ${data.address}</div>
          <div class="items-list">
            <h3 style="margin-top: 0; font-size: 18px;">المنتجات:</h3>
            <ul style="padding-right: 20px;">${itemsHtml}</ul>
          </div>
          <div class="detail-row" style="border: none; font-size: 20px;"><span class="label">الإجمالي:</span> ${data.totalPrice} ج.م</div>
          <a href="https://saleh-cnc-vp15.vercel.app/admin" class="btn">فتح لوحة التحكم بالطلبات</a>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent successfully");
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
  }
}
