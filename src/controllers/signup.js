const path=require('path');
const pool=require('../../database');
const {hashedPassword}=require('../services/hash');

async function handleUserSignUp(req,res){
    var name=req.body.uname;
    var email=req.body.uemail;
    var pass=req.body.psw;

    const encryptPassword=await hashedPassword(pass);
    //con.connect(function(err){
        //if(err) throw err;
        
        var sql="INSERT INTO accounts(Customer_name,Customer_Email,Passkey) VALUES (?, ?, ?) ";
        const [result] = await pool.query(sql, [name, email, encryptPassword]);

        //res.send("Account Created Successfully with ID: " + result.insertId);
        var selectSql = "SELECT * FROM accounts WHERE Customer_Email = ?";
        const [customer] = await pool.query(selectSql, [email]);

        res.render(path.join(__dirname, '../views/create-account'), { customer: customer });

    //})
}

module.exports={
    handleUserSignUp,
}