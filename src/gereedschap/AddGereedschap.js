import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AddGereedschap() 
{
  let navigate = useNavigate()

  const [gereedschap, setGereedschap] = useState
  ({
    name:"",
    location:""
  })

  const{ name,location } = gereedschap

  const onInputChange = (e) =>
  {
    setGereedschap({ ...gereedschap, [e.target.name]: e.target.value});
  }

  const onSubmit = async (e) =>
  {
    e.preventDefault();
    await axios.post("http://localhost:8080/gereedschap", gereedschap)
    navigate("/")
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Registreer Gereedschap</h2>

          <form onSubmit={(e)=>onSubmit(e)}>
          <div className="mb-3">
            <label htmlFor="Name" className="form-label">
              Naam
            </label>
            <input
              type={"text"}
              className="form-control"
              placeholder="Vul hier de naam in"
              name="name"
              value={name}
              onChange={(e)=>onInputChange(e)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Locatie" className="form-label">
              Locatie
            </label>
            <input
              type={"text"}
              className="form-control"
              placeholder="Vul hier de locatie in"
              name="location"
              value={location}
              onChange={(e)=>onInputChange(e)}
            />
          </div>

          <button type="submit" className="btn btn-outline-primary">Verzenden</button>
          <Link type="submit" className="btn btn-outline-danger mx-2" to="/">Annuleren</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
