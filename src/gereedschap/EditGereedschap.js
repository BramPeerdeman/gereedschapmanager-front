import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function EditGereedschap() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [gereedschap, setGereedschap] = useState({
    name: "",
    location: null,
  });

  const { name } = gereedschap;
  const [locaties, setLocaties] = useState([]);

  const onInputChange = (e) => {
    setGereedschap({ ...gereedschap, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadData();
    
  }, []);

  const loadData = async () => 
  {
    try 
    {
      const [gereedschapRes, locatiesRes] = await Promise.all([
        axiosInstance.get(`/gereedschap/${id}`),
        axiosInstance.get("/locaties"),
      ]);
      setGereedschap(gereedschapRes.data);
      setLocaties(locatiesRes.data);
    } catch (error) 
    {
      console.error("Error loading data:", error);
    }
  };

  const handleLocatieChange = (e) => {
    const selectedLocatie = locaties.find((l) => l.id === parseInt(e.target.value));
    setGereedschap((prev) => ({ ...prev, location: selectedLocatie }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/gereedschap/${id}`, gereedschap);
      navigate("/");
    } catch (error) {
      console.error("Error updating gereedschap:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Bewerk Gereedschap</h2>

          <form onSubmit={(e) => onSubmit(e)}>
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
                onChange={(e) => onInputChange(e)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Locatie</label>
              <select
                className="form-control"
                value={gereedschap.location?.id || ""}
                onChange={handleLocatieChange}
              >
                <option value="">Kies een locatie</option>
                {locaties.map((locatie) => (
                  <option key={locatie.id} value={locatie.id}>
                    {locatie.naam}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-outline-primary">
              Verzenden
            </button>
            <Link
              type="button"
              className="btn btn-outline-danger mx-2"
              to="/"
            >
              Annuleren
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
