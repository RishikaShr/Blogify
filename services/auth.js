const jwt=require("jsonwebtoken");
const secret="lalalalhahahaha";

function createToken(user){
    const payload={
        _id:user._id,
        name:user.fullName,
        email:user.email,
        role:user.role,
    }
    const token=jwt.sign(payload,secret);
    return token;
}

function checkAuthentication(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={
    createToken,
    checkAuthentication,
}