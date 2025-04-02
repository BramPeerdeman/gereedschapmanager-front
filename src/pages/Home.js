import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function Home() 
{
    const [gereedschap,setGereedschap] = useState([]);

    const {id} = useParams();

    useEffect(() => 
    {
      loadGereedschap();
    },[]);

    const loadGereedschap = async () =>
    {
      const result = await axios.get("http://localhost:8080/gereedschappen");
      setGereedschap(result.data);
    };

    const deleteGereedschap = async (id) =>
    {
      await axios.delete(`http://localhost:8080/gereedschap/${id}`);
      loadGereedschap();
    }

  return (
    <div className="container">
      <div className="py-4">
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
            {
              gereedschap.map((gereedschap,index)=>(
                <tr>
                <th scope="row" key={index}>{index+1}</th>
                <td>{gereedschap.name}</td>
                <td>{gereedschap.location}</td>
                <td>{gereedschap.loaned ? "Ja" : "Nee"}</td>
                <td>
                  <Link className="btn btn-primary mx-2" to={`/viewgereedschap/${gereedschap.id}`}>Bekijk</Link>
                  <Link className="btn btn-outline-primary mx-2" to={`/editgereedschap/${gereedschap.id}`}>Bewerk</Link>
                  <button className="btn btn-danger mx-2" onClick={() => deleteGereedschap(gereedschap.id)}>Verwijder</button>
                </td>
              </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
