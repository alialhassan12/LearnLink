import { Route, Routes } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useAuthStore from "../store/authStore";
import Browse from "./StudentMarketplacePages/Browse";
import BrowseTeachers from "./StudentMarketplacePages/BrowsePages/BrowseTeachers";
import BrowseCourses from "./StudentMarketplacePages/BrowsePages/BrowseCourses";
import TeacherProfile from "./StudentMarketplacePages/BrowsePages/TeacherProfile";
import MyBookings from "./StudentMarketplacePages/MyBookings";

const StudentMarketPlace=()=>{
    const authUser=useAuthStore((state)=>state.authUser);
    const logout=useAuthStore((state)=>state.logout);

    return (
        <div>
            <Header/>
            {/* content routes */}
            <Routes>
                <Route path="/" element={<Browse/>} />
                <Route path="/browse/teachers" element={<BrowseTeachers/>} />
                <Route path="/browse/teachers/:id" element={<TeacherProfile/>}/>
                <Route path="/browse/courses" element={<BrowseCourses/>} />
                <Route path="/bookings" element={<MyBookings/>} />
            </Routes>
            <Footer/>
        </div>
    );
};

export default StudentMarketPlace;