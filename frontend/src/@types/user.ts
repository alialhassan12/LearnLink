export interface user{ 
    id:number, 
    name:string, 
    email:string, 
    role:string, 
    avatar:string |null
    created_at?:string;
    updated_at?:string;
}