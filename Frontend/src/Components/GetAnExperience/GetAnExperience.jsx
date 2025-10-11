import "./GetAnExperience.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
const SingleExperience = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [aiResponse, setAiResponse] = useState(
    "Gemini AI is always here to help you! Just click"
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/public/get-single-experience/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExperience(data.experience);
      } catch (err) {
        console.error("Error fetching experience:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, token]);

  const askAi = async () => {
    setAiLoading(true);
    setAiError(false);
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/ask-AI/${id}`,
      );
      setAiResponse(data);
      console.log(aiResponse);
    } catch (error) {
      console.error("AI request failed:", error);
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading experience...</div>;
  if (error) return <div className="error">{error.response.data.msg}</div>;
  if (!experience) return <div className="error">No experience found.</div>;

  return (
    <div className="single-exp-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="exp-details-card">
        <h2>{experience.company}</h2>
        <p><strong>Position:</strong> {experience.position}</p>
        <p><strong>Role:</strong> {experience.role}</p>
        <p><strong>Status:</strong> <span className={`status ${experience.status}`}>{experience.status}</span></p>
        <p><strong>Rounds:</strong> {experience.rounds}</p>
        <p><strong>Date:</strong> {new Date(experience.interviewDate).toLocaleDateString()}</p>

        <div className="exp-description">
          <h3>Experience Description</h3>
          <p>{experience.description || "No description provided."}</p>
        </div>

        {experience.user && (
          <div className="exp-user-info">
            <h3>Shared By</h3>
            <p><strong>Name:</strong> {experience.user.name}</p>
            <p><strong>Email:</strong> {experience.user.email}</p>
          </div>
        )}
      </div>

      <button
        className="get-Ai-Response"
        onClick={askAi}
        disabled={aiLoading}
      >
        {aiLoading ? "Analyzing..." : "Get Insights From AI"}
      </button>

      <div className="AiResponse">
  {aiLoading ? (
    "Loading..."
  ) : aiError ? (
    "AI is busy... Try again later."
  ) : (
    <ReactMarkdown>{aiResponse}</ReactMarkdown>
  )}
</div>
    </div>
  );
};

export default SingleExperience;
