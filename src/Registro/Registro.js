import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "./Registro.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [Usuario_nombre, setNombre] = useState("");
  const [Usuario_email, setCorreo] = useState("");
  const [Usuario_contraseña, setContraseña] = useState("");
  const [ConfirmarContraseña, setConfirmarContraseña] = useState("");
  const [Usuario_pais, setPais] = useState("");
  const [Usuario_estado, setEstado] = useState(""); 
  const [Usuario_ciudad, setCiudad] = useState(""); 
  const [Usuario_colonia, setColonia] = useState("");
  const [Usuario_calle, setCalle] = useState(""); 
  const [Usuario_CP, setCP] = useState(""); 
  const [Usuario_Nexte, setNexte] = useState("");
  const [Usuario_Nint, setNint] = useState("");
  const [Usuario_indicaciones, setIndicaciones] = useState("");
  const navigate = useNavigate();


  const submit = async (e) => {
    e.preventDefault();

    //Condición para validar contraseñas
    if (Usuario_contraseña !== ConfirmarContraseña) {
      alert("Las contraseñas no coinciden");
      setContraseña("");
      setConfirmarContraseña("");
      return;
    }

    //Condición para que la contraseña sea minimo de 8 caracteres
    const minLength = 8;
    if (Usuario_contraseña.length < minLength) {
      alert(`La contraseña debe tener al menos ${minLength} caracteres.`);
      setContraseña("");
      setConfirmarContraseña("");
      return;
    }

    //Condición para verificar que el correo incluya @gmail.com al final
    if (!Usuario_email.toLowerCase().includes("@gmail.com")) {
      alert("El correo electrónico debe ser de formato @gmail.com");
      setCorreo("");
      return;
    }  
    try { 
        const res = await axios.post("http://localhost:3000/registro", {
          Usuario_nombre: Usuario_nombre.trim(),
          Usuario_email: Usuario_email.toLowerCase().trim(),
          Usuario_contraseña,
          Usuario_pais,
          Usuario_estado, 
          Usuario_ciudad, 
          Usuario_colonia,
          Usuario_calle, 
          Usuario_CP, 
          Usuario_Nexte,
          Usuario_Nint,
          Usuario_indicaciones
        });
   
          alert("Usuario creado exitosamente");  
          navigate("/iniciar_sesion"); 
      
    } catch (error) {
      console.error(error);
      alert("El usuario o el correo que insertaste ya están en uso");
    }
  };
  
  return (
    <div>
      <h1 className="S-title"> Crear Cuenta </h1>
      <Form id="FormSignup">
        <Form.Group className="S-format">
          <Form.Group className="S-subtitle">
            <Form.Label> Ingresar nombre de usuario</Form.Label>
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="S-entry"
              style={{}}
              type="text"
              onChange={(e) => {
                setNombre(e.target.value);
              }}
              placeholder="Usuario"
              value={Usuario_nombre}
            />
          </Form.Group>

          <Form.Group itemID="Email" className="S-subtitle">
            <Form.Label> Ingresar correo electrónico</Form.Label>
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="S-entry"
              type="email"
              onChange={(e) => {
                setCorreo(e.target.value);
              }}
              placeholder="Correo Electrónico"
              value={Usuario_email}
            />
          </Form.Group>

          <Form.Group className="S-subtitle">
            <Form.Label>Contraseña </Form.Label>
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="S-entry"
              type="password"
              onChange={(e) => {
                setContraseña(e.target.value);
              }}
              placeholder="Contraseña"
              value={Usuario_contraseña}
            />
          </Form.Group>

          <Form.Group className="S-subtitle">
            <Form.Label>Confirmar contraseña </Form.Label>
          </Form.Group>

          <Form.Group>
            <Form.Control
              className="S-entry"
              type="password"
              placeholder="Contraseña"
              onChange={(e) => {
                setConfirmarContraseña(e.target.value);
              }}
              value={ConfirmarContraseña}
            />
          </Form.Group> 
          <Form.Group controlId="formPais" className="S-subtitle">
            <Form.Label>País:</Form.Label>
            <Form.Control
              className="S-entry"
              type="text"
              placeholder="País"
              value={Usuario_pais}
              onChange={(e) => setPais(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEstado"  className="S-subtitle">
            <Form.Label>Estado:</Form.Label>
            <Form.Control  className="S-entry"
              type="text"
              placeholder="Estado"
              value={Usuario_estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />
            
          </Form.Group>
          <Form.Group controlId="formCiudad"  className="S-subtitle">
            <Form.Label>Ciudad:</Form.Label>
            <Form.Control  className="S-entry"
              type="text"
              placeholder="Ciudad"
              value={Usuario_ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </Form.Group>  
          <Form.Group controlId="formColonia"  className="S-subtitle">
            <Form.Label>Colonia:</Form.Label>
            <Form.Control  className="S-entry"
              type="text"
              placeholder="Colonia"
              value={Usuario_colonia}
              onChange={(e) => setColonia(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCalle"  className="S-subtitle">
            <Form.Label >Calle:</Form.Label>
            <Form.Control  className="S-entry"
              type="text"
              placeholder="Calle"
              value={Usuario_calle}
              onChange={(e) => setCalle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCP" className="S-subtitle">
            <Form.Label>Código Postal:</Form.Label>
            <Form.Control
              className="S-entry"
              type="text"
              placeholder="Código Postal"
              value={Usuario_CP}
              onChange={(e) => setCP(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNexte"  className="S-subtitle">
            <Form.Label>Número Exterior:</Form.Label>
            <Form.Control  className="S-entry"
              type="text"
              placeholder="Número Exterior"
              value={Usuario_Nexte}
              onChange={(e) => setNexte(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formNint"  className="S-subtitle">
            <Form.Label>Número Interior (opcional):</Form.Label>
            <Form.Control  className="S-entry"
              type="text"
              placeholder="Número Interior"
              value={Usuario_Nint}
              onChange={(e) => setNint(e.target.value)}
            />
          </Form.Group>
          <Form.Group >
            <Form.Label className="S-subtitle">Indicaciones del domicilio:</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Escribir una descripción general del exterior del domicilio"
              rows={3}
              value={Usuario_indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
            />
          </Form.Group>
          <Button
            style={{}}
            variant="primary"
            className="S-buttonSignup"
            type="submit"
            onClick={submit}
          >
            Registrarse
          </Button>
        </Form.Group>
      </Form>
              
      <div></div>
    </div>
  );
}
export default Signup;
