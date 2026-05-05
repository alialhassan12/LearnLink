import {create} from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "sonner";

interface publishCourseData{
    category_id:number,
    title:string,
    description:string,
    thumbnail:File,
    language:string,
    price:number,
    sections:{title:string,order:number,materials:{file:File,type:string,size:number,title:string}[]}[]
}

interface CreateCourseStoreState{
    courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:File,
        price:number
    },
    setCourseData:(courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:File,
        price:number
    })=>void,
    // image preview of thumbnail
    imagePreview:string,
    setImagePreview:(imagePreview:string)=>void,

    // course section
    courseSections:{title:string,order:number,files:{file:File,title:string,size:number,type:string}[]}[],
    setCourseSections:(courseSections:{title:string,order:number,files:{file:File,title:string,size:number,type:string}[]}[])=>void,
    addCourseSection:(title:string)=>void,
    addFileToSection:(sectionTitle:string,file:File,fileTitle:string,fileSize:number,fileType:string)=>void,

    // publish course
    isPublishing:boolean,
    setIsPublishing:(isPublishing:boolean)=>void,
    publishCourse:(data:publishCourseData)=>Promise<void>
}



const useCreateCourseStore=create<CreateCourseStoreState>((set)=>({
    courseData:{
        title:"",
        teacher_id:0,
        category_id:0,
        language:"",
        description:"",
        thumbnail:null,
        price:0
    },
    setCourseData:(courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:File,
        price:number
    })=>set((state)=>({...state,courseData})),

    // image preview of thumbnail
    imagePreview:"",
    setImagePreview:(imagePreview:string)=>set((state)=>({...state,imagePreview})),
    
    // course section
    courseSections:[],
    setCourseSections:(courseSections:{title:string,order:number,files:{file:File,title:string,size:number,type:string}[]}[])=>set((state)=>({...state,courseSections})),
    
    addCourseSection:(title:string)=>set((state)=>{
        const newOrder = state.courseSections.length;
        return {
            ...state,
            courseSections: [...state.courseSections, { title, order: newOrder, files: [] }]
        };
    }),

    addFileToSection:(sectionTitle:string,file:File,fileTitle:string,fileSize:number,fileType:string)=>set((state)=>({
        ...state,
        courseSections: state.courseSections.map(section => 
            section.title === sectionTitle 
                ? { ...section, files: [...section.files, {file,title:fileTitle,type:fileType,size:fileSize}]} 
                : section
        )
    })),

    // publis course
    isPublishing:false,
    setIsPublishing:(isPublishing:boolean)=>set((state)=>({...state,isPublishing})),

    publishCourse:async(data:publishCourseData)=>{
        set({isPublishing:true});
        try{
            const response=await axiosInstance.post('/courses/create-course',data);
            toast.success(response.data.message);
        }catch(error:any){
            toast.error(error.response.data.message);
        }finally{
            set({isPublishing:false});
        }
    }

}));

export default useCreateCourseStore;