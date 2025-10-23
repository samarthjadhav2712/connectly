import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_KEY;
const apiSecret = process.env.STREAM_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API Key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey , apiSecret);

export const upsertStreamUser = async(userData) =>{
    try{
        await streamClient.upsertUsers(userData);
        return userData;
    }
    catch(error){
        console.log("Error upserting Stream User ! " , error);
    }
};

export const generateStreamToken = (userId) => {
    try{
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    }
    catch(err){
        console.error("Error generating Stream Token " , err);
    }
};