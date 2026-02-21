import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';
import type { Task, Priority } from '../types';
import './TaskList.css';

type SortOption = 'date-asc' | 'date-desc' | 'priority-high-first' | 'priority-low-first';
type FilterStatus = 'all' | 'pending' | 'completed';
type FilterPriority = 'all' | Priority;

const TaskList: React.FC = () => {
    const { tasks, addTask, updateTask } = useTasks();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [sortOption, setSortOption] = useState<SortOption>('date-asc');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');

    const handleOpenNewTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
        if ('id' in taskData) {
            updateTask(taskData.id, taskData);
        } else {
            addTask(taskData);
        }
    };

    const filteredAndSortedTasks = useMemo(() => {
        let result = [...tasks];

        // Apply Status Filter
        if (filterStatus === 'pending') result = result.filter(t => !t.completed);
        if (filterStatus === 'completed') result = result.filter(t => t.completed);

        // Apply Priority Filter
        if (filterPriority !== 'all') {
            result = result.filter(t => t.priority === filterPriority);
        }

        // Apply Sort
        result.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
            const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();

            switch (sortOption) {
                case 'date-asc':
                    return dateA - dateB;
                case 'date-desc':
                    return dateB - dateA;
                case 'priority-high-first': {
                    const priorityValues = { High: 3, Medium: 2, Low: 1 };
                    if (priorityValues[a.priority] !== priorityValues[b.priority]) {
                        return priorityValues[b.priority] - priorityValues[a.priority];
                    }
                    return dateA - dateB; // tie-breaker
                }
                case 'priority-low-first': {
                    const priorityValues = { High: 3, Medium: 2, Low: 1 };
                    if (priorityValues[a.priority] !== priorityValues[b.priority]) {
                        return priorityValues[a.priority] - priorityValues[b.priority];
                    }
                    return dateA - dateB; // tie-breaker
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [tasks, filterStatus, filterPriority, sortOption]);

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <div className="task-list-actions">
                    <button className="btn-primary" onClick={handleOpenNewTask}>
                        + Add Task
                    </button>
                </div>

                <div className="task-list-controls">
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as SortOption)}
                        className="control-select"
                    >
                        <option value="date-asc">Date (Ascending)</option>
                        <option value="date-desc">Date (Descending)</option>
                        <option value="priority-high-first">Priority (High 👉 Low)</option>
                        <option value="priority-low-first">Priority (Low 👉 High)</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                        className="control-select"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                        className="control-select"
                    >
                        <option value="all">All Priorities</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                </div>
            </div>

            <div className="task-list-body">
                {filteredAndSortedTasks.length === 0 ? (
                    <div className="empty-state">
                        <p>No tasks found. Get started by adding a new one!</p>
                    </div>
                ) : (
                    filteredAndSortedTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onEdit={handleEditTask}
                        />
                    ))
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                initialTask={editingTask}
            />
        </div>
    );
};

export default TaskList;
