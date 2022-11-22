import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import img_signup from "../img/Ride a bicycle-rafiki 1.png";
import myUser from "../vars";

const Signup = () => {
  const navigate = useNavigate();
  function Registrado(e) {
    e.preventDefault();
    var input_nombre = document.querySelector("#nombre").value;
    var input_edad = document.querySelector("#edad").value;
    var input_usuario = document.querySelector("#usuario").value;
    var input_email = document.querySelector("#email").value;
    var input_pass = document.querySelector("#password").value;
    var input_sex = document.querySelector("#sex").value;

    console.log(
      input_nombre,
      input_edad,
      input_usuario,
      input_email,
      input_pass,
      input_sex
    );
    myUser.name = input_nombre;
    myUser.age = input_edad;
    myUser.user = input_usuario;
    myUser.email = input_email;
    myUser.pass = input_pass;
    myUser.sex = input_sex;
    console.log(myUser);
    setTimeout(() => {
      navigate("/Jobs");
    }, 2000);
  }
  useEffect(() => {
    const input_nombre = document.querySelector("#nombre");
    const label_nombre = document.querySelector("#label_nombre");
    input_nombre.addEventListener("input", () => {
      if (input_nombre.value == null || input_nombre.value == "") {
        label_nombre.classList.remove("activo");
      } else {
        label_nombre.classList.add("activo");
      }
    });
    const input_edad = document.querySelector("#edad");
    const label_edad = document.querySelector("#label_edad");
    input_edad.addEventListener("input", () => {
      if (input_edad.value == null || input_edad.value == "") {
        label_edad.classList.remove("activo");
      } else {
        label_edad.classList.add("activo");
      }
    });
    const input_usuario = document.querySelector("#usuario");
    const label_usuario = document.querySelector("#label_usuario");
    input_usuario.addEventListener("input", () => {
      if (input_usuario.value == null || input_usuario.value == "") {
        label_usuario.classList.remove("activo");
      } else {
        label_usuario.classList.add("activo");
      }
    });
    const input_email = document.querySelector("#email");
    const label_email = document.querySelector("#label_correo");
    input_email.addEventListener("input", () => {
      if (input_email.value == null || input_email.value == "") {
        label_email.classList.remove("activo");
      } else {
        label_email.classList.add("activo");
      }
    });
    const input_sex = document.querySelector("#sex");
    const label_sex = document.querySelector("#label_sex");
    input_sex.addEventListener("input", () => {
      if (input_sex.value == null || input_sex.value == "") {
        label_sex.classList.remove("activo");
      } else {
        label_sex.classList.add("activo");
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

  return (
    <div className="container fluid land centrar">
      <div className="row espacio">
        <div className="col-md-7">
          <img className="img-fluid " src={img_signup} alt="alguien_bici"></img>
        </div>
        <div className="col-md-5">
          <h1>Ingresa tus datos</h1>
          <form onSubmit={Registrado} method="post">
            <div className="form-group first form_group mt-5">
              <label className="form__label" id="label_nombre">
                Nombre
              </label>
              <input
                type="text"
                className="form__field"
                id="nombre"
                aria-label="nombre"
                placeholder="Nombre"
                required
              />
            </div>
            <div className="form-group last mt-3 mb-4 form_group">
              <label className="form__label" id="label_edad">
                Edad
              </label>
              <input
                type="number"
                className="form__field"
                id="edad"
                placeholder="Edad"
                required
              />
            </div>
            <div className="form-group last mt-3 mb-4 form_group">
              <label className="form__label" id="label_sex">
                Sexo
              </label>
              <input
                type="text"
                className="form__field"
                id="sex"
                placeholder="Sexo"
                required
              />
            </div>
            <div className="form-group last mt-3 mb-4 form_group">
              <label className="form__label" id="label_usuario">
                Usuario
              </label>
              <input
                type="text"
                className="form__field"
                id="usuario"
                placeholder="Usuario"
                required
              />
            </div>
            <div className="form-group last mt-3 mb-4 form_group">
              <label className="form__label" id="label_correo">
                Correo
              </label>
              <input
                type="email"
                className="form__field"
                id="email"
                placeholder="Correo"
                required
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
                required
              />
            </div>
            <button className="boton_reg">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
