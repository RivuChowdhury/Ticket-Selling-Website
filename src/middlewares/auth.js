const {getUser}=require('../services/auth');

async function restrictToLoggedInUserOnly(req,res,next){
    const userUid=req.cookies?.uid;
    if(!userUid){
        console.log("No userUid found");
        return res.redirect('/personal/login');
    }
    const user=getUser(userUid);
    console.log(userUid);
    console.log(user);
    if(!user){
        console.log('No user found');
        return res.redirect('/personal/login');
    }
    req.user=user;
    next();
}

async function checkAuth(req,res,next){
    const userUid=req.cookies?.uid;
    const user=getUser(userUid)
    //console.log('The user is: ',user);
    req.user=user;
    next();
}

module.exports={
    restrictToLoggedInUserOnly,
    checkAuth,
}