import { LeaveIcon, useRoomContext } from "@livekit/components-react";
import { useNavigate } from "react-router-dom";
import { useLiveSessionStore } from "../store/liveSessionsStore";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const CustomLeaveButton =({isTeacher,session_id}:{isTeacher:boolean,session_id:number})=>{
    const room=useRoomContext();
    const{endSession,isEndingSession}=useLiveSessionStore();
    const navigate=useNavigate();
    
    const handleLeave=async()=>{
        if(isTeacher){
            await endSession(session_id);
        }
        room.disconnect();
        navigate(-1);
    }

    return(
        <Button
            variant="destructive"  
            disabled={isEndingSession}
            onClick={handleLeave} 
        >
            {
                isTeacher ? (
                    isEndingSession?<Spinner/>:<LeaveIcon/>
                ):(
                    <LeaveIcon/>
                )
            }
            Leave
        </Button>
    );
}

export default CustomLeaveButton;
