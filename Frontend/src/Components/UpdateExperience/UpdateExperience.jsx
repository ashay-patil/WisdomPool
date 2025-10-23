import "./UpdateExperience.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get experience id from URL

const UpdateExperience = () => {
  const { id } = useParams(); // Get experience ID from URL
  const [experience, setExperience] = useState({
    status: "",
    company: "",
    position: "",
    role: "",
    description: "",
    rounds: "",
    interviewDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch existing experience on mount
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
        console.error("Failed to fetch experience:", err);
        setError(true);
      } finally {
        setFetching(false);
      }
    };

    fetchExperience();
  }, [id, token]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperience({ ...experience, [name]: value });
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setMessage("");

    // Filter out empty fields (so backend ignores them)
    const filteredExperience = Object.fromEntries(
      Object.entries(experience).filter(([_, value]) => value !== "")
    );

    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/protected/update-experience/${id}`,
        filteredExperience,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Experience updated successfully!");
      setExperience(data.experience);
    } catch (err) {
      console.error("Update failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const allStatus = ["pending", "selected", "rejected", "ghosted"];

  if (fetching) {
    return <div className="loading">Loading experience data...</div>;
  }

  return (
    <div className="update-exp-container">
      <h2>Update Your Interview Experience</h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Company Name:</label>
          <input
            type="text"
            name="company"
            value={experience.company || ""}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Position:</label>
          <input
            type="text"
            name="position"
            value={experience.position || ""}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={experience.role || ""}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Rounds:</label>
          <input
            type="number"
            name="rounds"
            value={experience.rounds || ""}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Interview Date:</label>
          <input
            type="date"
            name="interviewDate"
            value={
              experience.interviewDate
                ? experience.interviewDate.slice(0, 10)
                : ""
            }
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Status:</label>
          <select
            name="status"
            value={experience.status || "pending"}
            onChange={handleChange}
          >
            {allStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Description:</label>
          <textarea
            name="description"
            value={experience.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="btn">
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Experience"}
          </button>
        </div>

        <div className="msg">
          {error && <span className="error">Failed to update. Try again.</span>}
          {message && <span className="success">{message}</span>}
        </div>
      </form>
    </div>
  );
};

export default UpdateExperience;
