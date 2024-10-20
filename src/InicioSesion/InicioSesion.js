import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation, useNavigate } from "react-router-dom";
import "./InicioSesion.css";
import axios from "axios";
import { useAuth } from "../AuthContext";

function Login() {
  const [identificador, setIdentificador] = useState("");
  const [Usuario_contraseña, setContraseña] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login } = useAuth(); // Obtén las funciones e información del contexto
  

  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();

    if (isLoading) return;
    
    try {
      setIsLoading(true); 

      const res = await axios.post("http://localhost:3000/iniciar-sesion", {
        identificador,
        Usuario_contraseña,
      });

      if (res.status === 200) {
        // Actualizar el estado de inicio de sesión
        login(res.data);  
 
        if (location.state && location.state.fromBook) {
          // Si la ruta anterior es "/book/", redirige a esa ruta
          navigate(-1);
        } else {
          // Si la ruta anterior no es "/book/", redirige a la raíz
          navigate("/servicios/pedidos");
        }
      } else {
        alert("Inicio de sesión fallido");
      }
    } catch (error) {
      alert("Error en el inicio de sesión");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="title"> Iniciar Sesión </h1>
      <Form id="FormLogin">
        <Form.Group className="format">
          <Form.Group itemID="Email" className="subtitle">
            <Form.Label>Correo electrónico o Nombre de usuario</Form.Label>
          </Form.Group>

          <Form.Group className="box">
            <Form.Control
              className="L-entry"
              type="text"
              onChange={(e) => {
                setIdentificador(e.target.value); 
              }}
              placeholder="Correo Electrónico o Usuario"
            />
          </Form.Group>

          <Form.Group className="subtitle">
            <Form.Label>Contraseña </Form.Label>
          </Form.Group>

          <Form.Group className="box">
            <Form.Control
              className="L-entry"
              type="password"
              onChange={(e) => {
                setContraseña(e.target.value);
              }}
              placeholder="Contraseña"
            />
          </Form.Group>
          <Button
            style={{
              paddingBottom: "10px",
              paddingTop: "10px",
              paddingLeft: "30px",
              paddingRight: "30px",
              fontWeight: "bold",
            }}
            variant="primary"
            className="buttonLogin"
            type="submit"
            onClick={submit}
            disabled={isLoading || isLoggedIn}
          >
           {isLoading ? "Cargando..." : "Entrar"}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
export default Login;
