import type { Booking } from "./booking";
import type { Course } from "./course";

export interface Student{
    id:number;
    user_id:number;
    bio:string;
    user?:{
        id:number;
        name:string;
        email:string;
        avatar:string;
    };
    bookings?:Booking[];
    enrolled_courses?:Course[];
}