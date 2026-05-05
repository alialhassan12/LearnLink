import {create} from "zustand";
import type { CoursePublish } from "../@types/coursePublish";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";
import type { Course } from "../@types/course";

interface CourseStore{
    newCourse:Course | null,
    setNewCourse:(newCourse:Course)=>void,
    isPublishing:boolean,
    setIsPublishing:(isPublishing:boolean)=>void,
    publishCourse:(data:CoursePublish)=>Promise<boolean>
}

export const useCourseStore = create<CourseStore>((set) => ({
    newCourse:null,
    setNewCourse:(newCourse:Course)=>set((state)=>({...state,newCourse})),
    isPublishing:false,
    setIsPublishing:(isPublishing:boolean)=>set((state)=>({...state,isPublishing})),

    publishCourse:async(data:CoursePublish)=>{
        set({isPublishing:true});
        try{
            const formData = new FormData();
            formData.append('category_id', String(data.category_id));
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (data.thumbnail) {
                formData.append('thumbnail', data.thumbnail);
            }
            formData.append('language', data.language);
            formData.append('price', String(data.price));

            data.sections.forEach((section, index) => {
                formData.append(`sections[${index}][title]`, section.title);
                formData.append(`sections[${index}][order]`, String(section.order));
                
                section.materials.forEach((material, mIndex) => {
                    formData.append(`sections[${index}][materials][${mIndex}][title]`, material.title);
                    formData.append(`sections[${index}][materials][${mIndex}][type]`, material.type);
                    formData.append(`sections[${index}][materials][${mIndex}][size]`, String(Math.round(material.size)));
                    if (material.file) {
                        formData.append(`sections[${index}][materials][${mIndex}][file]`, material.file);
                    }
                });
            });

            const response=await axiosInstance.post('/courses/create-course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            set({newCourse:response.data.course});
            toast.success(response.data.message);

            return true;
        }catch(error:any){
            toast.error(error.response?.data?.message || "An error occurred");
            return false;
        }finally{
            set({isPublishing:false});
        }
    }
}));
