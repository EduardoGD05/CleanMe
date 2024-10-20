import React, { useState } from "react";
import "./NavBar.css";
import {  Button, Navbar, Nav, NavDropdown  } from "react-bootstrap";
import { Link } from "react-router-dom";
import CleanMeLogo from "../Assets/CleanMeLogo.png"
//import Logo from "../../src/assets/img/LogoGalgo.png";
import { useAuth } from "../AuthContext";

function NavScroll() {
  const { isLoggedIn, logout, IDusuario } = useAuth(); 
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const usuario = isLoggedIn ? IDusuario : null;

  console.log("Navbar:",usuario)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Puedes agregar lógica adicional después de cerrar sesión si es necesario
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Navbar className="Navbar" expand="lg"> 
        <Nav.Link className="NavBarTitle" as={Link} to="/" id="Home">
          <img src={CleanMeLogo} alt="" className="logo-image" />
          Clean Me
        </Nav.Link> 
         <Navbar.Toggle aria-controls="responsive-navbar-nav" id="toggle" />
      <Navbar.Collapse id="responsive-navbar-nav">
      
        <Nav className="Nav" navbarScroll>
        <Nav.Link as={Link} to={`/seguimiento_pedidos/${usuario}`}  className="navbar-item">
            Seguimiento de Pedidos
          </Nav.Link>
        <NavDropdown title="Servicios" id="nav-dropdown">
          <NavDropdown.Item as={Link} to="/servicios/pedidos">Pedidos</NavDropdown.Item> 
          <NavDropdown.Item as={Link} to={`/servicios/historial/${usuario}`}>Historial</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to={`/servicios/orden_de_servicio`}>Orden de Servicio (Empleado)</NavDropdown.Item>
          <NavDropdown.Item as={Link} to={`/servicios/ver_orden_servicio`}>Ver Ordenes de Servicio (Empleado)</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/servicios/ChatBot">ChatBot</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/servicios/Mapa">Mapas</NavDropdown.Item>  

        </NavDropdown>
          <Nav.Link as={Link} to="/crear_cuenta" className="navbar-item">
            Crear Cuenta
          </Nav.Link>
          <Nav.Link as={Link} to="/iniciar_sesion" className="navbar-item">
            Iniciar Sesión
          </Nav.Link>
          <Nav.Link
            className="navbar-item"
            onClick={handleLogout}
            disabled={!isLoggedIn || isLoggingOut}>
            Cerrar Sesión
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavScroll;
