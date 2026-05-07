export interface Teacher {
    name: string;
    email: string;
    avatar: string;
    bio: string;
    headline: string;
    location: string;
    hourly_rate: number;
    subjects: string[];
    languages: string[];
    created_at: string;
    updated_at: string;
    availabilities: {
        day_of_week: string;
        start_time: string;
        end_time: string;
    }[];
    courses_count: number;
}