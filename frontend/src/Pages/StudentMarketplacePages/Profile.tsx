import { useEffect } from "react";
import { useStudentStore } from "../../store/studentmarketplaceStores/studentStore";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Album, Calendar, CheckCheck } from "lucide-react";
import { useCourseEnrollmentStore } from "../../store/studentmarketplaceStores/courseEnrollmentStore";

const Profile =()=>{
    const {student,isGettingStudent,getStudent,completedSessionCount}=useStudentStore();
    const {enrolledCoursesIds}=useCourseEnrollmentStore();

    useEffect(()=>{
        getStudent();
    },[getStudent]);

    const cards=[
        {
            id:0,
            title:"Sessions Conpleted",
            icon:CheckCheck,
            value:completedSessionCount
        },
        {
            id:1,
            title:"Courses Enrolled",
            icon:Album,
            value:enrolledCoursesIds.length
        }
    ];

    if(isGettingStudent){
        return <StudentProfileSkeleton/>
    }

    return(
        <div className="flex flex-col px-4 py-4">
            {/* basic info */}
            <div className="flex flex-row flex-wrap w-full gap-4 items-center bg-card border border-border rounded-lg shadow-sm p-6">
                {/* avatar */}
                <div className="">
                    <Avatar className="w-40 h-40">
                        <AvatarImage src={student?.user.avatar} />
                        <AvatarFallback className="text-4xl">{student?.user?.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                
                <div className="flex flex-col w-3/4 ">
                    <div className="flex justify-between items-center w-full mb-3">
                        <div >
                            <p className="text-text-strong font-bold text-lg">{student?.user?.name}</p>
                            <p className="text-primary font-semibold">{student?.headline}</p>
                        </div>
                        <div >
                            <span className="flex items-center gap-2 p-2 bg-text-weak/10 text-text-weak rounded-full text-sm">
                                <Calendar size={"20px"} />
                                Joined {new Date(student?.user.created_at).toDateString()}
                            </span>
                        </div>
                    </div>
                    <p className="text-text-weak">{student?.bio}</p>
                </div>
            </div>

            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
                {cards.map((card)=>{
                    return(
                        <div key={card.id} className="flex flex-col p-4 justify-start items-start gap-4 bg-card rounded-xl shadow-sm">
                            <div className="w-full">
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {/* icon */}
                                        <div className="p-2 rounded-xl bg-text-weak/10">
                                            <card.icon size={"24px"}/>
                                        </div>
                                        {/* title */}
                                        <p className="text-text-strong font-bold text-lg">{card.title}</p>
                                    </div>
                                    {/* value */}
                                    <p className="text-text-strong font-bold text-lg">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const StudentProfileSkeleton=()=>{
    return(
        <>
            Loading
        </>
    );
}
export default Profile;