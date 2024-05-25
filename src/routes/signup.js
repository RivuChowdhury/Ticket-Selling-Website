const express=require("express");
const router=express.Router();
const path=require("path");
const con=require('../../database');
const { handleUserSignUp } = require("../controllers/signup");

router.get('/',async(req,res)=>{
    if(!req.user){
        return res.sendFile(path.join(__dirname,'../views/index.html'));
    }
    //res.render(path.join(__dirname,'../views/search-customer'));
    return res.redirect('/personal/account');
})

router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/signup/index.html'));
})

router.post('/signup',handleUserSignUp);

module.exports=router;