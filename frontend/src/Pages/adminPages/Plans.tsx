import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const Plans = () => {
    const navigate=useNavigate();

    return (
        <div className="flex flex-col ">
            {/* top section */}
            <h1 className="text-3xl font-extrabold text-text-strong">Monetization Engine</h1>
            <div className="flex justify-between items-center">
                <p className="text-text-weak">Manage your product pricing strategy. Adjust tiers, features, and billing cycles for the LearnLink ecosystem.</p>
                <Button 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
                    onClick={()=>navigate('/admin/dashboard/plans/new')}
                >
                    <Plus/>
                    Create Plan
                </Button>
            </div>
        </div>
    );
};

export default Plans;