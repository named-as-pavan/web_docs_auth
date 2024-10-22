import { User } from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail ,sendPasswordResetEmail,sendResetSuccessfulEmail} from "../mailtrap/email.js";
import crypto from 'crypto'

export const signup = async(req,res)=>{
    const {email,password,name} = req.body;
    try {
        if(!email || !password || !name){
            throw new Error('Please Fill all the fields')
        }
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success:false, message:"User already exists"})
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000, //24hrs

        })


        await user.save();


        // jwt
        generateTokenAndSetCookie(res,user._id);


       await sendVerificationEmail(user.email,verificationToken);
        res.status(201).json({success:true,message:"User created successfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        })

    } catch (error) {
        res.status(400).json({success:false, message:error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;  // Get the verification code from the request body

    try {
        // Find the user with the given verification token that hasn't expired
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        // If no user is found, return a 400 error
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        // Update user verification status and remove the token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();  // Save the updated user information

        // Send a welcome email after successful verification
        await sendWelcomeEmail(user.email, user.name);
        
        // Send success response
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,  // Ensure the password is not returned
            },
        });
    } catch (error) {
        console.error("Error verifying email:", error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials user not found" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Assuming generateTokenAndSetCookie is a function to handle token generation
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.error("Error in login:", error);  // Log full error details
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



export const logout = async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success:true,message:"Loggeed out successfully"})
}


export const forgotPassword = async(req,res)=>{
    const { email } = await req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success:true,message:"Invalid Email"})
        }


        // generate reset password


        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;  //1 hour


        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();


        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);


        res.status(200).json({success:true, message:"Password reset link sent to our email"});

    } catch (error) {
        console.log("Error in forgotPassword",error);
        res.status(400).json({success:false,message:error.message});
    }

}


export const resetPassword = async(req,res)=>{
    try {
        const{token} = req.params;
        const {password} = req.body;


        const user = await User.findOne({
            resetPasswordToken:token,
            resetPasswordExpiresAt: {$gt :Date.now()},

})
        if (!user){
            return res.status(400).json({success:false,message:"Invalid or expired reset token"});
        }


        // update password

        const hashedPassword=await bcryptjs.hash(password,10);

        user.password=hashedPassword;

        user.resetPasswordToken=undefined;

        user.resetPasswordExpiresAt=undefined;
        user.save();

        await sendResetSuccessfulEmail(user.name);

        res.status(200).json({success:true,message:"Password reset successful"})

    } catch (error) {
        console.log("error in resetPasword",error)
        res.status(400).json({success:false,message:error.message})
    }
}


export const checkAuth = async(req ,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")

        if(!user){
            return res.status(400).json({success:false,message:"User not found"});
        }

        res.status(200).json({success:true,user
        })
    } catch (error) {
        console.log("Error in checkAuth",error)
        res.status(400).json({success:false,message:error.message})
    }
}