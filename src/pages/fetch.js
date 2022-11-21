const sheetId = '1E331LxZZL6DuUk7RcQIWZ92mhAkMOA_n5h2DM70mhMo';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'prueba-fetch';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`
const data = []
document.addEventListener('DOMContentLoaded', init)

const row = document.querySelector('.row');
function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));

            console.log(rep)
            const colz = [];
            const tr = document.createElement('tr');
            //Extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    
                }
            })
            
            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].v : '';
                })
                data.push(row);
            })
            console.log(data);
            processRows(data);
        })
}
 
function processRows(json) {
    json.forEach((element) => {

        const title = document.createElement('div');
        title.innerHTML = `<h1>${element.num}</h1>`
        title.style.background = '#FFFFFF'
        title.style.textIndent = "20px"
        title.style.paddingTop = "1px"
        title.style.background = '#FFFFFF'

        const body = document.createElement('div');
        body.innerHTML = `<b>Nombre del trabajo: </b><br>${element.nombre}<br><br>
                <b>Descripcion:</b><br>${element.descripcion}<br><br>
                <b>Movilidad: </b><br>${element.mas}<br><br>`
        body.style.textIndent = "0px"
        body.style.fontSize = "14px"
        body.style.paddingTop = "15px"
        body.style.paddingBottom = "20px"
        body.style.paddingLeft = "15px"
        title.append(body);
        
        // create your card structure 
        let column = document.createElement('div');
        column.classList.add("column");
        let card = document.createElement('div');
        card.classList.add("card");
        let out = document.createElement('div');
        out.classList.add("out");

        card.append(out);
        column.append(card);
        row.append(column);
        // now add your previus html into that card structure
        out.append(title);
        // add cards to row
        row.append(column);
        
    })
}