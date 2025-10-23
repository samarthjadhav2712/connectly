import express from 'express';
import { login, logout, signup , onBoard } from '../controllers/authController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// auth routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

router.post("/onBoarding", protectedRoute , onBoard);

// check if user is logged in or not !
router.get("/me",protectedRoute,(req,res)=>{
    res.status(200).json({success: true , user : req.user});
});

export default router;