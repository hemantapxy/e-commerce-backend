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
  try {
    if (!order || !order.items || order.items.length === 0) {
      throw new Error("Order items are missing");
    }

    // Generate the items list
    const itemsText = order.items
      .map((item, idx) => {
        const name = item.product?.name || "Unknown Product";
        const price = item.product?.price || 0;
        const qty = item.qty || 1;
        return `${idx + 1}. ${name} x${qty} - ₹${price * qty}`;
      })
      .join("\n");

    // Calculate total amount
    const totalAmount = order.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const qty = item.qty || 1;
      return sum + price * qty;
    }, 0);

    // Send email
    await transporter.sendMail({
      from: `"E-Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Order Confirmed 🧾 (Invoice Attached)",
      text: `
Hello,

Your order has been placed successfully 🎉

Order ID: ${order._id}
Items:
${itemsText}

Total Amount: ₹${totalAmount}

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
  } catch (err) {
    console.error("❌ Failed to send order email:", err.message);
    throw err;
  }
};

export default transporter;
