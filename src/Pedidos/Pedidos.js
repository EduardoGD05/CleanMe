import React, { useState, useEffect } from 'react';
import { Container, Form, Button, InputGroup, ButtonGroup, ToggleButton, Modal} from 'react-bootstrap';
import "./Pedidos.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Importa el contexto de autenticación
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap

function Pedido() {
  const { isLoggedIn, IDusuario, Usuario_pais, Usuario_estado, Usuario_ciudad, Usuario_colonia, Usuario_calle, Usuario_CP, Usuario_Nexte, Usuario_Nint, Usuario_indicaciones } = useAuth(); // Obtén el estado de autenticación y el usuario desde el contexto de autenticación
  // Verifica si el usuario está autenticado antes de acceder a sus datos
  const usuarioID = isLoggedIn ? IDusuario : null; 

  const [productos, setProductos] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [peso, setPeso] = useState(0);
  const [prendas, setPrendas] = useState(0);
  const [estado, setEstado] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [colonia, setColonia] = useState('');
  const [calle, setCalle] = useState('');
  const [CP, setCP] = useState('');
  const [Nexte, setNumExterior] = useState('');
  const [Nint, setNumInterior] = useState('');
  const [especificaciones, setEspecificaciones] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [pago, setPago] = useState(0);

  const [radioValue, setRadioValue] = useState("1");
  const [showModal, setShowModal] = useState(false);

    // Estado para almacenar los productos seleccionados
    const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      setPais(Usuario_pais || '');
      setEstado(Usuario_estado || '');
      setCiudad(Usuario_ciudad || '');
      setColonia(Usuario_colonia || '');
      setCalle(Usuario_calle || '');
      setCP(Usuario_CP || '');
      setNumExterior(Usuario_Nexte || '');
      setNumInterior(Usuario_Nint || '');
      setIndicaciones(Usuario_indicaciones || '')
    }
  }, [isLoggedIn]);

  const obtenerInfoProducto = async () => {
    try {
      const res = await axios.get("http://localhost:3000/servicios/info_producto");
      setProductos(res.data);
      const initialCheckedItems = res.data.reduce((acc, producto) => {
        acc[producto.Producto_descripcion.replace(/ /g, '')] = 0;
        return acc;
      }, {});
      setCheckedItems(initialCheckedItems);
    } catch (error) {
      console.error("Error al obtener el precio de los productos:", error);
    }
  };


  useEffect(() => {
    obtenerInfoProducto(); 
  }, []);

  const handleCheckboxChange = (producto) => {
    const updatedCheckedItems = {
      ...checkedItems,
      [producto]: checkedItems[producto] ? 0 : 1
    };
    setCheckedItems(updatedCheckedItems);
  
    // Remove the product from selectedProducts when unchecked
    if (!checkedItems[producto]) {
      setSelectedProducts(selectedProducts.filter(product => product.name !== producto));
    }
  };
  

  const handleProductChange = (e, producto) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue >= 0 && newValue <= 1000) {
      setCheckedItems({
        ...checkedItems,
        [producto]: newValue
      });
    }
  };
   
  const [totalPago, setTotalPago] = useState(0);
  const [totalPeso, setTotalPeso] = useState(0);
  const [totalPrendas, setTotalPrendas] = useState(0);

  useEffect(() => {
    let pago = 0;
    let peso = 0;
    let prendas = 0;

    productos.forEach(producto => {
      const productKey = producto.Producto_descripcion.replace(/ /g, '');
      const cantidad = checkedItems[productKey];
      if (cantidad > 0) {
        pago += producto.Producto_precio * cantidad;
        peso += producto.Producto_peso * cantidad;
        prendas += cantidad;
      }
    });

    setTotalPago(pago);
    setTotalPeso(peso);
    setTotalPrendas(prendas);
  }, [productos, checkedItems]);

  const handleOpenModal = () => {
    if (totalPrendas > 0 && usuarioID != null) {
      // Generar la lista de productos seleccionados a partir de los productos y checkedItems
      const newSelectedProducts = productos.map(producto => {
        const productKey = producto.Producto_descripcion.replace(/ /g, '');
        const cantidad = checkedItems[productKey];
        if (cantidad > 0) {
          return {
            id: producto.IDproducto,
            name: producto.Producto_descripcion,
            price: producto.Producto_precio,
            quantity: cantidad,
          };
        }
        return null;
      }).filter(product => product !== null);
  
      // Actualizar la lista de productos seleccionados
      setSelectedProducts(newSelectedProducts);
  
      // Abrir el modal
      setShowModal(true);
    } else {
      if(usuarioID == null)
        alert("Debe iniciar sesión"); 
      else 
      alert("El pedido debe contener al menos una prenda.");
      
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

    // Función para eliminar un producto del pedido
    const handleDeleteProduct = (productId,productName) => { 
      setSelectedProducts(selectedProducts.filter(product => product.id !== productId));
      handleCheckboxChange(productName.replace(/ /g, ''))
    };
  
    // Función para editar la cantidad de un producto en el pedido
    const handleEditQuantity = (productId, newQuantity) => {
      setSelectedProducts(selectedProducts.map(product => {
        if (product.id === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      })); 
    };
 
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try { 
        // Crear el pedido en la tabla Pedido
        const resPedido = await axios.post("http://localhost:3000/servicios/pedidos", {
            IDusuario,
            IDsucursal: 1,
            IDtiposervicio: parseInt(radioValue),
            Pedido_pago: totalPago,
            Pedido_especificaciones: especificaciones,
            Pedido_indicaciones: indicaciones,
            Pedido_pais: pais,
            Pedido_estado: estado,
            Pedido_ciudad: ciudad,
            Pedido_colonia: colonia,
            Pedido_calle: calle,
            Pedido_CP: CP,
            Pedido_Nexte: Nexte,
            Pedido_Nint: Nint
        }); 

        let IDpedido = resPedido.data.IDpedido
        console.log(resPedido.data.IDpedido);
        console.log(IDpedido)  
        for (const producto of productos) {
          const productKey = producto.Producto_descripcion.replace(/ /g, '');
          const cantidad = checkedItems[productKey];
          const IDproducto = producto.IDproducto
          console.log(cantidad)
          console.log(productKey)
          console.log("ID P",IDproducto,"Peso",producto.Producto_peso * cantidad,"Precio",producto.Producto_precio * cantidad)
        
          if (cantidad > 0) { 
              await axios.post("http://localhost:3000/servicios/pedidoproducto", {
                  IDproducto,
                  IDpedido,
                  Pedido_peso: producto.Producto_peso * cantidad,
                  Pedido_cantidad: cantidad,
                  Pedido_precio: producto.Producto_precio * cantidad
              });
          }/**/
      }
        alert(`Pedido registrado exitosamente. Peso total: ${totalPeso} kg, Cantidad de prendas: ${totalPrendas}, Pago total: $${totalPago}`);
          // Cierra el modal
        handleCloseModal(); 
    } catch (error) {
        console.error("Error al enviar el pedido:", error);
        alert("Error al enviar el pedido: " + error);
    }
};


  return (
    <Container>
      <header>
        <h1 id='TituloPedido'>Hacer un Pedido</h1>
      </header>
      <main>
        <Form onSubmit={handleSubmit}>
          <Row id='DetallesPedido'> 
            <Col md="auto" id="ColBorder">
              <header>
                <h1>Detalles del Pedido</h1>
              </header>
              <div className="justify-content-center">
                <ButtonGroup id="RadioTipoServicio">
                  {['Color', 'Blanco', 'Mixto'].map((name, idx) => (
                    <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant='outline-primary'
                      name="radio"
                      value={String(idx + 1)}
                      checked={radioValue === String(idx + 1)}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
              {radioValue === "3" && (
                <div id='TextoPedido'>
                  <p>Favor de separar la ropa por colores al momento de entregarla</p>
                </div>
              )}
              {productos.map((producto) => {
                const productKey = producto.Producto_descripcion.replace(/ /g, '');
                return (
                  <InputGroup className="checkbox-container" key={producto.IDproducto}>
                    <Form.Check
                      type="checkbox"
                      checked={!!checkedItems[productKey]}
                      onChange={() => handleCheckboxChange(productKey)}
                      className="checkbox-input"
                    />
                    {!!checkedItems[productKey] && (
                      <React.Fragment>
                        <Form.Control
                          type="number"
                          value={checkedItems[productKey]}
                          onChange={(e) => handleProductChange(e, productKey)}
                          min={0}
                          max={100}
                          placeholder="0"
                          required
                        />
                      </React.Fragment>
                    )}
                    <InputGroup.Text className={`input-group-text ${!!checkedItems[productKey] ? 'rounded-all' : 'rounded'}`}>{producto.Producto_descripcion}</InputGroup.Text>
                  </InputGroup>
                );
              })}

              <Form.Group controlId="formPrendas">
                <Form.Label>Cantidad de prendas:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={totalPrendas}
                    min={0}
                    max={100}
                    placeholder="0"
                    readOnly
                  />
                  <InputGroup.Text>Prendas</InputGroup.Text>
                </InputGroup>
                <Form.Label>Peso en Kilos:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    value={totalPeso}
                    min={0}
                    max={32}
                    placeholder="0"
                    readOnly
                  />
                  <InputGroup.Text>Kg</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formPago">
                <Form.Label>Pago:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={totalPago}
                    readOnly
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Form.Group>
           
            </Col>
            <Col id="middleCol">
            </Col>
            <Col md="auto">
              <header>
                <h1>Dirección del Pedido</h1>
              </header>
              <Form.Group controlId="formPais">
                <Form.Label>País:</Form.Label>
                <Form.Control
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  required
                />
                <Form.Group controlId="formEstado">
                  <Form.Label>Estado:</Form.Label>
                  <Form.Control
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="formCiudad">
                <Form.Label>Ciudad:</Form.Label>
                <Form.Control
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formColonia">
                <Form.Label>Colonia:</Form.Label>
                <Form.Control
                  type="text"
                  value={colonia}
                  onChange={(e) => setColonia(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCalle">
                <Form.Label>Calle:</Form.Label>
                <Form.Control
                  type="text"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCP">
                <Form.Label>Código Postal:</Form.Label>
                <Form.Control
                  type="text"
                  value={CP}
                  onChange={(e) => setCP(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNexte">
                <Form.Label>Número Exterior:</Form.Label>
                <Form.Control
                  type="text"
                  value={Nexte}
                  onChange={(e) => setNumExterior(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formNint">
                <Form.Label>Número Interior:</Form.Label>
                <Form.Control
                  type="text"
                  value={Nint}
                  onChange={(e) => setNumInterior(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formIndicaciones">
                <Form.Label>Indicaciones:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={indicaciones}
                  onChange={(e) => setIndicaciones(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formEspecificaciones">
                <Form.Label>Especificaciones:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={especificaciones}
                  onChange={(e) => setEspecificaciones(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div id="buttonPedido">
          <Button variant="primary" onClick={handleOpenModal}>
            Ver resumen del pedido
          </Button>
   <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Resumen del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  {/* Table to display selected products with quantity, price per quantity, and total */}
  <div className="table-responsive">
    <table className="table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio por Unidad</th> 
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {selectedProducts.map(product => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>
              {/* Input to edit the quantity of the product */}
              <input 
                type="number" 
                value={checkedItems[product.name.replace(/ /g, '')]} 
                onChange={(e) =>  handleProductChange(e, product.name.replace(/ /g, ''))} //handleEditQuantity(product.id, parseInt(e.target.value))
                className="form-control"
              />
            </td>
            <td>${product.price.toFixed(2)}</td> 
            <td>
              {/* Button to delete the product */}
              <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id, product.name)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
        {/* Row for displaying total cost of the order */}
        <tr>
          <td colSpan="1"></td>
          <td><strong>Total Pedido:</strong></td>
          <td>${totalPago.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>
</Modal.Body>



        <Modal.Footer>
          {/* Botón para enviar el pedido */}
          <Button variant="primary" onClick={handleSubmit}>
            Enviar Pedido
          </Button>
          {/* Botón para cerrar el modal */}
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal> 
          </div>
        </Form>
      </main>
    </Container>
  );
}

export default Pedido;
