import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskModal from './TaskModal';
import type { Task } from '../types';
import './Calendar.css';

type ViewMode = 'month' | 'week';

const Calendar: React.FC = () => {
    const { tasks, addTask } = useTasks();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateToAddTask, setSelectedDateToAddTask] = useState<string>('');

    const nextPeriod = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (viewMode === 'month' ? 1 : 0), currentDate.getDate() + (viewMode === 'week' ? 7 : 0)));
    };

    const prevPeriod = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - (viewMode === 'month' ? 1 : 0), currentDate.getDate() - (viewMode === 'week' ? 7 : 0)));
    };

    const today = () => {
        setCurrentDate(new Date());
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDayClick = (dateStr: string) => {
        setSelectedDateToAddTask(dateStr);
        setIsModalOpen(true);
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'> | Task) => {
        if (!('id' in taskData)) {
            addTask(taskData);
        }
    };

    const daysData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const result = [];

        if (viewMode === 'month') {
            const daysInMonth = getDaysInMonth(year, month);
            const firstDay = getFirstDayOfMonth(year, month);

            // Previous month days to fill first row
            const prevMonthDays = getDaysInMonth(year, month - 1);
            for (let i = firstDay - 1; i >= 0; i--) {
                const d = prevMonthDays - i;
                const actualDate = new Date(year, month - 1, d);
                const strictDateStr = `${actualDate.getFullYear()}-${String(actualDate.getMonth() + 1).padStart(2, '0')}-${String(actualDate.getDate()).padStart(2, '0')}`;
                result.push({ p: true, day: d, dateStr: strictDateStr }); // p for padding
            }

            // Current month days
            for (let i = 1; i <= daysInMonth; i++) {
                const strictDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                result.push({ p: false, day: i, dateStr: strictDateStr });
            }

            // Next month padding
            const remainingCells = 42 - result.length; // 6 rows of 7
            for (let i = 1; i <= remainingCells; i++) {
                const actualDate = new Date(year, month + 1, i);
                const strictDateStr = `${actualDate.getFullYear()}-${String(actualDate.getMonth() + 1).padStart(2, '0')}-${String(actualDate.getDate()).padStart(2, '0')}`;
                result.push({ p: true, day: i, dateStr: strictDateStr });
            }
        } else {
            // Weekly view
            const currDay = currentDate.getDay();
            const firstDayOfWeek = new Date(currentDate);
            firstDayOfWeek.setDate(currentDate.getDate() - currDay);

            for (let i = 0; i < 7; i++) {
                const d = new Date(firstDayOfWeek);
                d.setDate(firstDayOfWeek.getDate() + i);
                const strictDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                result.push({ p: false, day: d.getDate(), dateStr: strictDateStr });
            }
        }

        return result;
    }, [currentDate, viewMode]);

    const tasksByDate = useMemo(() => {
        const map: Record<string, Task[]> = {};
        tasks.forEach(task => {
            if (!map[task.date]) map[task.date] = [];
            map[task.date].push(task);
        });
        return map;
    }, [tasks]);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button onClick={prevPeriod} className="btn-nav">{"<"}</button>
                    <button onClick={today} className="btn-nav btn-today">Today</button>
                    <button onClick={nextPeriod} className="btn-nav">{">"}</button>
                    <h3 className="calendar-title">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                </div>
                <div className="calendar-views">
                    <button
                        className={`btn-view ${viewMode === 'month' ? 'active' : ''}`}
                        onClick={() => setViewMode('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`btn-view ${viewMode === 'week' ? 'active' : ''}`}
                        onClick={() => setViewMode('week')}
                    >
                        Week
                    </button>
                </div>
            </div>

            <div className="calendar-grid">
                <div className={`calendar-days-body ${viewMode === 'week' ? 'week-view' : 'month-view'}`}>
                    {daysData.map((dObj, idx) => {
                        const dayTasks = tasksByDate[dObj.dateStr] || [];
                        const isToday = dObj.dateStr === todayStr;
                        const isFirstRow = idx < 7;

                        // Parse the actual date object for month formatting
                        const [y, m, d] = dObj.dateStr.split('-').map(Number);
                        const cellDateObj = new Date(y, m - 1, d);

                        // If it's the 1st of any month, show '1 Mar', '1 Apr'.
                        // Or if it's the very first cell of the calendar and NOT the 1st, just show the number (or month too? The image only shows month on the 1st).
                        const showMonth = dObj.day === 1;
                        const dateDisplay = showMonth ? `${dObj.day} ${monthNames[cellDateObj.getMonth()].substring(0, 3)}` : dObj.day;

                        return (
                            <div
                                key={idx}
                                className={`calendar-cell ${dObj.p ? 'padding-cell' : ''} ${isToday ? 'today-cell' : ''}`}
                                onClick={() => handleDayClick(dObj.dateStr)}
                            >
                                <div className="cell-header">
                                    {isFirstRow && <div className="day-name-inline">{weekDays[idx]}</div>}
                                    <div className="cell-date">
                                        <span className={isToday ? 'today-indicator' : ''}>{dateDisplay}</span>
                                    </div>
                                </div>
                                <div className="cell-tasks">
                                    {dayTasks.slice(0, 4).map(t => (
                                        <div key={t.id} className={`cal-task-item ${t.completed ? 'completed' : ''}`} title={t.title}>
                                            <span className={`cal-task-dot dot-${t.priority.toLowerCase()}`}></span>
                                            {t.time && <span className="cal-task-time">{t.time}</span>}
                                            <span className="cal-task-title">{t.title}</span>
                                        </div>
                                    ))}
                                    {dayTasks.length > 4 && (
                                        <div className="task-more">+{dayTasks.length - 4} more</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                selectedDate={selectedDateToAddTask}
            />
        </div>
    );
};

export default Calendar;
