import { useState } from "react";
import API from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
    } catch (err) {
      alert(err.response.data.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" onChange={(e)=>setForm({...form, name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setForm({...form, email:e.target.value})}/>
      <input placeholder="Password" type="password" onChange={(e)=>setForm({...form, password:e.target.value})}/>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;