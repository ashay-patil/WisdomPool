import "./CreateExperience.css";
import { useState } from "react";
import axios from "axios";

const CreateExperience = () => {
  const [experience, setExperience] = useState({
    status: "pending",
    company: "",
    position: "",
    role: "",
    description: "",
    rounds: 0,
    interviewDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [response, setResponse] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperience({ ...experience, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/protected/create-experience",
        experience,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse(data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
      setExperience({
        status: "pending",
        company: "",
        position: "",
        role: "",
        description: "",
        rounds: 0,
        interviewDate: "",
      });
    }
  };

  const allStatus = ["pending", "selected", "rejected", "ghosted"];

  return (
    <div className="create-exp-container">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="company">Company Name:</label>
          <input
            type="text"
            name="company"
            id="company"
            value={experience.company}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            name="position"
            id="position"
            value={experience.position}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            name="role"
            id="role"
            value={experience.role}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="rounds">Interview Rounds:</label>
          <input
            type="number"
            name="rounds"
            id="rounds"
            value={experience.rounds}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="interviewDate">Interview Date:</label>
          <input
            type="date"
            name="interviewDate"
            id="interviewDate"
            value={experience.interviewDate}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="status">Status:</label>
          <select
            name="status"
            id="status"
            value={experience.status}
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
          <label htmlFor="description">Brief Description:</label>
          <textarea
            name="description"
            id="description"
            value={experience.description}
            onChange={handleChange}
          />
        </div>

        <div className="btn">
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Share Experience"}
          </button>
        </div>

        <div className="err">
          {error
            ? `${error.response.data.msg}`
            : response
            ? "Shared Successfully"
            : ""}
        </div>
      </form>
    </div>
  );
};

export default CreateExperience;
