import { useEffect, useState } from "react";
import myUser from "../vars";
import { Link } from "react-router-dom";
import usua from "../img/usuario.png";
// import "../App.css";

const sheetId = "1E331LxZZL6DuUk7RcQIWZ92mhAkMOA_n5h2DM70mhMo";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = "prueba-fetch";
const query = encodeURIComponent("Select *");
const url = `${base}&sheet=${sheetName}&tq=${query}`;

const Card = (props) => {
  return (
    <div className="card col-md-5 card-per">
      <img className="card-img-top" src="..." alt="algo" />
      <div className="card-body">
        <h5 className="card-title">{props.data.nombre}</h5>
        <p className="card-text">{props.data.descripcion}</p>
        <a href="#" class="btn btn-primary">
          Ver mas
        </a>
      </div>
    </div>
    // <div className="content_box">
    //   <div className="col3">
    //     <div className="hero_title2">
    //       <b>Nombre del trabajo: </b> {props.data.nombre}
    //     </div>
    //     <div className="highlights">
    //       <b>Descripcion:</b> {props.data.descripcion}
    //     </div>
    //     <div className="highlights">
    //       <b>Movilidad: </b> {props.data.mas}
    //     </div>
    //   </div>
    // </div>
  );
};
function cardData(jobs) {
  var values = Object.values(jobs);
  return values.map((info, idx) => {
    return <Card data={info} key={idx} />;
  });
}

function Jobs() {
  console.log("usuario ", myUser);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  async function fetchData() {
    try {
      const response = await fetch(url)
        .then((res) => res.text())
        .then((rep) => {
          //Remove additional text and extract only JSON:
          const jsonData = JSON.parse(rep.substring(47).slice(0, -2));

          console.log(rep);
          const colz = [];

          //Extract column labels
          jsonData.table.cols.forEach((heading) => {
            if (heading.label) {
              let column = heading.label;
              colz.push(column);
            }
          });

          //extract row data:
          let check2 = [];
          jsonData.table.rows.forEach((rowData) => {
            const row = {};
            colz.forEach((ele, ind) => {
              row[ele] = rowData.c[ind] != null ? rowData.c[ind].v : "";
            });
            check2.push(row);
          });
          console.log(check2);
          setData(check2);
        });
    } catch (error) {
      setError("No se pudo hacer la solicitud de trabajos");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <nav className="navbar navbar-light bg-light justify-content-between">
        <h1 className="hero_title1">Bienvenido</h1>

        <form className="form-inline">
          <img className="img-fluid" width="38" src={usua} alt="alt text" />
        </form>
      </nav>
      <div className="container fluid land">
        <div className="container">
          <div className="row ">
            <div className="col-md-12">
              <div className="row centrar mt-5">
                <div className="col-md-8 text-start">
                  {myUser.able == "No" ? (
                    <h1>Trabajos sin movilidad</h1>
                  ) : (
                    <h1>Trabajos con movilidad</h1>
                  )}
                </div>
                <div className="col-md-4">
                  <Link to="/test">
                    <button className="boton_a_mov">Test de movilidad</button>
                  </Link>
                </div>
              </div>
              <div className="row resto">{cardData(data)}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Jobs;
