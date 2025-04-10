import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function ViewGereedschap() 
{
  const [gereedschap, setGereedschap] = useState(
  {
    id: "",
    name: "",
    locationId: "",
    loaned: "",
    loanedStatusChange: "",
    gebruikerId: "",
    location: {},
    gebruiker: {},
  });

  const { id } = useParams();

  useEffect(() => 
  {
    loadGereedschap();
  }, [id]);

  const loadGereedschap = async () => 
  {
    try 
    {
      const result = await axiosInstance.get(`http://localhost:8080/gereedschap/${id}`);
      const fetchedGereedschap = result.data;
      setGereedschap(fetchedGereedschap);

      if (fetchedGereedschap.locationId) 
      {
        const locationResult = await axiosInstance.get(`http://localhost:8080/location/${fetchedGereedschap.locationId}`);
        setGereedschap((prevState) => (
        {
          ...prevState,
          location: locationResult.data,
        }));
      }

      if (fetchedGereedschap.gebruikerId) 
      {
        const gebruikerResult = await axiosInstance.get(`http://localhost:8080/gebruiker/${fetchedGereedschap.gebruikerId}`);
        setGereedschap((prevState) => (
        {
          ...prevState,
          gebruiker: gebruikerResult.data,
        }));
      }
    } catch (error) 
    {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Onbekend";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Gereedschap details</h2>
          <div className="card">
            <div className="card-header">
              Details van gereedschap nummer: {gereedschap.id}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Naam: </b>
                  {gereedschap.name}
                </li>
                <li className="list-group-item">
                  <b>Locatie: </b>
                  {gereedschap.location?.naam || "Onbekend"}
                </li>
                <li className="list-group-item">
                  <b>Uitgeleend: </b>
                  {gereedschap.loaned ? "Ja" : "Nee"}
                </li>
                <li className="list-group-item">
                  <b>Laatste wijziging status: </b>
                  {formatDate(gereedschap.loanedStatusChange)}
                </li>
                <li className="list-group-item">
                  <b>Gebruiker: </b>
                  {gereedschap.gebruiker?.username || "Onbekend"}
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-primary my-2" to={"/"}>
            Naar Homepagina
          </Link>
        </div>
      </div>
    </div>
  );
}
