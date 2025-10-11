import "./GetAllMyExperiences.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user's experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/protected/get-all-myExperiences",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExperiences(data.experiences);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [token]);

  const handleEdit = (id) => {
    navigate(`/update-experience/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/protected/delete-experience/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExperiences(experiences.filter((exp) => exp._id !== id));
    } catch (err) {
      alert("Failed to delete experience.");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading your experiences...</div>;
  }

  if (error) {
    return <div className="error">{error.response.data.msg}</div>;
  }

  if (experiences.length === 0) {
    return <div className="no-exp">You haven't shared any experiences yet.</div>;
  }

  return (
    <div className="my-exp-container">
      <h2>My Interview Experiences</h2>
      <div className="exp-list">
        {experiences.map((exp) => (
          <div className="exp-card" key={exp._id}>
            <h3>{exp.company}</h3>
            <p>
              <strong>Position:</strong> {exp.position}
            </p>
            <p>
              <strong>Role:</strong> {exp.role}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${exp.status}`}>{exp.status}</span>
            </p>
            <p>
              <strong>Rounds:</strong> {exp.rounds}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(exp.interviewDate).toLocaleDateString()}
            </p>

            <div className="card-buttons">
              <button
                className="btn-view"
                onClick={() => navigate(`/experience/${exp._id}`)}
              >
                View
              </button>
              <button
                className="btn-edit"
                onClick={() => handleEdit(exp._id)}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(exp._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyExperiences;
