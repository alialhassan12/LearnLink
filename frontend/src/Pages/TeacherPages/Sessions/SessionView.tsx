import { useNavigate, useParams } from "react-router-dom";
import { useLiveSessionStore } from "../../../store/liveSessionsStore";
import { Button } from "../../../components/ui/button";

const SessionView =()=>{
    const {id}=useParams();
    const navigate=useNavigate();

    const {getToken,isGettingToken}=useLiveSessionStore();
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
            <Button onClick={handleStartSession} disabled={isGettingToken}>
                {isGettingToken ? "Starting Session..." : "Start Session"}
            </Button>
        </div>
    )
}

export default SessionView;