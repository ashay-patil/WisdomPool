import "./GetAllExperiences.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetAllExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchExperiences = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/public/get-all-experiences",

        );
        setExperiences(data.experiences || []);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) return <div className="loading">Loading all experiences...</div>;
  if (error) return <div className="error">Failed to load experiences.</div>;

  return (
    <div className="all-exp-container">
      <h1>All Interview Experiences</h1>

      {experiences.length === 0 ? (
        <p>No experiences found yet.</p>
      ) : (
        <div className="experience-list">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="experience-card"
              onClick={() => navigate(`/experience/${exp._id}`)}
            >
              <h3>{exp.company}</h3>
              <p><strong>Position:</strong> {exp.position}</p>
              <p><strong>Status:</strong> <span className={`status ${exp.status}`}>{exp.status}</span></p>
              <p><strong>Date:</strong> {new Date(exp.interviewDate).toLocaleDateString()}</p>
              <p className="desc-preview">
                {exp.description?.slice(0, 100) || "No description available."}...
              </p>
              {exp.user && (
                <div className="user-info">
                  <p><strong>By:</strong> {exp.user.name}</p>
                  <p className="user-email">{exp.user.email}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllExperiences;
