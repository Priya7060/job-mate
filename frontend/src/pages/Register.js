import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" // default role
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/login"); // register ke baad login pe bhejo
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e) => setForm({...form, name: e.target.value})}/>
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})}/>
      <input placeholder="Password" type="password" onChange={(e) => setForm({...form, password: e.target.value})}/>
      
      {/* Role Selection */}
      <select onChange={(e) => setForm({...form, role: e.target.value})} value={form.role}>
        <option value="student">Student</option>
        <option value="recruiter">Recruiter</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;