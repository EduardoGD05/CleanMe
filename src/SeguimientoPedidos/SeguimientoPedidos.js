import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import ProductModal from '../ProductModal/ProductModal';
import "./SeguimientoPedidos.css"

function Seguimiento() {
  const { isLoggedIn, IDusuario, Usuario_email } = useAuth();
  const usuario = isLoggedIn ? IDusuario : null;
  const [seguimientoPedidos, setSeguimientoPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      obtenerSeguimientoPedidos();
    }
  }, [isLoggedIn, IDusuario]);

  const obtenerSeguimientoPedidos = async () => {
    try {
      if (isLoggedIn && usuario) {
        const res = await axios.get(`http://localhost:3000/Seguimiento/${usuario}`);
        const seguimientoData = Array.isArray(res.data) ? res.data : [];
        setSeguimientoPedidos(seguimientoData);
      }
    } catch (error) {
      console.error("Error al obtener el seguimiento de pedidos:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleCancelOrder = async (pedidoId) => {
    try {
      await axios.delete(`http://localhost:3000/servicios/CancelarPedido/${pedidoId}`);
      setSeguimientoPedidos(seguimientoPedidos.filter(pedido => pedido.IDpedido !== pedidoId));
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
    }
  };

  const handleOpenModal = (pedidoId) => {
    setPedidoId(pedidoId); 
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const updatePedido = async (pedidoId, updatedProducts) => {
    try {
      // Iterar sobre los productos actualizados
      for (const updatedProduct of updatedProducts) {
        // Enviar una solicitud PUT al servidor para actualizar el producto en el pedido
        await axios.put(`http://localhost:3000/servicios/pedidoproducto/:IDproducto/${pedidoId}`, updatedProduct);
      }
  
      // Registro de éxito
      console.log("Pedido actualizado:", pedidoId, updatedProducts);
    } catch (error) {
      // Manejo de errores
      console.error("Error al actualizar el pedido:", error);
    }
  };
  

  return (
    <Container>
      <h1>Seguimiento de Pedidos</h1>
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
            <th>Dirección</th>
            <th>Detalles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {seguimientoPedidos.map((pedido) => (
            <tr key={pedido.IDpedido}>
              <td>{pedido.IDpedido}</td>
              <td>{Usuario_email}</td>
              <td>Booble Clean 6644567890</td>
              <td>{pedido.Servicio}</td>
              <td>{pedido.Pedido_especificaciones}</td>
              <td>{formatCurrency(pedido.Pedido_pago)}</td>
              <td>{pedido.Pedido_fechaReg}</td>
              <td>{pedido.Pedido_pais + ", " + pedido.Pedido_estado + ", " + pedido.Pedido_ciudad + ", " + pedido.Pedido_colonia + ", " + pedido.Pedido_calle + ", " + pedido.Pedido_CP + ", #" + pedido.Pedido_Nexte}{pedido.Pedido_Nint !== "" ? ", " + pedido.Pedido_Nint : ""}</td>
              <td>{pedido.Productos}</td>
              <td>
                <div>
                  <Button variant="danger" className="custom-button cancel" onClick={() => handleCancelOrder(pedido.IDpedido)}>Cancelar</Button>
                  <Button className="custom-button modify" onClick={() => handleOpenModal(pedido.IDpedido)}>Modificar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ProductModal show={showModal} handleClose={handleCloseModal} pedidoId={pedidoId} updatePedido={updatePedido} />
    </Container>
  );
}

export default Seguimiento;
