import FriendRequest from "../models/friendRequest.js";
import User from "../models/user.js"

export async function getRecommendationUsers(res , req){
try{
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
        $and :[
            {_id : {$ne : currentUserId}},
            {$id : {$nin : currentUser.friends}},
            {isOnBoarded : true},
        ],
    });
    res.status(200).json(recommendedUsers);
}
catch(err){
    console.log("Error is getRecommendationUsers controller " , err.message);
    res.status(500).json({message : "Internal server Error"});
}
}

export async function getMyFriends(res , req){
    try{
        const user = await User.findById(req.user.id).select("friends").populate("friends" , "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    }   
    catch(error){
        console.error("Error in getMyFriends controller" , error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
}

export async function sendFriendRequest(res , req){
    try{
        const myId = req.user.id;
        const {id: recipientId}= req.params;
        
        if(myId === recipientId){
            return res.status(400).json({message : "You cant send friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message : "Recipient not found !"});
        }

        if(recipient.friends.includes(myId)){
            return res.status(400).json({message : "you are already friends with this user"});
        }

        // check if request already exists
        const existingRequest = await FriendRequest.findOne({
            $or : [
                {sender : myId , recipient : recipientId},
                {sender : recipientId , recipient : myId},
            ],
        });

        if(existingRequest){
            return res.status(400).json({message : "A friend request already exists between you and this user "});
        }

        const friendRequest = await FriendRequest.create({sender : myId , recipient : recipientId});

        res.status(201).json(friendRequest);
    }
    catch(err){
        console.error("Error in sendFriendRequest controller",err.message);
        res.status(500).json({message : "Internal server error "});
    }
}

export async function acceptFriendRequest(res ,req){
    try{
        const {id : requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest)return res.status(404).json({message : "Friend request not found"});

        // verify the current user is the recipient 
        if(friendRequest.recipient.toString()!=req.user.id){
            return res.status(403).json({message : "You are not authorized to accept this request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friends array
        // $addToSet : adds elements to an array only if they do not already exists .

        await User.findByIdAndUpdate(friendRequest.sender , {
            $addToSet : {friends : friendRequest.recipient},
        })

        await User.findByIdAndUpdate(friendRequest.recipient , {
            $addToSet : {friends : friendRequest.sender},
        })

        res.status(200).json({message : "Friend request accepted"});
    }
    catch(err){
        console.error("Error in accepting the friend request ",err.message);
        res.status(500).json({message : "Internal server error"});
    }
}

export async function getFriendRequests(res, req){
    try{
        const incomingReqs = await FriendRequest.find({
            recipient : req.user.id,
            status :"pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender : req.user.id,
            status :"accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({incomingReqs , acceptedReqs});
    }
    catch(err){ 
        console.log("Error in getPendingFriendRequests controller" , err.message);
        res.status(500).json({message : "Internal server error"});
    }
}

export async function getOutgoingFriendReqs(res , req){
    try{
        const outgoingRequests = await FriendRequest.find({
            sender : req.user.id,
            status :"pending",
        }).populate("recipient" , "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    }
    catch(err){
        console.log("Error in getOutgoingFriendReqs controller" , err.message);
        res.status(500).json({message : "Internal server Error"});
    }
}