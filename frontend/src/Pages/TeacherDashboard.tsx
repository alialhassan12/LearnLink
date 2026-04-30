import useAuthStore from "../store/authStore";

const TeacherDashboard=()=>{
    const {authUser,logout}=useAuthStore();
    return(
        <>
            <div>
                <h1>Teacher Dashboard - {authUser?.name}</h1>
                <p>Email - {authUser?.email}</p>
                <p>Role - {authUser?.role}</p>
            </div>
            {/* logout button */}
            <button onClick={()=>logout()}>Logout</button>
        </>
    );
};

export default TeacherDashboard;