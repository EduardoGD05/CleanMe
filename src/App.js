import './App.css';
import { Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useAuth } from './AuthContext'; // Importa el hook useAuth


const introStyle = {
  display: "flex",
  justifyContent: "center", // Centra horizontalmente
  alignItems: "center", // Centra verticalmente
  margin: "auto",
  left: "100px",
  right: "100px", 
  padding: "20px", 
  maxWidth: "900px",
  minWidth: "400px", 
};

function App() {
  const { isLoggedIn } = useAuth(); // Obten el estado de inicio de sesión del contexto de autenticación

  return (
    <div className="App" style={introStyle}>  
    <main>
        <h1 id='Titulo'>Clean Me</h1>  

          <h1>Bienvenido a Clean Me</h1>
          <p>Clean this for me</p>
              {/* Redirige al usuario a la página de inicio de sesión si no ha iniciado sesión */}
        {isLoggedIn ? (
          <Nav.Link as={Link} to="/servicios/pedidos" className="navbar-item">Pedir Ahora</Nav.Link>
        ) : (
          <Nav.Link as={Link} to="/iniciar_sesion" className="navbar-item">Iniciar Sesión</Nav.Link>
        )}
          <h2>Nuestros Servicios</h2>
          <ul>
            <li>Lavado y Planchado</li>
            <li>Limpieza en Seco</li>
            <li>Arreglos de Costura</li>
          </ul>  
          <h2>¿Cómo Funciona?</h2>
          <p>1. Haz tu pedido por peso</p>
          <p>2. Proporciona tu dirección</p>
          <p>3. Nosotros recogemos y entregamos</p> 
          <h2>Contacto</h2>
          <p>Para más información, contáctanos en:</p>
          <p>Email: info@cleanme.com</p>
          <p>Teléfono: 123-456-7890</p>  

        <p>&copy; 2024 Clean Me. Todos los derechos reservados.</p> 
        </main>
    </div>
    
  );
}

export default App;
