import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdenPago.css'; // Importa el archivo de estilos CSS

const OrdenesDePago = () => {
  const [pedidos, setPedidos] = useState([]);
  const [IDempleado, setIDempleado] = useState(1); 
  const [IDusuario, setIDusuario] = useState(null); 
  const [IDpedido, setIdpedido] = useState(null); 

  useEffect(() => {
    obtenerPedidosPendientes();
  }, []);

  const obtenerPedidosPendientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/servicios/pedidos_pendientes");
      // Agregar la propiedad 'habilitado' a cada pedido
      const pedidosConHabilitado = response.data.map(pedido => ({
        ...pedido,
        habilitado: true // Inicialmente habilitado
      }));
      setPedidos(pedidosConHabilitado);
    } catch (error) {
      console.error("Error al obtener pedidos pendientes:", error);
    }
  };

  const handleAction = async (IDpedido, IDusuario) => {
    try {
      const response = await axios.post("http://localhost:3000/servicios/orden_de_pago", { IDpedido, IDempleado, IDusuario  });
      console.log(response.data); 
      alert("¡La orden de servicio se creó exitosamente! #" + IDpedido);
      // Deshabilitar la fila correspondiente después de hacer clic en el botón
      setPedidos(prevPedidos => prevPedidos.map(pedido => pedido.IDpedido === IDpedido ? { ...pedido, habilitado: false } : pedido));
    } catch (error) {
      console.error("Error al realizar la acción en el pedido:", error);
    }
  };

  return (
    <div className="ordenes-de-pago-container">
      <h1>Órdenes de Servicio</h1>
      <table className="ordenes-de-pago-table">
        <thead>
          <tr>
            <th>ID Pedido</th> 
            <th>Sucursal y Teléfono</th> 
            <th>Tipo de Lavado</th> 
            <th>Especificaciones</th>
            <th>Pago</th>
            <th>Fecha Inicio</th> 
            <th>Dirección</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className={!pedido.habilitado ? 'fila-deshabilitada' : ''}>
              <td>{pedido.IDpedido}</td> 
              <td> Booble Clean  6644567890</td>
              <td>{pedido.Servicio}</td> 
              <td>{pedido.Pedido_especificaciones}</td>
              <td>${pedido.Pedido_pago}.00</td>
              <td>{pedido.Pedido_fechaReg}</td> 
              <td>{pedido.Pedido_pais +", "+pedido.Pedido_estado+", "+pedido.Pedido_ciudad+", "+pedido.Pedido_colonia+", "+pedido.Pedido_calle+", "+pedido.Pedido_CP+", #"+pedido.Pedido_Nexte}{pedido.Pedido_Nint !== "" ? ", " + pedido.Pedido_Nint : ""}</td>
              
              <td>
                <button onClick={() => handleAction(pedido.IDpedido, pedido.IDusuario)} disabled={!pedido.habilitado}>Finalizar Orden de Servicio</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdenesDePago;
