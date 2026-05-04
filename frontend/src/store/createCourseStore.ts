import {create} from "zustand";

interface CreateCourseStoreState{
    courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:string,
        price:number
    },
    setCourseData:(courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:string,
        price:number
    })=>void,
    
    // course section
    courseSections:{title:string,order:number,files:File[]}[],
    setCourseSections:(courseSections:{title:string,order:number,files:File[]}[])=>void,
    addCourseSection:(title:string)=>void,
    addFileToSection:(sectionTitle:string,file:File)=>void,
    removeFileFromSection:(sectionTitle:string,fileName:string)=>void,
}

const useCreateCourseStore=create<CreateCourseStoreState>((set)=>({
    courseData:{
        title:"",
        teacher_id:0,
        category_id:0,
        language:"",
        description:"",
        thumbnail:"",
        price:0
    },
    setCourseData:(courseData:{
        title:string,
        teacher_id:number,
        category_id:number,
        language:string,
        description:string,
        thumbnail:string,
        price:number
    })=>set((state)=>({...state,courseData})),
    
    // course section
    courseSections:[],
    setCourseSections:(courseSections:{title:string,order:number,files:File[]}[])=>set((state)=>({...state,courseSections})),
    addCourseSection:(title:string)=>set((state)=>{
        const newOrder = state.courseSections.length;
        return {
            ...state,
            courseSections: [...state.courseSections, { title, order: newOrder, files: [] }]
        };
    }),
    addFileToSection:(sectionTitle:string,file:File)=>set((state)=>({
        ...state,
        courseSections: state.courseSections.map(section => 
            section.title === sectionTitle 
                ? { ...section, files: [...section.files, file] } 
                : section
        )
    })),
    removeFileFromSection:(sectionTitle:string,fileName:string)=>set((state)=>({
        ...state,
        courseSections: state.courseSections.map(section => 
            section.title === sectionTitle 
                ? { ...section, files: section.files.filter(f => f.name !== fileName) } 
                : section
        )
    })),
}));

export default useCreateCourseStore;