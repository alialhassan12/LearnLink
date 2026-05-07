import type { Category } from "./category";

export interface Course{
    id:number;
    title:string,
    teacher_id:number,
    category_id:number,
    description:string,
    thumbnail:string,
    language:string,
    price:number,
    status:string,
    created_at:string,
    updated_at:string,

    //teacher courses
    category?:Category,
    
}