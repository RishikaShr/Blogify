const {checkAuthentication}=require("../services/auth");

function check(tokenName){
    return (req,res,next)=>{
        const token=req.cookies[tokenName];
        if(!token) return next();
        try{
            const tokenUser=checkAuthentication(token);
            req.user=tokenUser;
        }catch(error){}
        return next();
    };
}

module.exports=check;