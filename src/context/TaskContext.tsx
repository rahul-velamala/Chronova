import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Task } from '../types';

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, updatedFields: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'productivity_tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (e) {
            console.error("Failed to load tasks from local storage", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTask = (id: string, updatedFields: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updatedFields } : task
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    const toggleTaskCompletion = (id: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTaskCompletion }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
