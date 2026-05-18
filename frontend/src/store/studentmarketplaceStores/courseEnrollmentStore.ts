import {create} from "zustand";
import axiosInstance from "../../lib/axios";
import { toast } from "sonner";

interface CourseEnrollmentState{
    enrolledCoursesIds:number[];
    getEnrolledCoursesIds:()=>Promise<void>;

    isEnrolling:boolean;
    enroll:(courseId:number)=>Promise<void>;
}

export const useCourseEnrollmentStore=create<CourseEnrollmentState>((set)=>({
    enrolledCoursesIds:[],
    getEnrolledCoursesIds:async()=>{
        try {
            const response=await axiosInstance.get('/courses/enrolled-courses-ids');
            set({enrolledCoursesIds:response.data.enrolled_courses_ids});
        } catch (error:any) {
            console.log("Error getting enrolled courses ids:",error);
            toast.error(error.response?.data?.message || "Failed to get enrolled courses ids");
        }
    },
    
    isEnrolling:false,
    enroll:async(courseId:number)=>{
        set({isEnrolling:true});
        try{
            const response=await axiosInstance.post('/courses/enroll',{"course_id":courseId});
            set((prev)=>({enrolledCoursesIds:[...prev.enrolledCoursesIds, courseId]}))
            toast.success(response.data.message);
        }catch(error:any){
            console.log("Error enrolling course:",error);
            toast.error(error.response?.data?.message || "Failed to enroll");
        }finally{
            set({isEnrolling:false});
        }
    }
}));