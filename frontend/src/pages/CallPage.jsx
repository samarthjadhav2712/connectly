import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // FIX 1: Added useNavigate
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import toast from "react-hot-toast"; // FIX 2: Added toast import

import { // FIX 3: Cleaned up formatting
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    // These variables are declared here to be accessible in the cleanup function
    let videoClient;
    let callInstance;

    const initCall = async () => {
      // FIX 4: Check for tokenData itself, not tokenData.token
      // This prevents a crash if tokenData is undefined.
      if (!tokenData || !authUser || !callId) return;

      try {
        console.log("Initializing Stream Video Client ....");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token, // Now it's safe to access .token
        });

        callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined Call Successfully !");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call : ", error);
        toast.error("Could not join the call , Please try again !");
      } finally {
        setIsConnecting(false);
      }
    };
    
    initCall();

    // FIX 5: Add cleanup function to leave the call and disconnect
    return () => {
      console.log("Cleaning up call...");
      callInstance?.leave();
      videoClient?.disconnectUser();
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate(); // This now works thanks to FIX 1

  if (callingState === CallingState.LEFT) {
    navigate("/");
    return null; // Return null after navigation
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;