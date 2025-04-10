import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() 
{

  const {logout} = useAuth();

  const navigate = useNavigate();

  const logoutUser = () => 
  {
    logout()
    navigate("/login")
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            GereedschapManager
          </a>
          <div className="">
          <Link className="btn btn-outline-light me-2" to="/uploadgereedschap">Upload JSON</Link>
          <Link className="btn btn-outline-light me-2" to="/addgereedschap">Nieuw Gereedschap</Link>
          <Link onClick={logoutUser} className="btn btn-outline-light  me-2">Logout</Link>
          <Link className="btn btn-outline-light" to="/registration">Register</Link>
          </div>  
        </div>
      </nav>
    </div>
  );
}
