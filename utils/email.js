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

// ✅ Verify SMTP
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendOrderEmail = async (to, order) => {
  const itemsText = order.items
    .map(
      (item) =>
        `${item.name} (${item.quantity} x ₹${item.price}) = ₹${
          item.quantity * item.price
        }`
    )
    .join("\n");

  await transporter.sendMail({
    from: `"E-Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Order Confirmed 🧾",
    text: `
Hello,

Your order has been placed successfully 🎉

Order ID: ${order._id}

Items:
${itemsText}

Total Amount: ₹${order.totalAmount}

Thank you for shopping with us!
– E-Shop Team
    `,
  });

  console.log("📧 Order email sent to:", to);
};

export default transporter;
