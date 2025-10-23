import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    try{
        const {email , password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message : "All fields are required !"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message : "Invalid email !"});
        }

        const isPasswordCorrect = await user.matchPassword(password); 
        if(!isPasswordCorrect) return res.status(401).json({message : "Invalid password !"});

         // generate jwt token for the user
        const token = jwt.sign({userId  : user._id} , process.env.JWT_SECRET , {expiresIn : '7d'});

        // set token in httpOnly cookie
        res.cookie("jwt" , token , {
            httpOnly : true, // to prevent XSS attacks
            secure : process.env.NODE_ENV === 'production', // set secure flag in production
            sameSite : 'strict', // to prevent CSRF attacks
            maxAge : 7*24*60*60*1000, // 7 days
        });

        res.status(200).json({message : "success" , user});
    }
    catch(err){
        console.log("Enter in login controller " , error.message);
        res.status(500).json({message : "Internal server error !"});
    }
}

export async function signup(req, res) {
    const { fullName, email, password } = req.body;
    try {
        // validations 
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const randomId = Math.floor(Math.random() * 100) + 1;

        const profilePicUrl = `https://avatar.iran.liara.run/public/${randomId}`;

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: profilePicUrl, // 3. Use the new random URL
        });

        try {
            await upsertStreamUser([{
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            }]);
            console.log(`Stream user created for ${newUser.fullName}`);
        }
        catch (err) {
            console.log("Error creating Stream User :", err);
        }

        // generate jwt token for the user
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // set token in httpOnly cookie
        res.cookie("jwt", token, {
            httpOnly: true, // to prevent XSS attacks
            secure: process.env.NODE_ENV === 'production', // set secure flag in production
            sameSite: 'strict', // to prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({ success: true, user: newUser });
    }
    catch (err) {
        console.error("Signup error: ", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({success: true , message : "Logout successfully !"});
}

export async function onBoard(req , res){
    try{
        const userId = req.user._id;

        const {fullName , bio , nativeLanguage , learningLanguage , location } = req.body;

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message : "All fields are required" , 
                missingFields : [
                    !fullName && "fullName",
                    !bio && "bio" , 
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId , {
            fullName: fullName,
            bio: bio,
            nativeLanguage: nativeLanguage,
            learningLanguage: learningLanguage,
            location: location,
            isOnBoarded : true,
        } , {new : true})

        if(!updatedUser)return res.status(404).json({message : "User not found"});

        try{
        // update the user in Stream 
        await upsertStreamUser({
            id : updatedUser._id.toString(),
            name : updatedUser.fullName,
            image : updatedUser.profilePic || "",
        });
        console.log(`Stream user updated after onBoarding for ${updatedUser.fullName}`);
        }
        catch(err){
             console.log(`Error updating user during onBoarding for ${updatedUser.fullName}`);
        }

        res.status(200).json({success : true , user : updatedUser});
    }
    catch(error){
        console.log("Onboarding error ",error);
          res.status(500).json({message : "Internal server error"});
    }
}