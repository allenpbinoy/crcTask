import React, { useState, useEffect } from 'react';
import { generateBatches, formatDate, getMonthName } from '../utils/batchGenerator';
import api from '../utils/api';
import SelectedSlotsModal from '../components/SelectedSlotsModal';
import { useNavigate } from 'react-router-dom';
import './CalendarView.css';

const CalendarView = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [batches, setBatches] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setBatches(generateBatches(selectedYear, selectedMonth));
        fetchExistingBookings();
    }, [selectedMonth, selectedYear]);

    const fetchExistingBookings = async () => {
        try {
            const res = await api.get('/bookings');
            if (res.data.length > 0) {
                setSelectedSlots(res.data);
            }
        } catch (err) {
            console.error('Error fetching bookings', err);
        }
    };

    const isSelected = (date) => {
        return selectedSlots.some(slot => formatDate(new Date(slot.date)) === formatDate(date));
    };

    const getBatchId = (date) => {
        const batch = batches.find(b => b.days.some(d => formatDate(d) === formatDate(date)));
        return batch ? batch.id : null;
    };

    const handleSlotClick = (date) => {
        const batchId = getBatchId(date);
        if (!batchId) return;

        const dateStr = formatDate(date);
        if (isSelected(date)) {
            setSelectedSlots(selectedSlots.filter(s => formatDate(new Date(s.date)) !== dateStr));
        } else {
            const batch = batches.find(b => b.id === batchId);
            const dayIdx = batch.days.findIndex(d => formatDate(d) === dateStr);
            const newSlot = {
                date: date,
                batchId: batchId,
                topic: `Topic ${dayIdx + 1}`,
                month: `${selectedYear}-${selectedMonth + 1}`
            };
            setSelectedSlots([...selectedSlots, newSlot]);
        }
    };

    const handleApply = async () => {
        if (selectedSlots.length === 0) return;
        setIsModalOpen(true);
    };

    const handleFinalSubmit = async (updatedSlots) => {
        try {
            await api.post('/bookings/sync', { bookings: updatedSlots });
            navigate('/dashboard');
        } catch (err) {
            console.error('Error syncing bookings', err);
        }
    };

    const renderCalendar = () => {
        const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`pad-${i}`} className="calendar-day empty"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(selectedYear, selectedMonth, d);
            const batchId = getBatchId(date);
            const selected = isSelected(date);
            const isSunday = date.getDay() === 0;

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${batchId ? 'selectable' : ''} ${selected ? 'selected' : ''} ${isSunday ? 'sunday' : ''}`}
                    onClick={() => !isSunday && handleSlotClick(date)}
                >
                    <span className="day-number">{d}</span>
                    {batchId && !isSunday && (
                        <div className="batch-indicator">
                            Day {batches.find(b => b.id === batchId).days.findIndex(day => formatDate(day) === formatDate(date)) + 1}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar-container">
            <header className="calendar-header">
                <h1>Select your slots</h1>
                <div className="month-selector">
                    <button onClick={() => setSelectedMonth(prev => (prev === 0 ? 11 : prev - 1))}>&lt;</button>
                    <span>{getMonthName(selectedMonth)} {selectedYear}</span>
                    <button onClick={() => setSelectedMonth(prev => (prev === 11 ? 0 : prev + 1))}>&gt;</button>
                </div>
            </header>

            <div className="calendar-legend">
                <div className="legend-item"><div className="box selected"></div> Selected Slots</div>
                <div className="legend-item"><div className="box selectable"></div> Selectable Slots</div>
                <div className="legend-item"><div className="box non-selectable"></div> Non-Selectable Dates</div>
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="weekday-header">{d}</div>
                ))}
                {renderCalendar()}
            </div>

            <div className="calendar-footer">
                <button className="btn-submit" onClick={handleApply}>Submit</button>
            </div>

            {isModalOpen && (
                <SelectedSlotsModal
                    slots={selectedSlots}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFinalSubmit}
                />
            )}
        </div>
    );
};

export default CalendarView;
