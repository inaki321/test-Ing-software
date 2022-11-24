import { useEffect, useState } from "react";
import myUser from "../vars";
import { Link } from "react-router-dom";
import usua from "../img/usuario.png";

const sheetId = '1E331LxZZL6DuUk7RcQIWZ92mhAkMOA_n5h2DM70mhMo';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'prueba-fetch';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`

const Card = (props) => {
  return (
    <div className="content_box">

      <div className="col3">
        <div className="hero_title2"><b>Nombre del trabajo: </b> {props.data.nombre}</div>
        <div className="highlights"><b>Descripcion:</b> {props.data.descripcion}</div>
        <div className="highlights"><b>Movilidad: </b> {props.data.mas}</div>
      </div>
    </div>
  )
}
function cardData(jobs) {
  var values = Object.values(jobs);
  return values.map((info, idx) => {
    return <Card data={info} key={idx} />;
  })
}


function Jobs() {
  console.log('usuario ', myUser)
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  async function fetchData() {
    try {
      const response = await fetch(url)
        .then(res => res.text())
        .then(rep => {
          //Remove additional text and extract only JSON:
          const jsonData = JSON.parse(rep.substring(47).slice(0, -2));

          console.log(rep)
          const colz = [];

          //Extract column labels
          jsonData.table.cols.forEach((heading) => {
            if (heading.label) {
              let column = heading.label;
              colz.push(column);

            }
          })

          //extract row data:
          let check2 = [];
          jsonData.table.rows.forEach((rowData) => {
            const row = {};
            colz.forEach((ele, ind) => {
              row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
            })
            check2.push(row);

          })
          console.log(check2);
          setData(check2);

        })
    } catch (error) {
      setError("No se pudo hacer la solicitud de trabajos");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="App">
      <div class="lan root">
        <div class="col">
          <div class="row">
            <div class="item">
              <h1 class="hero_title1">Bienvenido</h1>
            </div>
            <div class="spacer"></div>
            <div class="item1">
              <img class="image" src={usua} alt="alt text" />
            </div>
          </div>
          <div class="col1">
            <div class="rect"></div>
            <div class="col2">
              <div class="row1">
                <div class="item">
                  {myUser.able == "No" ? <h1>Trabajos sin movilidad</h1> : <h1>Trabajos con movilidad</h1>}
                </div>
                <div class="spacer"></div>
                <div class="item1">
                  <button className="v1_274"><Link to="/test">Go to the test</Link></button>
                </div>
              </div>
              <div class="col3">
                {cardData(data)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Jobs;