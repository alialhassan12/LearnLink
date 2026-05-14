import { useNavigate, useParams } from "react-router-dom";
import { useLiveSessionStore } from "../../../store/liveSessionsStore";
import { Button } from "../../../components/ui/button";
import { useEffect } from "react";

const SessionView =()=>{
    const {id}=useParams();
    const navigate=useNavigate();

    const {getToken,isGettingToken,teacherSelectedSession,isGettingTeacherSelectedSession,getTeacherSelectedSession}=useLiveSessionStore();
    
    useEffect(()=>{
        if(id){
            getTeacherSelectedSession(Number(id));
        }
    },[id,getTeacherSelectedSession]);


    const handleStartSession=async()=>{
        if(id){
            const roomName=`session-${id}`;
            await getToken(roomName);
            navigate(`/room/${roomName}`);
        }
    }

    return(
        <div>
            <p>Session View</p>
            <p>{teacherSelectedSession?.id}</p>
            <p>{teacherSelectedSession?.scheduled_date}</p>
            <p>{teacherSelectedSession?.scheduled_time}</p>
            <p>{teacherSelectedSession?.student?.user?.name}</p>
            <Button onClick={handleStartSession} disabled={isGettingToken}>
                {isGettingToken ? "Starting Session..." : "Start Session"}
            </Button>
        </div>
    )
}

export default SessionView;