const express=require("express");
const router=express.Router();
const path=require("path");
const {handleUserLogin, handleGetPassword, handleAuthentication}=require('../controllers/login')
const {restrictToLoggedInUserOnly}=require('../middlewares/auth');

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login/index.html'));
})

router.post('/authenticate',handleAuthentication);

//router.post('/account',restrictToLoggedInUserOnly,handleUserLogin);
router.get('/account',restrictToLoggedInUserOnly,handleUserLogin);
//router.get('/account',handleUserLogin);

router.post('/forgot-password',(req,res)=>{
    res.render(path.join(__dirname,'../views/forgot-password'));
})

router.post('/get-password',handleGetPassword);

module.exports=router;