import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function ProductModal({ show, handleClose, pedidoId, updatePedido }) {
  const [productos, setProductos] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [totalPago, setTotalPago] = useState(0);

  const obtenerInfoProducto = async () => {
    try {
      const res = await axios.get("http://localhost:3000/servicios/info_producto");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener el precio de los productos:", error);
    }
  };

  useEffect(() => {
    if (show && pedidoId !== null) {
      obtenerProductosDelPedido(pedidoId);
      obtenerInfoProducto();
    }
  }, [show, pedidoId]);

  const obtenerProductosDelPedido = async (pedidoId) => {
    try {
      const res = await axios.get(`http://localhost:3000/servicios/productos/${pedidoId}`);
      const pedidoProductos = res.data.reduce((acc, producto) => {
        acc[producto.IDproducto] = producto.Pedido_cantidad;
        return acc;
      }, {});
      setCheckedItems(pedidoProductos);
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos del pedido:", error);
    }
  };

  useEffect(() => {
    let total = 0;

    productos.forEach(producto => {
      const cantidad = checkedItems[producto.IDproducto] || 0;
      total += producto.Producto_precio * cantidad;
    });

    setTotalPago(total);
  }, [productos, checkedItems]);

  const handleProductChange = (e, productId) => {
    const { value } = e.target;
    setCheckedItems(prevState => ({
      ...prevState,
      [productId]: parseInt(value, 10) || 0
    }));
  };

  const handleSubmit = async () => {
    const selectedProducts = productos.map(producto => {
      const quantity = checkedItems[producto.IDproducto] || 0;
      return {
        id: producto.IDproducto,
        name: producto.Producto_descripcion,
        price: producto.Producto_precio,
        weight: producto.Producto_peso,
        quantity: quantity,
      };
    }).filter(product => product.quantity > 0);

    try {
      for (const product of selectedProducts) {
        if (product.quantity > 0) { 
          const pedido_peso = product.weight * product.quantity;
 
            // Update existing product
            await axios.put(`http://localhost:3000/servicios/pedidoproducto/${product.id}/${pedidoId}`, {
              Pedido_peso: pedido_peso,
              Pedido_cantidad: product.quantity,
              Pedido_precio: product.price,
            }); 
            // Create new product
            await axios.post(`http://localhost:3000/servicios/pedidoproducto`, {
              IDproducto: product.id,
              IDpedido: pedidoId,
              Pedido_peso: pedido_peso,
              Pedido_cantidad: product.quantity,
              Pedido_precio: product.price,
            });
          
        }
      }

      // Actualizar el pago del pedido
      await axios.put(`http://localhost:3000/servicios/pedidos/pago/${pedidoId}`, { nuevoPago: totalPago });

    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Resumen del Pedido</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio por Unidad</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(product => (
                <tr key={product.IDproducto}>
                  <td>{product.Producto_descripcion}</td>
                  <td>
                    <input
                      type="number"
                      value={checkedItems[product.IDproducto] || 0}
                      onChange={(e) => handleProductChange(e, product.IDproducto)}
                      className="form-control"
                      min="0"
                    />
                  </td>
                  <td>${product.Producto_precio}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2"><strong>Total Pedido:</strong></td>
                <td>${totalPago.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Enviar Pedido
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductModal;
