import useAuthStore from "../store/authStore";

const StudentDashboard=()=>{
    const authUser=useAuthStore((state)=>state.authUser);
    const logout=useAuthStore((state)=>state.logout);
    return (
        <div>
            <h1>Student Dashboard - {authUser?.name}</h1>
            <p>Email - {authUser?.email}</p>
            <p>Role - {authUser?.role}</p>
            {/* logout button */}
            <button onClick={()=>logout()}>Logout</button>
        </div>
    );
};

export default StudentDashboard;