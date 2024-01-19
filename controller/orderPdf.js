const OrderPDF = function ({ user, items, paymentMethod, totalPrice }) {
    const today = new Date();
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
      
      .invoice-container {
          margin: 0;
          padding: 0;
          padding-top: 10px;
          font-family: 'Roboto', sans-serif;
          width: 530px;
          margin: 0px auto;
          }
      
      table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      table td, table th {
        border: 1px solid rgb(247, 247, 247);
        padding: 10px;
      }
      
      table tr:nth-child(even){background-color: #f8f8f8;}
      
      table tr:hover {background-color: rgb(243, 243, 243);}
      
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #FFFFFF;
        color: rgb(78, 78, 78);
      }
      
      .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 5px;
          
      
      }
      .address {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0px 15px 0px;
          line-height: 10px;
          font-size: 12px;
          margin-top: -20px
      
      }
      
      .status {
          text-align: right;
      }
      .receipt-id {
          text-align: right;
      }
      
      .title {
          font-weight: 100px;
          text-transform: uppercase;
          color: gray;
          letter-spacing: 2px;
          font-size: 8px;
          line-height: 5px;
      }
      
      .summary {
          margin-top: 2px;
          margin-right: 0px;
          margin-left: 50%;
          margin-bottom: 15px;
      }
      
      img {
          width: 100px;
         
      }
      
      </style>
      </head>
      <body>
      <div class="invoice-container">
      
      <section  class="header">
              <div>
                <h3>Subhash Super Store</h3>
              </div>
              <div class="receipt-id" style="margin-top: -120px 0 40px 0">
                  
              </div>
      </section> 
      <section class="address">
      
           
          <div>
              <p class="title">From:</p>
              <h4 style="font-size: 9px; line-height: 5px">Subhash Super Store</h4>
              <p style="font-size: 9px; line-height: 5px">subhas.store2023@gmail.com</p>
              <p style="font-size: 9px; line-height: 5px">+91-7388089999</p>
          </div>
      
            <div style="margin-bottom: 100px; margin-top: 20px">
            <p class="title">Bill to:</p>
            <h4 style="font-size: 9px; line-height: 5px">${user.name}</h4>
            <p style="font-size: 9px; line-height: 5px">${user.email}</p>
            <p style="font-size: 9px; line-height: 5px">${
              user.shippingAddress.mobileNumber
            }</p>
            <p style="font-size: 9px; line-height: 5px">${
              user.shippingAddress.address
            },${user.shippingAddress.zone},</p>
            <p style="font-size: 9px; line-height: 5px">${
              user.shippingAddress.region
            },${user.shippingAddress.pincode},${user.shippingAddress.city}</p>
            </div>
      
         
      </section>
      
      <table style="text-align: center">
        <tr>
          <th style="font-size: 9px">Item Name</th>
          <th style="font-size: 9px">Item Image</th>
          <th style="font-size: 9px">Quantity</th>
          <th style="font-size: 9px">Price</th>
          <th style="text-align: right; font-size: 9px">Amount</th>
        </tr>
      
        ${items.map(
          (item) =>
            `  <tr>
          <td style="font-size: 9px; width: "150px"; overflow-wrap: break-word">${
            item.name
          }</td>
          <td ><img width="40" height="40" src = ${item.image} /></td>
          <td style="font-size: 9px">${item.qty}</td>
          <td style="font-size: 9px">${item.price}</td>
          <td style="text-align: right; font-size: 9px">${
            totalPrice
          }</td>
        </tr>`
        )}
      
      
      </table>
      
      <section class="summary">
          <table>
              <tr>
                <th style="font-size: 9px">Invoice Summary</th>
                <th></th>
              </tr> 
              <tr>
                  <td style="font-size: 10px" >Payment Mode</td>
                  <td style="text-align: right; font-size: 9px; font-weight: 700">COD</td>
                </tr>
                 
                <tr>
                <td style="font-size: 9px">Total</td>
                <td style="text-align: right; font-size: 9px; font-weight: 700">${totalPrice}</td>
              </tr>
              
            </table>
        </section>
        <div>
            <hr>
            <h4 style="font-size: 9px">Note</h4>
            <p style="font-size: 9px"></p>
        </div>
      </div>
      </body>
      </html>`;
  };
  
  module.exports = OrderPDF;
  