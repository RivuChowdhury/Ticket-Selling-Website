const pool=require('../../database');
const path=require('path');
const {setUser}=require('../services/auth');
const {comparePassword}=require('../services/hash');

async function handleAuthentication(req, res) {
    var email = req.body.logemail;
    var pass = req.body.psw;
  
    try {
        const query = 'SELECT * FROM accounts WHERE Customer_Email = ?';
        const [results,fields] =await pool.query(query, [email]);
        console.log(results);

        if (results.length > 0) {
            const customer = results[0];

            const isMatch = await comparePassword(pass, customer.Passkey);

            if (isMatch) {
                const token =setUser(results);
                const customerId = customer.Customer_id;
                const customerName = customer.Customer_name;
                const customerEmail = customer.Customer_Email;
                const customerPsw=customer.Passkey;

                req.session.customerId = customerId;
                req.session.customerName = customerName;
                req.session.customerEmail = customerEmail;
                req.session.customerPsw=customerPsw;

                console.log(results);
                res.cookie("uid", token);
                res.redirect('/personal/account');
            } else {
                res.status(401).send('Invalid email or password');
            }
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleUserLogin(req, res) {
    try {
        const customerEmail = req.session.customerEmail;
        const customerPsw = req.session.customerPsw;
        
        if (!customerEmail || !customerPsw) {
            return res.status(401).send('Unauthorized: No session data found');
        }

        const query1 = 'SELECT * FROM accounts WHERE Customer_Email = ? AND Passkey = ?';
        const [results] = await pool.query(query1, [customerEmail, customerPsw]);

        if (results.length > 0) {
            const customer = results[0];
            const customerId = customer.Customer_id;
            const customerName = customer.Customer_name;

            req.session.customerId = customerId;
            req.session.customerName = customerName;

            const query2 = `SELECT accounts.Customer_id, accounts.Customer_name, accounts.Customer_Email,
                            newtransactions.payment_id, newtransactions.amount, newtransactions.descriptions
                            FROM accounts 
                            RIGHT JOIN newtransactions 
                            ON accounts.Customer_Email = newtransactions.email
                            WHERE newtransactions.payment_status LIKE 'payment.authorized'
                            AND newtransactions.Customer_name LIKE ?`;

            const [results2] = await pool.query(query2, ['%' + customerName + '%']);

            res.render(path.join(__dirname, '../views/search-customer'), { customer: results, transactions: results2 });
        } else {
            res.status(401).send('Login failed');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


/*async function handleAuthentication(req,res){
    var email = req.body.logemail;
    var pass = req.body.psw;
    //const password=await comparePassword(pass);
  
    const query1 = 'SELECT * FROM accounts WHERE Customer_Email = ? and Passkey= ?';
    con.query(query1,[email,pass],(error,results,fields)=>{
        if (error) throw error;
        
        if(results.length>0){
            const customer = results[0];
            const token =setUser(results);
            const customerId = customer.Customer_id;
            const customerName = customer.Customer_name;
            const customerEmail = customer.Customer_Email;
            const customerPsw=customer.Passkey;

            req.session.customerId = customerId;
            req.session.customerName = customerName;
            req.session.customerEmail = customerEmail;
            req.session.customerPsw=customerPsw;

            console.log(results);
            //const token=setUser(results);           
            res.cookie("uid",token);
            res.redirect('/personal/account');
        }
    })
}*/

/*async function handleAuthentication(req,res){
    var email = req.body.logemail;
    var pass = req.body.psw;
    //const password=await comparePassword(pass);
  
    const query1 = 'SELECT * FROM accounts WHERE Customer_Email = ?';
    con.query(query1,[email],(error,results,fields)=>{
        if (error) throw error;
        
        if(results.length>0){
            const customer = results[0];
            console.log(customer);
            if(!(customer.comparePassword(pass,customer.Passkey))){
                return res.status(401).json({err:"Invalid user or password"});
            }
            const token =setUser(results);
            const customerId = customer.Customer_id;
            const customerName = customer.Customer_name;
            const customerEmail = customer.Customer_Email;
            const customerPsw=customer.Passkey;

            req.session.customerId = customerId;
            req.session.customerName = customerName;
            req.session.customerEmail = customerEmail;
            req.session.customerPsw=customerPsw;

            console.log(results);
            //const token=setUser(results);           
            res.cookie("uid",token);
            res.redirect('/personal/account');
        }
    })
}*/

/*async function handleUserLogin(req,res){
    //const customerName = req.session.customerName;
    const customerEmail = req.session.customerEmail;
    const customerPsw=req.session.customerPsw;
    const query1 = 'SELECT * FROM accounts WHERE Customer_Email = ? AND Passkey = ?';
    
    pool.query(query1, [customerEmail, customerPsw], (error, results, fields) => {
        if (error) throw error;
  
        if (results.length > 0) {
            // Successful login
            const customer = results[0];
            const customerId = customer.Customer_id;
            const customerName = customer.Customer_name;
            const customerEmail = customer.Customer_Email;

            req.session.customerId = customerId;
            req.session.customerName = customerName;
            req.session.customerEmail = customerEmail;

            // Extract customer name and use it in query2
            /*console.log(results);
            const token=setUser(results);           
            res.cookie("uid",token);
            //return res.redirect("/");
            const query2 = "SELECT accounts.Customer_id, accounts.Customer_name, accounts.Customer_Email, newtransactions.payment_id, newtransactions.amount, newtransactions.descriptions FROM accounts RIGHT JOIN newtransactions ON accounts.Customer_Email = newtransactions.email WHERE newtransactions.payment_status LIKE 'payment.authorized' AND newtransactions.Customer_name LIKE ?";
            
            con.query(query2, ['%' + customerName + '%'], (error, results2, fields2) => {
                if (error) throw error;

                //res.render(__dirname+'/public/search-customer', { customer: results, transactions: results2 });
                res.render(path.join(__dirname, '../views/search-customer'), { customer: results, transactions: results2 });
            });
        } else {
            // Failed login
            res.send('Login failed');
        }
    });
}*/


function handleGetPassword(req,res){
    var email=req.body.logemail;
    var query='SELECT Passkey FROM accounts WHERE Customer_Email = ?'
    pool.query(query, [email],(error, results, fields)=>{
        //res.render(__dirname+'/public/get-password',{passkey:results});
        res.render(path.join(__dirname,'../views/get-password'),{passkey:results});
    })
}

module.exports={
    handleAuthentication,
    handleUserLogin,
    handleGetPassword,
}