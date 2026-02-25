import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import { Plus, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await createEmployee(formData);
      setIsModalOpen(false);
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      fetchEmployees(); // Refresh list
      toast.success('Employee added successfully!');
    } catch (err) {
      if (err.response && err.response.data) {
        // Simple error parsing for DRF
        const errorMessages = Object.values(err.response.data).flat().join(' ');
        setFormError(errorMessages || 'Failed to add employee. Please check the fields.');
      } else {
        setFormError('Failed to add employee due to a server error.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async (id, toastId) => {
    toast.dismiss(toastId);
    try {
      await deleteEmployee(id);
      fetchEmployees();
      toast.success('Employee deleted successfully.');
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error('Failed to delete employee.');
    }
  };

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div>
          <p style={{ margin: '0 0 10px 0', fontWeight: 500 }}>
            Are you sure you want to delete this employee?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-danger"
              style={{ padding: '4px 8px', flex: 1, fontSize: '14px' }}
              onClick={() => executeDelete(id, t.id)}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary"
              style={{ padding: '4px 8px', flex: 1, fontSize: '14px' }}
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, id: `delete-${id}` }
    );
  };

  if (loading) return <div className="loading-state">Loading employees...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Employees</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          No employees found. Click "Add Employee" to get started.
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Contact</th>
                <th>Department</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td className="font-medium text-muted">{emp.employee_id}</td>
                  <td className="font-medium">{emp.full_name}</td>
                  <td>
                    <div className="contact-info">
                      <Mail size={14} className="text-muted" />
                      {emp.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge">{emp.department}</span>
                  </td>
                  <td className="text-right action-cell">
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => handleDelete(emp.id)}
                      title="Delete Employee"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            {formError && <div className="alert-danger">{formError}</div>}
            
            <form onSubmit={handleAddSubmit} className="form-group-container">
              <div className="form-group">
                <label htmlFor="employee_id">Employee ID *</label>
                <input
                  type="text"
                  id="employee_id"
                  name="employee_id"
                  required
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  placeholder="e.g. EMP001"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Example"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@company.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Engineering"
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
