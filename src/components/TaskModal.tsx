import React, { useState, useEffect } from 'react';
import type { Task, Priority } from '../types';
import './TaskModal.css';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt'> | Task) => void;
    initialTask?: Task | null;
    selectedDate?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialTask, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState<Priority>('Medium');

    useEffect(() => {
        if (initialTask) {
            setTitle(initialTask.title);
            setDescription(initialTask.description);
            setDate(initialTask.date);
            setTime(initialTask.time);
            setPriority(initialTask.priority);
        } else {
            setTitle('');
            setDescription('');
            setDate(selectedDate || new Date().toISOString().split('T')[0]);
            setTime(new Date().toTimeString().slice(0, 5));
            setPriority('Medium');
        }
    }, [initialTask, isOpen, selectedDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date) return;

        if (initialTask) {
            onSave({
                ...initialTask,
                title,
                description,
                date,
                time,
                priority
            });
        } else {
            onSave({
                title,
                description,
                date,
                time,
                priority,
                completed: false
            } as Omit<Task, 'id' | 'createdAt'>);
        }
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h2>{initialTask ? 'Edit Task' : 'New Task'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description (Optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label htmlFor="date">Date *</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label htmlFor="time">Time</label>
                            <input
                                type="time"
                                id="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Priority</label>
                        <div className="priority-selector">
                            {(['High', 'Medium', 'Low'] as Priority[]).map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`btn-priority priority-${p.toLowerCase()} ${priority === p ? 'active' : ''}`}
                                    onClick={() => setPriority(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save">
                            {initialTask ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
