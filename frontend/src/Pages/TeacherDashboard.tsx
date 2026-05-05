import TeacherSidebar from "../components/teacherDashboardComponents/TeacherSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { Separator } from "../components/ui/separator";
import { TooltipProvider } from "../components/ui/tooltip";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./TeacherPages/Dashboard";
import MyCourses from "./TeacherPages/MyCourses";
import { ThemeToggle } from "../components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import useAuthStore from "../store/authStore";
import { Bell } from "lucide-react";
import CreateCourse from "./TeacherPages/CreateCourse";
import PublishedSuccessful from "./TeacherPages/PublishedSuccessful";

const TeacherDashboard=()=>{
    const {authUser}=useAuthStore();
    return(
        <SidebarProvider>
            <TooltipProvider>
                {/* sidebar */}
                <TeacherSidebar />
                {/* content */}
                <div className="p-4 space-y-4 w-full">
                    {/* top bar */}
                    <div className="flex items-center justify-between sticky top-0 z-50 bg-bg-1/50 backdrop-blur-xl border-b border-border">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Bell className="cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out hover:text-primary text-text-strong" />
                            <div className="flex items-center gap-2">
                                <Separator orientation="vertical" />
                                <Avatar>
                                    <AvatarImage src={authUser?.avatar} />
                                    <AvatarFallback>{authUser?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{authUser?.name}</span>
                                    <span className="text-sm text-text-weak">Teacher</span>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    {/* content routes */}
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/my-courses" >
                            <Route index element={<MyCourses/>}/>
                            <Route path="create" element={<CreateCourse/>}/>
                            <Route path="published-successful" element={<PublishedSuccessful/>}/>
                        </Route>
                    </Routes>
                </div>
                
            </TooltipProvider>
        </SidebarProvider>
    );
};

export default TeacherDashboard;