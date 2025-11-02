import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './CareerMentor.css';

const CareerMentor = () => {
  const [queries, setQueries] = useState({
    company: '',
    position: '',
    role: '',
    status: '',
  });
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setQueries({ ...queries, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse('');
    setError('');

    const { company, position, role, status } = queries;
    if (!company || !position || !role || !status) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:3000/api/v1/ai-career-mentor/career-mentor',
        { params: queries }
      );
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to fetch mentor response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-mentor-container">
      <h1>AI Career Mentor</h1>
      <div className="career-mentor-form">
        <input
          type="text"
          placeholder="Company"
          name="company"
          value={queries.company}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Position"
          name="position"
          value={queries.position}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Role"
          name="role"
          value={queries.role}
          onChange={handleChange}
        />
        <select name="status" value={queries.status} onChange={handleChange}>
          <option value="" disabled>
            Select Status
          </option>
          <option value="all">All</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
          <option value="ghosted">Ghosted</option>
        </select>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Ask Career Mentor'}
        </button>

        {loading && (
          <div className="career-mentor-loading">
            Figuring out your roadmap...
          </div>
        )}
        {error && <div className="career-mentor-error">{error}</div>}
        {response && (
          <div className="career-mentor-response">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerMentor;
