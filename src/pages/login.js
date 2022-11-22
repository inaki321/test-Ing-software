import React, { useEffect } from "react";
import imagen_land from "../img/Active elderly people-bro 1.png";
import myUser from "../vars";


const Login = () => {
  useEffect(() => {
    const input_usuario = document.querySelector("#username");
    const label_usuario = document.querySelector("#label_usuario");
    input_usuario.addEventListener("input", () => {
      if (input_usuario.value == null || input_usuario.value == "") {
        label_usuario.classList.remove("activo");
      } else {
        label_usuario.classList.add("activo");
      }
    });
    const input_pass = document.querySelector("#password");
    const label_pass = document.querySelector("#label_pass");
    input_pass.addEventListener("input", () => {
      if (input_pass.value == null || input_pass.value == "") {
        label_pass.classList.remove("activo");
      } else {
        label_pass.classList.add("activo");
      }
    });

  });
  console.log(myUser);
  return (
    <div className="container fluid land centrar">
      <div className="row">
        <div className="col-md-4">
          <div className="row">
            <div className="col-12">
              <h1 className="bienvenidos">Bienvenidos</h1>
            </div>
            <div className="col-12 mt-5 text-left">
              <h5>Ingresa tus credenciales</h5>
              <form action="#" method="post">
                <div className="form-group first form_group mt-5">
                  <label className="form__label" id="label_usuario">
                    Usuario
                  </label>
                  <input
                    type="text"
                    className="form__field"
                    id="username"
                    aria-label="Usuario"
                    placeholder="Usuario"
                  />
                </div>
                <div className="form-group last mt-3 mb-4 form_group">
                  <label className="form__label" id="label_pass">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form__field"
                    id="password"
                    placeholder="Contraseña"
                  />
                </div>
              </form>
            </div>
            <div className="col-12 centrar mt-5">
              <button className="boton">Ingresar</button>
              <h5 style={{ margin: 0 }}>Ó</h5>
              <button className="boton">Registrarse</button>
            </div>
          </div>
        </div>
        <div className="col-md-8 justify-content-center align-items-center text-align-center d-flex">
          <img className="img-fluid img-land" src={imagen_land}></img>
        </div>
      </div>
    </div>
  );
};

export default Login;
