const express=require("express");
const router=express.Router();

const { handlePayment, handleVerification, handleReceipt } = require("../controllers/payment");

router.post('/',handlePayment);

router.post('/verification',handleVerification);

router.get('/receipt',handleReceipt);

module.exports=router;