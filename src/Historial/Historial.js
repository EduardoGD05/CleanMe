import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Importa el contexto de autenticación

function Historial() {
  const { isLoggedIn,IDusuario, Usuario_email } = useAuth(); // Obtén el estado de autenticación y el usuario desde el contexto de autenticación
  // Verifica si el usuario está autenticado antes de acceder a sus datos
  const usuario = isLoggedIn ? IDusuario : null;
  
  const [historialPedidos, setHistorialPedidos] = useState([]); 

  useEffect(() => {
    if (isLoggedIn) {
      // Obtener historial de pedidos del usuario autenticado
      obtenerHistorialPedidos(); 
      
    }
  }, [isLoggedIn, IDusuario]);

  const obtenerHistorialPedidos = async () => {
    try {
      if (isLoggedIn && usuario) {
        const res = await axios.get(`http://localhost:3000/historial/${usuario}`);
        console.log("Historial:",res.data)
        const historialData = Array.isArray(res.data) ? res.data : []; // Verifica si la respuesta es un array
        setHistorialPedidos(historialData);
      }
    } catch (error) {
      console.error("Error al obtener el historial de pedidos:", error);
    }
  };

  const formatCurrency = (amount) => {
    // Formatea el monto del pago con el símbolo de la moneda y el formato adecuado
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <Container>
      <h1>Historial de Pedidos</h1>
      <Table striped bordered hover>
      <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Correo Cliente</th>
            <th>Sucursal y Teléfono</th> 
            <th>Tipo de Lavado</th> 
            <th>Especificaciones</th>
            <th>Pago</th>
            <th>Fecha Inicio</th> 
            <th>Fecha Fin</th>
            <th>Dirección</th>
            <th>Detalles</th>
            
            {/* Agrega más columnas según sea necesario */}
          </tr>
        </thead>
        <tbody>
          {historialPedidos.map((pedido) => (
            <tr key={pedido.IDpedido}>
              <td>{pedido.IDpedido}</td>
              <td>{Usuario_email}</td>
              <td> Booble Clean  6644567890</td>
              <td>{pedido.Servicio}</td> 
              <td>{pedido.Pedido_especificaciones}</td>
              <td>{formatCurrency(pedido.Pedido_pago)}</td>
              <td>{pedido.Pedido_fechaReg}</td> 
              <td>{pedido.Pedido_fechaFin}</td>
              <td>{pedido.Pedido_pais +", "+pedido.Pedido_estado+", "+pedido.Pedido_ciudad+", "+pedido.Pedido_colonia+", "+pedido.Pedido_calle+", "+pedido.Pedido_CP+", #"+pedido.Pedido_Nexte}{pedido.Pedido_Nint !== "" ? ", " + pedido.Pedido_Nint : ""}</td>
              <td>{pedido.Productos}</td>
              {/* ,pedido.Pedido_estado,pedido.Pedido_ciudad,pedido.Pedido_colonia,,pedido.Pedido_calle,pedido.Pedido_cp,pedido.Pedido_Nexte,pedido.Pedido_Nint */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Historial;
