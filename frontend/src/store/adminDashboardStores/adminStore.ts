import {create} from "zustand";
import type { user } from "../../@types/user";
import axiosInstance from "../../lib/axios";
import { toast } from "sonner";

interface AdminStore{
    users:user[]
    userPaginationData:{
        current_page:number;
        last_page:number;
        per_page:number;
        total:number;
        from:number;
        to:number;
    } | null;
    isGettingAllUsers:boolean;
    getAllUsers:(page?:number)=>Promise<void>;
}

export const useAdminStore=create<AdminStore>((set)=>({
    users:[],
    userPaginationData:null,
    isGettingAllUsers:false,
    getAllUsers:async(page:number=1)=>{
        set({isGettingAllUsers:true});
        try {
            const response=await axiosInstance.get(`/admin/users?page=${page}`);
            set({users:response?.data?.users?.data,userPaginationData:response?.data?.pagination});
            console.log(response.data.users.data);
        } catch (error:any) {
            toast.error(error?.response?.data?.message || 'An error occurred');
        }finally{
            set({isGettingAllUsers:false});
        }
    }
}));