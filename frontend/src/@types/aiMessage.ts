export interface AiMessage{
    id:number;
    ai_chat_id:number;
    role:string;
    content:string;
    type:string;
    tokens_used:number;
    created_at:string;
    updated_at:string;
}