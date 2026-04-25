import { Link } from "react-router-dom";

const Navbar=()=>{

return(
<nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

<h1 className="text-2xl font-bold text-blue-600">
JobMate
</h1>

<div className="space-x-6 font-medium">
<Link to="/" className="hover:text-blue-600">
Home
</Link>

<Link to="/dashboard" className="hover:text-blue-600">
Dashboard
</Link>

<Link to="/recruiter" className="hover:text-blue-600">
RecruiterDashboard
</Link>

<Link to="/register" className="hover:text-blue-600">
Register
</Link>

<Link
to="/login"
className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
Login
</Link>

</div>

</nav>
)

}

export default Navbar;