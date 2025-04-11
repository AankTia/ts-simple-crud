export interface User {
    id?: number;
    name: string;
    email: string;
    created_at?: string;
}

export interface UserInput {
    name: string;
    email: string;
}