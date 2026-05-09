import {create } from 'zustand';
import type {Teacher} from '../../@types/teacher';
import axiosInstance from '../../lib/axios';
import { toast } from 'sonner';

interface BrowseStoreState{
    teachers:Teacher[];
    teacher:Teacher | null;
    subjects:string[];
    languages:string[];
    getSubjects:()=>Promise<void>;
    getLanguages:()=>Promise<void>;
    isGettingFilters:boolean;
    setIsGettingFilters:(value:boolean)=>void;
    isGettingTeachers:boolean;
    getTeachers:()=>Promise<void>;
    isGettingTeacherById:boolean;
    getTeacherById:(id:number)=>Promise<void>;
}

const useBrowseStore=create<BrowseStoreState>((set)=>({
    teachers:[],
    subjects:[],
    languages:[],
    isGettingFilters:false,
    setIsGettingFilters:(value:boolean)=>set({isGettingFilters:value}),
    
    getSubjects:async()=>{
        try {
            const response = await axiosInstance.get('/teachers/subjects');
            set({subjects:response.data.subjects});
        } catch (error:any) {
            toast.error(error.response?.data?.message);
        }
    },

    getLanguages:async()=>{
        try {
            const response = await axiosInstance.get('/teachers/languages');
            set({languages:response.data.languages});
        } catch (error:any) {
            toast.error(error.response?.data?.message);
        }
    },

    isGettingTeachers:false,
    getTeachers:async()=>{
        set({isGettingTeachers:true});
        try {
            const response = await axiosInstance.get('/teachers');
            set({teachers:response.data.teachers});
        } catch (error:any) {
            toast.error(error.response?.data?.message);
        } finally {
            set({isGettingTeachers:false});
        }
    },

    teacher:null,
    isGettingTeacherById:false,
    getTeacherById:async (id:number)=>{
        set({isGettingTeacherById:true});
        try {
            const response = await axiosInstance.get(`/teacher/${id}`);
            set({teacher:response.data.teacher});
        } catch (error:any) {
            toast.error(error.response?.data?.message);
        } finally {
            set({isGettingTeacherById:false});
        }
    }

}));

export default useBrowseStore;