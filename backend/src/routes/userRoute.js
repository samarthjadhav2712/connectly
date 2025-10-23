import express from "express"
import { protectedRoute } from "../middleware/authMiddleware.js";
import { getRecommendationUsers , getMyFriends ,sendFriendRequest , acceptFriendRequest , getFriendRequests , getOutgoingFriendReqs} from "../controllers/userController.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/" , getRecommendationUsers);
router.get("/friends" ,getMyFriends);

router.post("/friend-request/:id" , sendFriendRequest);
router.put("/friend-request/:id/accept" , acceptFriendRequest);
router.get("/friend-requests" , getFriendRequests);
router.get("/outgoing-friend-requests" , getOutgoingFriendReqs);

export default router;