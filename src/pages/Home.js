import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../AuthContext";

export default function Home() {
  const [gereedschap, setGereedschap] = useState([]);
  const [loanedFilter, setLoanedFilter] = useState("all");
  const { username } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => 
    {
    const hour = new Date().getHours();
    if (hour < 12) 
    {
      setGreeting("Goedemorgen");
    } else if (hour < 18) 
    {
      setGreeting("Goedemiddag");
    } else 
    {
      setGreeting("Goedenavond");
    }

    loadGereedschap();
  }, []);

  const loadGereedschap = async () => {
    try {
      const result = await axiosInstance.get("http://localhost:8080/gereedschappen");

      const gereedschappenWithLocation = await Promise.all(result.data.map(async (item) => {
        if (item.location_id) {
          const locationResult = await axiosInstance.get(`http://localhost:8080/locatie/${item.location_id}`);
          item.location = locationResult.data; 
        }
        return item;
      }));

      setGereedschap(gereedschappenWithLocation);
    } catch (error) {
      console.error("Error loading gereedschappen:", error);
    }
  };

  const deleteGereedschap = async (id) => {
    await axiosInstance.delete(`http://localhost:8080/gereedschap/${id}`);
    loadGereedschap();
  };

  return (
    <div className="container">
      <div className="py-4">
      <h2 className="mb-4">{greeting}, {username}!</h2>
        <div className="mb-3">
          <label className="form-label me-2">Filter op uitgeleend:</label>
          <select
            value={loanedFilter}
            onChange={(e) => setLoanedFilter(e.target.value)}
            className="form-select w-auto d-inline-block"
          >
            <option value="all">Alle</option>
            <option value="true">Uitgeleend</option>
            <option value="false">Niet uitgeleend</option>
          </select>
        </div>
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Naam Gereedschap</th>
              <th scope="col">Locatie</th>
              <th scope="col">Uitgeleend</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {gereedschap
              .filter((item) => {
                if (loanedFilter === "all") return true;
                return loanedFilter === "true" ? item.loaned : !item.loaned;
              })
              .map((gereedschap, index) => (
                <tr key={gereedschap.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{gereedschap.name}</td>
                  <td>{gereedschap.location ? gereedschap.location.naam : "Geen locatie"}</td>
                  <td>
                    <Link to={`/edituitleen/${gereedschap.id}`}>
                      {gereedschap.loaned ? "Ja" : "Nee"}
                    </Link>
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary mx-2"
                      to={`/viewgereedschap/${gereedschap.id}`}
                    >
                      Bekijk
                    </Link>
                    <Link
                      className="btn btn-outline-primary mx-2"
                      to={`/editgereedschap/${gereedschap.id}`}
                    >
                      Bewerk
                    </Link>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => deleteGereedschap(gereedschap.id)}
                    >
                      Verwijder
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
