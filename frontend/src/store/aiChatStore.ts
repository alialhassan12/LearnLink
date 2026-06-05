import {create} from "zustand";
import type { AiChat } from "../@types/aiChat";
import axiosInstance from "../lib/axios";

interface AiChatStore{
    aiChats:AiChat[];

    isGettingAiChats:boolean;
    getAiChats:()=>Promise<void>;
}

export const useAiChatStore=create<AiChatStore>((set)=>({
    aiChats:[],

    isGettingAiChats:false,
    getAiChats:async()=>{
        set({isGettingAiChats:true});
        try {
            const response=await axiosInstance.get("/ai/chats");
            set({aiChats:response.data.chats});
        } catch (error:any) {
            console.log(error?.response?.data?.message || 'Failed to retrieve AI chats');
        }finally{
            set({isGettingAiChats:false});
        }
    }
}))