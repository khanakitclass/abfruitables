const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts);

const generateOrderPDF = (order, callback) => {
  const totalAmount = order.amount;
  const discount = order.discount;
  const finalTotal = totalAmount - discount;

  const docDefinition = {
    content: [
      { text: 'Order Confirmation', style: 'header' },
      { text: `Order ID: ${order._id}`, style: 'subheader' },
      { text: 'Products:', style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [{ text: 'Product', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }],
            ...order.products.map((product, index) => [
              `Product ${index + 1}`,
              product.quantity.toString()
            ])
          ]
        }
      },
      { text: `Amount: ${totalAmount}`, style: 'content' },
      { text: `Discount: ${discount}`, style: 'content' },
      { text: `Final Total: ${finalTotal}`, style: 'content' }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      subheader: {
        fontSize: 15,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      content: {
        fontSize: 12,
        margin: [0, 5, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const pdfPath = path.resolve(__dirname, '../../public/pdfs', `order_${order._id}.pdf`);

  pdfDoc.pipe(fs.createWriteStream(pdfPath));
  pdfDoc.end();

  pdfDoc.on('end', () => {
    callback(null, pdfPath);
  });
};

module.exports = generateOrderPDF;
