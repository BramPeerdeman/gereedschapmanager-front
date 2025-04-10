import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../AuthContext";

export default function Home() {
  const [gereedschap, setGereedschap] = useState([]);
  const [loanedFilter, setLoanedFilter] = useState("all");
  const { username } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [overdueTools, setOverdueTools] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Goedemorgen");
    } else if (hour < 18) {
      setGreeting("Goedemiddag");
    } else {
      setGreeting("Goedenavond");
    }

    loadGereedschap();
  }, []);

  const loadGereedschap = async () => {
    try {
      const result = await axiosInstance.get("http://localhost:8080/gereedschappen");

      const gereedschappenWithLocation = await Promise.all(
        result.data.map(async (item) => {
          if (item.location_id) {
            const locationResult = await axiosInstance.get(`http://localhost:8080/locatie/${item.location_id}`);
            item.location = locationResult.data;
          }

          if (item.loaned && item.loanedStatusChange) {
            const loanedDate = new Date(item.loanedStatusChange);
            const now = new Date();
            const diffDays = (now - loanedDate) / (1000 * 60 * 60 * 24);
            if (diffDays >= 7) {
              item.overdue = true;
            }
          }

          return item;
        })
      );

      setGereedschap(gereedschappenWithLocation);
      const overdue = gereedschappenWithLocation.filter((item) => item.overdue);
      setOverdueTools(overdue);
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{greeting}, {username}!</h2>
          <div>
            <button
              className="btn btn-outline-warning position-relative"
              onClick={() => setShowModal(true)}
            >
              🔔
              {overdueTools.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {overdueTools.length}
                </span>
              )}
            </button>
          </div>
        </div>

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
              <th>#</th>
              <th>Naam Gereedschap</th>
              <th>Locatie</th>
              <th>Uitgeleend</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {gereedschap
              .filter((item) => {
                if (loanedFilter === "all") return true;
                return loanedFilter === "true" ? item.loaned : !item.loaned;
              })
              .map((item, index) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.location ? item.location.naam : "Geen locatie"}</td>
                  <td>
                    <Link to={`/edituitleen/${item.id}`}>
                      {item.loaned ? "Ja" : "Nee"}
                    </Link>
                  </td>
                  <td>
                    <Link className="btn btn-primary mx-2" to={`/viewgereedschap/${item.id}`}>Bekijk</Link>
                    <Link className="btn btn-outline-primary mx-2" to={`/editgereedschap/${item.id}`}>Bewerk</Link>
                    <button className="btn btn-danger mx-2" onClick={() => deleteGereedschap(item.id)}>Verwijder</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" onClick={() => setShowModal(false)} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Uitgeleend langer dan 7 dagen</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {overdueTools.length === 0 ? (
                  <p>Er zijn momenteel geen gereedschappen langer dan 7 dagen uitgeleend.</p>
                ) : (
                  <ul className="list-group">
                    {overdueTools.map((item) => (
                      <li key={item.id} className="list-group-item">
                        {item.name} – uitgeleend sinds:{" "}
                        {new Date(item.loanedStatusChange).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Sluiten</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
