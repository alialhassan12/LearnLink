import { Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const publishedSuccessful = () => {
    const navigate=useNavigate();
    return (
        <div>
            <h1>Published Successful</h1>
            <Button variant="default" className="px-4 h-10 cursor-pointer" onClick={()=>navigate('/dashboard')}>
                <Home/>
                Go to Dashboard
            </Button>
        </div>
    );
};

export default publishedSuccessful;