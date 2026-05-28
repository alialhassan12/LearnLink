import {create} from "zustand";
import type { Plan } from "../../@types/plan";
import axiosInstance from "../../lib/axios";
import { toast } from "sonner";

interface PlansStore{
    plans:Plan[];
    newPlan:Plan | null;
    
    isCreatingPLan:boolean;
    createPlan:(plan:Plan)=>Promise<boolean>;
}

export const usePlanStore=create<PlansStore>((set)=>({
    plans:[],
    newPlan:null,

    isCreatingPLan:false,
    createPlan:async(plan:Plan)=>{
        set({isCreatingPLan:true});
        try {
            const response= await axiosInstance.post('/plans/create-plan',plan);
            set((state)=>({plans:[...state.plans,response.data.plan]}));
            console.log(response.data.plan);
            toast.success(response.data.message || 'Plan created successfully');
            return true;
        } catch (error:any) {
            console.log(error?.response?.data?.message);
            toast.error(error?.response?.data?.message);
            return false;
        }finally{
            set({isCreatingPLan:false});
        }
    }
}));