import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderEmail = async (to, order, invoicePath) => {
  await transporter.sendMail({
    from: `"E-Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Order Confirmed 🧾 (Invoice Attached)",
    text: `
Hello,

Your order has been placed successfully 🎉

Order ID: ${order._id}
Total Amount: ₹${order.totalAmount}

Please find your invoice attached.

– E-Shop Team
    `,
    attachments: [
      {
        filename: "invoice.pdf",
        path: invoicePath,
      },
    ],
  });

  console.log("📧 Order email with invoice sent to:", to);
};

export default transporter;
