import {create} from "zustand";
import type { Conversation } from "../@types/conversation";
import type { Message } from "../@types/message";
import axiosInstance from "../lib/axios";

interface ChatState{
    conversations:Conversation[];
    addConversation:(conversation:Conversation)=>void;
    activeConversation:Conversation | null;
    setActiveConversation:(conversation:Conversation | null)=>void;
    messages:Message[];

    isGettingConversations:boolean;
    getConversations:()=>Promise<void>;

    isGettingMessages:boolean;
    getMessages:(conversation_id:number)=>Promise<void>;

    isSendingMessage:boolean;
    sendMessage:(receiver_id:number,type:string,content?:string,file?:File,file_name?:string)=>Promise<void>;
}

export const useChatStore=create<ChatState>((set)=>({
    conversations:[],
    addConversation:(conversation:Conversation)=>set((state)=>({
        conversations:[conversation,...state.conversations],
    })),
    activeConversation:null,
    setActiveConversation:(conversation:Conversation|null)=>set({activeConversation:conversation}),
    messages:[],

    isGettingConversations:false,
    getConversations:async()=>{
        set({isGettingConversations:true});
        try {
            const response=await axiosInstance.get('/messages/conversations');
            set({conversations:response.data.conversations});
            console.log('conversations:',response.data.conversations);
        } catch (error:any) {
            console.log('error getting conversations:',error?.response?.data);
        }finally{
            set({isGettingConversations:false});
        }
    },

    isGettingMessages:false,
    getMessages:async(conversation_id:number)=>{
        set({isGettingMessages:true});
        try {
            const response=await axiosInstance.post('/messages/conversation',{'conversation_id':conversation_id});
            set({messages:response.data.messages});
        } catch (error:any) {
            console.log('error getting messages:',error?.response?.data);
        }finally{
            set({isGettingMessages:false});
        }
    },

    isSendingMessage:false,
    sendMessage:async(receiver_id:number,type:string,content?:string,file?:File,file_name?:string)=>{
        set({isSendingMessage:true});
        try {
            const formData=new FormData();
            formData.append('receiver_id',receiver_id.toString());
            formData.append('type',type);
            if(content){
                formData.append('content',content);
            }
            if(file){
                formData.append('file',file);
            }
            if(file_name){
                formData.append('file_name',file_name);
            }
            const response=await axiosInstance.post('/messages/send',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // set((state)=>({messages:[...state.messages,response.data.message]}));
            // console.log('message sent:',response.data.message);
        } catch (error:any) {
            console.log('error sending message:',error?.response?.data);
        }finally{
            set({isSendingMessage:false});
        }
    }
}));