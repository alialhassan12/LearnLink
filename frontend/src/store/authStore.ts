import {create} from "zustand";
import type { user } from "../@types/user";
import axiosInstance from "../lib/axios";

interface useAuthStoreInterface{
    authUser:user |null,
    login:({email,password}: {email:string,password:string})=>Promise<boolean>,
    isloggingIn:boolean,
    checkAuth:()=>Promise<boolean>,
    isCheckingAuth:boolean,
    logout:()=>Promise<boolean>,
}

const useAuthStore=create<useAuthStoreInterface>((set)=>({
    authUser:null,

    isloggingIn:false,
    login: async ({email,password}: {email:string,password:string})=>{
        set({isloggingIn:true});
        try {
            const response=await axiosInstance.post('/auth/login',{email,password});
            localStorage.setItem('token',response.data.token);
            set({authUser:response.data.user});
            return true;
        } catch (error:any) {
            console.log(error.response.data.message);
            return false;
        } finally{
            set({isloggingIn:false});
        }
    },

    isCheckingAuth:false,
    checkAuth:async()=>{
        if(!localStorage.getItem('token')){
            set({authUser:null});
            return false;
        }
        set({isCheckingAuth:true});
        try {
            const response=await axiosInstance.get('/auth/me');
            set({authUser:response.data.user});
            return true;
        } catch (error:any) {
            console.log(error.response.data.message);
            return false;
        } finally{
            set({isCheckingAuth:false});
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post('/auth/logout');
            localStorage.removeItem('token');
            set({authUser:null});
            return true;
        } catch (error:any) {
            console.log(error.response.data.message);
            return false;
        }
    }
}));

export default useAuthStore