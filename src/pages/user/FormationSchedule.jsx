import React, { useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
  isBefore, startOfDay 
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarCheck, CheckCircle, ArrowLeft, Upload, FileImage, XCircle } from 'lucide-react';
import { AppContext, FORMATIONS } from '../../App';

const Calendar = ({ value, onChange, activities }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button type="button" className="calendar-nav-btn" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft size={20} />
        </button>
        <h3>{format(currentMonth, 'MMMM yyyy')}</h3>
        <button type="button" className="calendar-nav-btn" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EE";
    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="calendar-day-header" key={i}>
                {format(addDays(startDate, i), dateFormat).charAt(0)}
            </div>
        );
    }
    return days;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            const cloneDay = day;
            
            const isSelected = value && isSameDay(day, value);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const dateActivities = activities ? activities.filter(a => isSameDay(new Date(a.date), day)) : [];
            const isFull = dateActivities.length >= 5;
            const isPast = isBefore(day, startOfDay(new Date()));
            const isToday = isSameDay(day, new Date());
            
            days.push(
                <div
                    className={`calendar-cell ${!isCurrentMonth ? "empty" : ""} ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${isFull ? "full" : ""}`}
                    key={day.toString()}
                    onClick={() => {
                        if (isCurrentMonth && !isPast && !isFull) {
                            onChange(cloneDay);
                        }
                    }}
                    style={{ 
                        opacity: !isCurrentMonth ? 0 : 1, 
                        pointerEvents: (!isCurrentMonth || isPast || isFull) ? 'none' : 'auto',
                        color: isPast && isCurrentMonth ? 'var(--pk-text-muted)' : '',
                        textDecoration: isPast && isCurrentMonth ? 'line-through' : 'none'
                    }}
                >
                    <span className="bg">{formattedDate}</span>
                    {isFull && isCurrentMonth && <span className="no-slot-text">no slot available</span>}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <React.Fragment key={day.toString()}>
                {days}
            </React.Fragment>
        );
        days = [];
    }
    return rows;
  };

  return (
    <div className="calendar-wrapper">
      {renderHeader()}
      <div className="calendar-grid">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default function FormationSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addActivity, activities, isEligible } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [approvalImage, setApprovalImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) { // Limit to ~2.5MB due to localStorage bounds
        alert("File is too large. Please select an image under 2.5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setApprovalImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const formation = FORMATIONS.find(f => f.id === id);

  React.useEffect(() => {
    if (formation && !isEligible(formation.id)) {
      alert("You are not cleared to schedule this formation. Please complete earlier formations in the journey first.");
      navigate('/home');
    }
  }, [formation, isEligible, navigate]);

  if (!formation) {
    return <div>Formation not found. <Link to="/home">Go back</Link></div>;
  }

  const handleSchedule = () => {
    if (!selectedDate) {
        alert("Please select a date from the calendar.");
        return;
    }
    if (!approvalImage) {
        alert("Please upload your approval letter to proceed.");
        return;
    }

    // RULE: Only 5 total schedules per date allowed system-wide
    const schedulesOnDate = activities.filter(a => isSameDay(new Date(a.date), selectedDate));
    if (schedulesOnDate.length >= 5) {
      alert("This date is fully booked. Please choose another date.");
      return;
    }

    addActivity({
      id: Date.now().toString(),
      formationId: formation.id,
      formationTitle: formation.title,
      icon: formation.id,
      date: selectedDate.toISOString(),
      status: 'pending',
      userName: currentUser.name,
      schoolName: currentUser.school,
      username: currentUser.username,
      approvalLetter: approvalImage
    });
    navigate('/user/activities');
  };

  return (
    <div>
      <Link to="/formation" className="btn-primary" style={{ background: 'transparent', color: 'var(--pk-text-muted)', width: 'auto', padding: '0', marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={18} /> Back to Formations
      </Link>
      
      <div className="schedule-container">
        <div className="schedule-details">
          <div className="formation-header-text" style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--pk-blue-800)' }}>{formation.title}</h2>
          </div>
          
          <div className="selected-date-display" style={{ marginBottom: '1rem' }}>
            <CalendarCheck size={32} className="text-blue-600" />
            <div>
              <span>Selected Date</span>
              <strong>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : "No date selected"}</strong>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <FileImage size={24} color="var(--pk-blue-600)" />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: 'var(--pk-blue-800)', fontSize: '1rem' }}>Approval Letter Requirement</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--pk-text-muted)' }}>Upload an image of your approval letter to proceed.</p>
              </div>
            </div>
            
            {!approvalImage ? (
                <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'white', border: '1px solid var(--pk-border)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', color: 'var(--pk-text-main)' }}>
                    <Upload size={18} />
                    <span style={{ fontWeight: 500 }}>Select Image (Max 2MB)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
            ) : (
                <div style={{ position: 'relative', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--pk-border)' }}>
                    <img src={approvalImage} alt="Approval Letter Preview" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '180px', objectFit: 'cover' }} />
                    <button 
                        onClick={() => setApprovalImage(null)}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', padding: '0.25rem', cursor: 'pointer', display: 'flex', color: '#ef4444', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        title="Remove image"
                    >
                        <XCircle size={20} />
                    </button>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle size={12} color="#10b981" /> Letter Attached
                    </div>
                </div>
            )}
          </div>
          
          <button 
            className="btn-primary" 
            style={{ padding: '1rem', width: '100%', fontSize: '1.1rem' }}
            disabled={!selectedDate || !approvalImage}
            onClick={handleSchedule}
          >
            Confirm & Save Schedule <CheckCircle size={20} />
          </button>
        </div>
        
        <div className="schedule-calendar">
          <Calendar value={selectedDate} onChange={setSelectedDate} activities={activities} />
        </div>
      </div>
    </div>
  );
}
