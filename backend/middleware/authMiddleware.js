const jwt=require("jsonwebtoken");
const User=require("../models/User");

exports.protect = async (req,res,next)=>{
    let token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);
    if(!token){
        console.log("No token found in headers");
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try{
        console.log('JWT_SECRET:', process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("password");
        next();
    }catch(err){
        console.error("Token verification failed:", err);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};