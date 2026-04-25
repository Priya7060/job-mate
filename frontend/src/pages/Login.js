import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      // store token aur role dono
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      alert("Login successful");
      if (res.data.user.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response.data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >

        <h2 className="text-3xl font-bold text-center">
          Login
        </h2>

        <input
          className="w-full border p-3 rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-3 rounded"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Login
        </button>

      </form>

    </div>
  )
};

export default Login;