import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosConfig";

export default function ViewGereedschap() 
{
    const [gereedschap, setGereedschap] = useState ({
      name:"",
      location:"",
      loaned:""
    })

    const {id} = useParams();

    useEffect(() => 
    {
      loadGereedschap();
    });

    const loadGereedschap = async () =>
    {
      const result = await axiosInstance.get(`http://localhost:8080/gereedschap/${id}`,);
      setGereedschap(result.data);
    }

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
                  {gereedschap.location}
                </li>
                <li className="list-group-item">
                  <b>Uitgeleend: </b>
                  {gereedschap.loaned ? "Ja" : "Nee"}
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
