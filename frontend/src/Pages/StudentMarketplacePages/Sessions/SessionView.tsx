import { useParams } from "react-router-dom";

const SessionView = () => {
    const {id}=useParams();
    
    return (
        <div>
            <p>{id}</p>
        </div>
    );
};

export default SessionView;