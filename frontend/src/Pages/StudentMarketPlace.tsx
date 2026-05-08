import Footer from "../components/Footer";
import Header from "../components/Header";
import useAuthStore from "../store/authStore";

const StudentMarketPlace=()=>{
    const authUser=useAuthStore((state)=>state.authUser);
    const logout=useAuthStore((state)=>state.logout);
    return (
        <div>
            <Header/>
            <h1>Student Market Place</h1>
            <button onClick={logout}>Logout</button>
            <div className="h-[1000px]"></div>
            <Footer/>
        </div>
    );
};

export default StudentMarketPlace;