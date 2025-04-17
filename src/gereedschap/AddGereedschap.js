import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function AddGereedschap() {
  let navigate = useNavigate();

  const [gereedschap, setGereedschap] = useState({
    name: "",
    location: null, // Locatie als object
    gebruiker: null, // Gebruiker als object
    type: "",
    gebruiksInstructies: "",  // Voeg gebruiksInstructies toe
    vereistVeiligheidscheck: false,  // Voeg vereistVeiligheidscheck toe
  });

  const [gebruikers, setGebruikers] = useState([]);
  const [locaties, setLocaties] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gebruikersRes, locatiesRes] = await Promise.all([
          axiosInstance.get("/gebruikers"),
          axiosInstance.get("/locaties"),
        ]);
        setGebruikers(gebruikersRes.data);
        setLocaties(locatiesRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const { name, location, gebruiker, type, gebruiksInstructies, vereistVeiligheidscheck } = gereedschap;

  const onInputChange = (e) => {
    setGereedschap({ ...gereedschap, [e.target.name]: e.target.value });
  };

  const handleGebruikerChange = (e) => {
    const selectedGebruiker = gebruikers.find(
      (g) => g.id === parseInt(e.target.value)
    );
    setGereedschap({ ...gereedschap, gebruiker: selectedGebruiker });
  };

  const handleLocatieChange = (e) => {
    const selectedLocatie = locaties.find(
      (l) => l.id === parseInt(e.target.value)
    );
    setGereedschap({ ...gereedschap, location: selectedLocatie });
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setGereedschap({ 
      ...gereedschap, 
      type: selectedType,
      gebruiksInstructies: selectedType === "elektrisch" ? "Draag gehoorbescherming en gebruik een veiligheidsbril." : "",
      vereistVeiligheidscheck: selectedType === "elektrisch" // Safety check required for "elektrisch"
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("http://localhost:8080/gereedschap", gereedschap);
    navigate("/");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Registreer Gereedschap</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="Name" className="form-label">
                Naam
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Vul hier de naam in"
                name="name"
                value={name}
                onChange={onInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type Gereedschap
              </label>
              <select
                className="form-control"
                name="type"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="">Kies een type</option>
                <option value="hand">Handgereedschap</option>
                <option value="elektrisch">Elektrisch gereedschap</option>
              </select>
            </div>

            {/* Locatie Dropdown */}
            <div className="mb-3">
              <label htmlFor="Locatie" className="form-label">
                Locatie
              </label>
              <select
                className="form-control"
                value={location?.id || ""}
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

            {/* Gebruiker Dropdown */}
            <div className="mb-3">
              <label htmlFor="Gebruiker" className="form-label">
                Gebruiker
              </label>
              <select
                className="form-control"
                value={gebruiker?.id || ""}
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

            {/* Display Safety Instructions */}
            {type === "elektrisch" && (
              <div className="mb-3">
                <label className="form-label">Veiligheidsinstructies</label>
                <p>{gebruiksInstructies}</p>
              </div>
            )}

            {/* Display Safety Check Requirement */}
            {type === "elektrisch" && vereistVeiligheidscheck && (
              <div className="mb-3 text-danger">
                <p><strong>Doe eerst een veiligheidscheck voor het gebruiken van dit gereedschap!</strong></p>
              </div>
            )}

            <button type="submit" className="btn btn-outline-primary">
              Verzenden
            </button>
            <Link type="submit" className="btn btn-outline-danger mx-2" to="/">
              Annuleren
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
