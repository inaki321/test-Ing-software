import { useEffect, useState } from "react";

const sheetId = '1E331LxZZL6DuUk7RcQIWZ92mhAkMOA_n5h2DM70mhMo';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'prueba-fetch';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`

const Card = (props) => {
    return (  
      <div className="card">
        <h2 className="card-header">{props.data.num}</h2>
        <div className="card-body">
            <div><b>Nombre del trabajo: </b> {props.data.nombre}</div>
            <div><b>Descripcion:</b> {props.data.descripcion}</div>
            <div><b>Movilidad: </b> {props.data.mas}</div>
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
        <h1>Trabajos</h1>
        {cardData(data)}
    </div>
);

}

export default Jobs;