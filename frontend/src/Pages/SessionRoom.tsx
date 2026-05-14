import {
    LiveKitRoom,
    VideoConference,
    RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useNavigate } from "react-router-dom";

function SessionRoom({
    token,
    serverUrl,
}: {
    token: string;
    serverUrl: string;
}) {
    const navigate = useNavigate();

    if (!token || !serverUrl) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background gap-4">
                <p className="text-muted-foreground text-lg">Waiting for session credentials...</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden">
            <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                audio={true}
                video={true}
                data-lk-theme="default"
                className="flex-1 flex flex-col h-full"
                onDisconnected={() => navigate(-1)}
            >
                <VideoConference />
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}

export default SessionRoom;