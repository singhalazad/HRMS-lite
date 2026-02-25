import { useState, useEffect } from 'react';
import { getEmployees, getAttendance, markAttendance, updateAttendance } from '../services/api';
import './Attendance.css';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all employees and attendance for the selected date
      const [empRes, attRes] = await Promise.all([
        getEmployees(),
        getAttendance({ date })
      ]);
      
      setEmployees(empRes.data);
      setAttendanceRecords(attRes.data);
    } catch (err) {
      setError('Failed to fetch attendance data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getEmployeeStatus = (employeeId) => {
    const record = attendanceRecords.find(r => r.employee === employeeId);
    return record ? record.status : null;
  };

  const handleMarkAttendance = async (employeeId, status) => {
    setProcessingId(employeeId);
    try {
      const existingRecord = attendanceRecords.find(r => r.employee === employeeId);
      
      if (existingRecord) {
        await updateAttendance(existingRecord.id, {
          employee: employeeId,
          date: selectedDate,
          status: status
        });
      } else {
        await markAttendance({
          employee: employeeId,
          date: selectedDate,
          status: status
        });
      }
      // Refresh data to show updated status
      await fetchData(selectedDate);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.non_field_errors) {
        alert(err.response.data.non_field_errors[0]); // Usually "The fields employee, date must make a unique set."
      } else {
        alert('Failed to mark attendance.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && employees.length === 0) return <div className="loading-state">Loading attendance data...</div>;

  return (
    <div className="attendance-container">
      <div className="page-header attendance-header">
        <h1 className="page-title">Daily Attendance</h1>
        <div className="date-picker-container">
          <label htmlFor="auth-date">Select Date:</label>
          <input 
            type="date" 
            id="auth-date"
            value={selectedDate} 
            onChange={handleDateChange}
            className="date-input"
            max={new Date().toISOString().split('T')[0]} // Can't mark future attendance
          />
        </div>
      </div>

      {error && <div className="alert-danger">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state text-center py-8">
                  No employees found. Please add employees first.
                </td>
              </tr>
            ) : (
              employees.map(emp => {
                const currentStatus = getEmployeeStatus(emp.id);
                const isProcessing = processingId === emp.id;

                return (
                  <tr key={emp.id}>
                    <td className="font-medium text-muted">{emp.employee_id}</td>
                    <td className="font-medium">{emp.full_name}</td>
                    <td><span className="badge">{emp.department}</span></td>
                    <td>
                      {currentStatus ? (
                        <span className={`badge ${currentStatus === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                          {currentStatus}
                        </span>
                      ) : (
                        <span className="badge text-muted bg-gray-100">Not Marked</span>
                      )}
                    </td>
                    <td className="text-right action-cell-wide">
                      <div className="action-buttons">
                        <button 
                          className={`btn ${currentStatus === 'Present' ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                          onClick={() => handleMarkAttendance(emp.id, 'Present')}
                          disabled={isProcessing || currentStatus === 'Present'}
                        >
                          {isProcessing ? '...' : 'Present'}
                        </button>
                        <button 
                          className={`btn ${currentStatus === 'Absent' ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-danger-outline'}`}
                          onClick={() => handleMarkAttendance(emp.id, 'Absent')}
                          disabled={isProcessing || currentStatus === 'Absent'}
                        >
                          {isProcessing ? '...' : 'Absent'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
