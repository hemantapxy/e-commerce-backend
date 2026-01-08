import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order, user) => {
  return new Promise((resolve, reject) => {
    const invoiceName = `invoice-${order._id}.pdf`;
    const invoicePath = path.join("invoices", invoiceName);

    // ensure invoices folder exists
    if (!fs.existsSync("invoices")) {
      fs.mkdirSync("invoices");
    }

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(invoicePath);

    doc.pipe(stream);

    // 🧾 HEADER
    doc
      .fontSize(20)
      .text("E-Shop Invoice", { align: "center" })
      .moveDown();

    doc.fontSize(12);
    doc.text(`Invoice ID: ${order._id}`);
    doc.text(`Customer: ${user.username || "Customer"}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.phone || "N/A"}`);
    doc.text(`Address: ${user.address || "N/A"}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // 📦 ITEMS
    doc.fontSize(14).text("Order Items");
    doc.moveDown(0.5);

    // calculate total amount
    let totalAmount = 0;

    order.items.forEach((item, idx) => {
      const name = item.product?.name || "Unknown Product";
      const price = item.product?.price || 0;
      const quantity = item.quantity || 1;
      const itemTotal = price * quantity;
      totalAmount += itemTotal;

      doc
        .fontSize(12)
        .text(`${idx + 1}. ${name} - ${quantity} x ₹${price} = ₹${itemTotal}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: ₹${totalAmount}`, { align: "right" });

    doc.end();

    stream.on("finish", () => resolve(invoicePath));
    stream.on("error", reject);
  });
};
