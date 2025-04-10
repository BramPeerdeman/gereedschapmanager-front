import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function RegisterLoan() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [gereedschap, setGereedschap] = useState({
    name: "",
    location: null,
    loaned: false,
    gebruiker: null,
  });

  const [gebruikers, setGebruikers] = useState([]);
  const [locaties, setLocaties] = useState([]);

  useEffect(() => 
  {
    loadData();
  }, []);

  const loadData = async () => 
    {
    try 
    {
      const [gereedschapRes, gebruikersRes, locatiesRes] = await Promise.all([
        axiosInstance.get(`/gereedschap/${id}`),
        axiosInstance.get("/gebruikers"),
        axiosInstance.get("/locaties"),
      ]);
      setGereedschap(gereedschapRes.data);
      setGebruikers(gebruikersRes.data);
      setLocaties(locatiesRes.data);
    } catch (error) 
    {
      console.error("Error loading data:", error);
    }
  };

  const handleLoanedChange = async (e) => 
    {
    const loanedValue = e.target.value === "true";

    try 
    {
      await axiosInstance.put(`/gereedschap/${gereedschap.id}/loan-status`, null, 
        {
        params: { loaned: loanedValue },
      });
      setGereedschap((prev) => ({ ...prev, loaned: loanedValue }));
    } catch (error) 
    {
      console.error("Error updating loan status:", error);
    }
  };

  const handleLocatieChange = (e) => {
    const selectedLocatie = locaties.find((l) => l.id === parseInt(e.target.value));
    setGereedschap((prev) => ({ ...prev, location: selectedLocatie }));
  };

  const handleGebruikerChange = (e) => {
    const selectedGebruiker = gebruikers.find((g) => g.id === parseInt(e.target.value));
    setGereedschap((prev) => ({ ...prev, gebruiker: selectedGebruiker }));
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
          <h2 className="text-center m-4">Registreer Uitleen</h2>

          <form onSubmit={onSubmit}>
            {/* Loaned Status */}
            <div className="mb-3">
              <label className="form-label">Uitgeleend</label>
              <select
                className="form-control"
                value={gereedschap.loaned ? "true" : "false"}
                onChange={handleLoanedChange}
              >
                <option value="false">Nee</option>
                <option value="true">Ja</option>
              </select>
            </div>

            {/* Location */}
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

            {/* Gebruiker */}
            <div className="mb-3">
              <label className="form-label">Gebruiker</label>
              <select
                className="form-control"
                value={gereedschap.gebruiker?.id || ""}
                onChange={handleGebruikerChange}
              >
                <option value="">Kies een gebruiker</option>
                {gebruikers.map((gebruiker) => (
                  <option key={gebruiker.id} value={gebruiker.id}>
                    {gebruiker.username}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-outline-primary">Verzenden</button>
            <Link className="btn btn-outline-danger mx-2" to="/">Annuleren</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
