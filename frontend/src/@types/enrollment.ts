import type { Student } from "./student";

export interface Enrollment{
    id:number;
    course_id:number;
    student_id:number;
    progress:number;
    student?:Student;
    created_at:string;
    updated_at:string;
}