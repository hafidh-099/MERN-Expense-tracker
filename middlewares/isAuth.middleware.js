const jwt =require("jsonwebtoken");
const { authorize } = require("passport");
//we need this in order to validate user 
const isAuthenticated = (req,res,next)=>{
    //take token from header
    const headerObj = req.headers 
    //split by empty space and take second index
    const token = headerObj?.authorization?.split(" ")[1];
    //(?.)i.e if we have header object take authorization

    const varifyToken = jwt.verify(token,"is Secret",(error,decode)=>{
        if(error){
            return false
        }else{
            return decode
        }
    });
    if(varifyToken){
        //take id and save into req obj
        req.user=varifyToken.id
        next()
    }else{
        const error = new Error("token expire,login again");
        next(error)
    }
    // console.log(varifyToken)
}
module.exports=isAuthenticated;