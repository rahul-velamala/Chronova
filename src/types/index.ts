export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD format
    time: string; // HH:mm format
    priority: Priority;
    completed: boolean;
    createdAt: number;
}
