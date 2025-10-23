import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(res , req){
    try{
        const token = generateStreamToken(req.user.id);
        res.status(200).json({token});
    }   
    catch(err){
        console.log("Error in getStreamToken controller " , err.message);
        res.status(500).json({message : "Internal server error "});
    }
}