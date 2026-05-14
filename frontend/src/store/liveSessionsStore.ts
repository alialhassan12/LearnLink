import {create} from 'zustand';
import type {LiveSession} from '../@types/liveSession';
import axiosInstance from '../lib/axios';


export interface LiveSessionState{
    token:string;
    url:string;
    roomName:string;
    isGettingToken:boolean;
    getToken:(roomName:string)=>Promise<void>;

    teacherLiveSessions:LiveSession[];
    isGettingTeacherLiveSessions:boolean;
    getTeacherLiveSessions:()=>Promise<void>;

    studentLiveSessions:LiveSession[];
    isGettingStudentLiveSessions:boolean;
    getStudentLiveSessions:()=>Promise<void>;

    teacherSelectedSession:LiveSession | null;
    isGettingTeacherSelectedSession:boolean;
    getTeacherSelectedSession:(id:number)=>Promise<void>;
}

export const useLiveSessionStore=create<LiveSessionState>((set)=>({
    teacherLiveSessions:[],

    isGettingTeacherLiveSessions:false,
    getTeacherLiveSessions:async()=>{
        set({isGettingTeacherLiveSessions:true});
        try {
            const response=await axiosInstance.get('/live-sessions/teacher-sessions');
            set({teacherLiveSessions:response.data.live_sessions});
            console.log("live sessions fetched",response.data.live_sessions);
        } catch (error:any) {
            console.error('Error fetching live sessions:', error?.response?.data?.message || error?.message || 'Unknown error');
        } finally{
            set({isGettingTeacherLiveSessions:false});
        }
    },

    token:"",
    url:"",
    roomName:"",
    isGettingToken:false,
    getToken:async(roomName:string)=>{
        set({isGettingToken:true});
        try {
            const response=await axiosInstance.post('/livekit/token',{room_name:roomName});
            set({token:response.data.token,url:response.data.url});
            
        } catch (error:any) {
            console.error('Error fetching token:', error?.response?.data?.message || error?.message || 'Unknown error');
        } finally{
            set({isGettingToken:false});
        }
    },

    studentLiveSessions:[],
    isGettingStudentLiveSessions:false,
    getStudentLiveSessions:async()=>{
        set({isGettingStudentLiveSessions:true});
        try {
            const response=await axiosInstance.get('/live-sessions/student-sessions');
            set({studentLiveSessions:response.data.live_sessions});
            console.log("student live sessions fetched",response.data.live_sessions);
        } catch (error:any) {
            console.error('Error fetching live sessions:', error?.response?.data?.message || error?.message || 'Unknown error');
        } finally{
            set({isGettingStudentLiveSessions:false});
        }
    },

    teacherSelectedSession:null,
    isGettingTeacherSelectedSession:false,
    getTeacherSelectedSession:async(id:number)=>{
        set({isGettingTeacherSelectedSession:true});
        try {
            const response =await axiosInstance.get(`/live-sessions/teacher-session/${id}`);
            set({teacherSelectedSession:response.data.session});
            console.log("teacher selected session fetched",response.data.session);
        } catch (error:any) {
            console.error('Error fetching teacher selected session:', error?.response?.data?.message || error?.message || 'Unknown error');
        } finally{
            set({isGettingTeacherSelectedSession:false});
        }
    }

}));