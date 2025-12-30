import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // MUST be at top

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // FIX for Gmail TLS issue
  },
});

// ✅ Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

// ✅ Send order confirmation email
export const sendOrderEmail = async (to, order) => {
  try {
    await transporter.sendMail({
      from: `"E-Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Order Confirmed ✅",
      text: `
Hello,

Your order has been placed successfully 🎉

Order ID: ${order._id}
Total Amount: ₹${order.totalAmount}

Thank you for shopping with us!
– E-Shop Team
      `,
    });

    console.log("📧 Order email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

export default transporter;
