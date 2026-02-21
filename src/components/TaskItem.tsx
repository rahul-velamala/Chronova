import React from 'react';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import './TaskItem.css';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
    const { toggleTaskCompletion, deleteTask } = useTasks();

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        toggleTaskCompletion(task.id);
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority.toLowerCase()}`}>
            <div className="task-checkbox">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                    id={`task-${task.id}`}
                />
                <label htmlFor={`task-${task.id}`}></label>
            </div>

            <div className="task-content">
                <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`task-badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                    </span>
                </div>

                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                    <span className="task-time">
                        🗓 {task.date} ⏱ {task.time}
                    </span>
                </div>
            </div>

            <div className="task-actions">
                <button className="btn-icon btn-edit" onClick={() => onEdit(task)} title="Edit Task">
                    ✎
                </button>
                <button className="btn-icon btn-delete" onClick={() => deleteTask(task.id)} title="Delete Task">
                    ✕
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
