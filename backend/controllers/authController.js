const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "30d"});
}

//register user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    //Validate Check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try {
        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        //Create new user
        const user = await User.create({ 
            fullName,
            email, 
            password,
            profileImageUrl
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering User", error: err.message });
    }
};

//login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    try{
        const user=await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }catch(err){
        res.status(500).json({ message: "Error logging in User", error: err.message });
    }
};

//get user info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(402).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({ message: "Error fetching user info", error: err.message });
    }
};