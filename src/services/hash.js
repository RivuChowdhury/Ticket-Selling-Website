const bcrypt=require('bcrypt');

async function hashedPassword(password){
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    return hashedPassword;
}

function comparePassword(password,hashedPassword) {
    return bcrypt.compare(password,hashedPassword);
}

module.exports={
    hashedPassword,
    comparePassword
}