import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VisualizarOrdenServicio.css'; 

const VisualizarOrdenServicio = ({ sucursalId }) => {
  const [ordenesServicio, setOrdenesServicio] = useState([]);

  useEffect(() => {
    obtenerOrdenesServicio();
  }, []);

  const obtenerOrdenesServicio = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/servicios/ver_orden_servicio`, {
        params: { idsucursal: sucursalId }
      });
      setOrdenesServicio(response.data);
    } catch (error) {
      console.error("Error al obtener órdenes de servicio:", error);
    }
  };

  return (
    <div className="ordenes-servicio-container">
      <h1>Órdenes de Servicio de la Sucursal {sucursalId}</h1>
      <table className="ordenes-servicio-table">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>ID Pedido</th>
            <th>ID Empleado</th>
            <th>Nombre Empleado</th>
            <th>ID Usuario</th>
            <th>Nombre Usuario</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ordenesServicio.map((orden) => (
            <tr key={orden.IDordenservicio}>
              <td>{orden.IDordenservicio}</td>
              <td>{orden.IDpedido}</td>
              <td>{orden.IDempleado}</td>
              <td>{orden.NombreEmpleado}</td>
              <td>{orden.IDusuario}</td>
              <td>{orden.NombreUsuario}</td>
              <td>{orden.fechaOS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisualizarOrdenServicio;
