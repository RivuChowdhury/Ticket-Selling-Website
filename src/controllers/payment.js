const Razorpay = require('razorpay'); 
const path=require('path');
const fs=require('fs');
const pool=require('../../database');

async function handlePayment(req,res){
    const secret = 'Rivu@12345'
    var {amount,description}=req.body;
    var instance = new Razorpay({ key_id: 'rzp_test_78gcG2fJzzjtxg', key_secret: 'N2CbgxmZJ6tZ99EfPKkyZUYz' })

    const customerName = req.session.customerName;
    const customerEmail = req.session.customerEmail;

   let order=await instance.orders.create({
    amount: amount*100,
    currency: "INR",
    receipt: "receipt#1",
  })


  //req.session.orderId = order.id;
  var sql = 'INSERT INTO newtransactions (payment_id, amount, currency, payment_status, email, Customer_name, descriptions) VALUES (?, ?, ?, ?, ?, ?, ?)';
  var values = [order.id, amount, 'INR', 'pending', customerEmail, customerName, description];


  pool.query(sql, values, (err, result) => {
      if (err) throw err;
      console.log('Payment information saved to the database.');
  });

  res.status(200).json({
    success:true,
    orderId: order.id,
    amount,
  });
}

function handleVerification(req,res){
    const secret = 'Rivu@12345'

    const receivedEvent = req.body.event;
    console.log('Received event is: ', receivedEvent);

    const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
        const sql = `
    UPDATE newtransactions
    JOIN (
        SELECT transaction_number
        FROM newtransactions
        ORDER BY transaction_number DESC
        LIMIT 1
    ) AS latest_transaction
    SET payment_status = ?
    WHERE newtransactions.transaction_number = latest_transaction.transaction_number`;
    const updateValues = [receivedEvent];
    pool.query(sql, updateValues, (err, result) => {
        if (err) throw err;
        console.log('Information updated to the database.');
    });
      

		//fs.writeFileSync("/Programming/Web Test/Ticket Resaling (payment status check)/V3/payment1.json", JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
}

async function handleReceipt(req, res) {
  const query = `
  SELECT accounts.Customer_id, accounts.Customer_name, accounts.Customer_Email,
         newtransactions.payment_id, newtransactions.amount, newtransactions.descriptions
  FROM accounts
  RIGHT JOIN newtransactions ON accounts.Customer_Email = newtransactions.email
  WHERE newtransactions.payment_status LIKE "payment.authorized"
  ORDER BY newtransactions.transaction_number DESC
  LIMIT 1
`;

  try {
      const [results, fields] = await pool.query(query);
      
      if (results.length > 0) {
          // Process the results here
          console.log('Query results:', results);
          res.render(path.join(__dirname, '../views/receipt'), { customer: results });
      } else {
          console.log('No results found');
          res.send('No results found');
      }
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}

module.exports={
    handlePayment,
    handleVerification,
    handleReceipt,
}