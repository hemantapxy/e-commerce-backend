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
    doc.text(`Customer: ${user.name || "Customer"}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // 📦 ITEMS
    doc.fontSize(14).text("Order Items");
    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc
        .fontSize(12)
        .text(
          `${item.product.name} - ${item.quantity} x ₹${item.product.price} = ₹${
            item.quantity * item.product.price
          }`
        );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, {
      align: "right",
    });

    doc.end();

    stream.on("finish", () => resolve(invoicePath));
    stream.on("error", reject);
  });
};
