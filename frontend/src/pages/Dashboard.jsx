import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { getMonthName } from '../utils/batchGenerator';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error('Error fetching bookings', err);
        }
    };

    const handleAddNew = () => {
        navigate('/');
    };

    const grouped = bookings.reduce((acc, booking) => {
        const monthStr = booking.month;
        if (!acc[monthStr]) acc[monthStr] = [];
        acc[monthStr].push(booking);
        return acc;
    }, {});

    const sortedMonths = Object.keys(grouped).sort();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Scheduled Classes</h1>
                <button className="btn-add" onClick={handleAddNew}>Add New Slot</button>
            </header>

            <div className="bookings-list">
                {sortedMonths.map(monthKey => {
                    const [year, month] = monthKey.split('-');
                    return (
                        <div key={monthKey} className="month-section">
                            <div className="month-label">
                                {getMonthName(parseInt(month) - 1)} <br /> {year}
                            </div>
                            <div className="slots-row">
                                {grouped[monthKey].map((slot, index) => (
                                    <div key={index} className="slot-card-mini">
                                        <div className="slot-header-mini">Day {index + 1} <span>{slot.topic}</span></div>
                                        <div className="slot-body-mini">
                                            <div className="slot-date-mini">{new Date(slot.date).getDate()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {bookings.length === 0 && <p className="no-bookings">No classes scheduled yet.</p>}
            </div>
        </div>
    );
};

export default Dashboard;
