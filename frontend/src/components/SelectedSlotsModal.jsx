import React, { useState } from 'react';
import './SelectedSlotsModal.css';

const SelectedSlotsModal = ({ slots, onClose, onSubmit }) => {
    const [localSlots, setLocalSlots] = useState([...slots]);

    const handleDelete = (index) => {
        setLocalSlots(localSlots.filter((_, i) => i !== index));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Selected Slots</h2>
                <div className="slots-grid">
                    {localSlots.map((slot, index) => (
                        <div key={index} className="slot-card">
                            <div className="slot-header">{slot.batchId}st Schedule</div>
                            <div className="slot-body">
                                <div className="slot-date">{new Date(slot.date).getDate()}</div>
                                <div className="slot-info">
                                    <span>Day {index + 1}</span>
                                    <span>{slot.topic}</span>
                                </div>
                            </div>
                            <button className="btn-delete" onClick={() => handleDelete(index)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-ok" onClick={() => onSubmit(localSlots)}>Ok</button>
                </div>
            </div>
        </div>
    );
};

export default SelectedSlotsModal;
