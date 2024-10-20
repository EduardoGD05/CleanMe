const express = require('express'),
    dbOperation = require('./dbFiles/dbOperation'),
    cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

dbOperation.getUsers().then(res => {console.log(res.recordset);
}) 

app.post('/usuario', async (req, res) => { 
    const { Usuario_email, Usuario_nombre } = req.body;
  
    try {
      const usuarioExistente = await dbOperation.searchUser(Usuario_email, Usuario_nombre);
  
      if (usuarioExistente === 'exists') {
        res.status(200).send('exist'); // Usuario encontrado
      } else {
        res.status(200).send('notexist'); // Usuario no encontrado
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al verificar usuario" });
    }
  });

// Crear un nuevo usuario
app.post('/registro', async (req, res) => {
    const { Usuario_nombre,
        Usuario_email,
        Usuario_contraseña,
        Usuario_pais,
        Usuario_estado, 
        Usuario_ciudad, 
        Usuario_colonia,
        Usuario_calle, 
        Usuario_CP, 
        Usuario_Nexte,
        Usuario_Nint,
        Usuario_indicaciones} = req.body;

    try {
        
        await dbOperation.createUser(req.body); 
        res.status(201).json({ message: "Usuario creado exitosamente" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear usuario" });
    }
});

// Endpoint para verificar las credenciales del usuario al iniciar sesión
app.post('/iniciar-sesion', async (req, res) => {
    const { identificador, 
        Usuario_contraseña } = req.body;

    try {
        const user = await dbOperation.getUserByCredentials(identificador, Usuario_contraseña);

        if (user) {
            res.status(200).json({ user }); // Envía los datos del usuario al cliente
        } else {
            res.status(401).json({ message: "Credenciales inválidas. Inicio de sesión fallido." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al verificar las credenciales del usuario." });
    }
});

app.post('/servicios/pedidos', async (req, res) => {
    const { IDusuario, 
        IDsucursal, 
        IDtiposervicio,  
        Pedido_pago, 
        Pedido_especificaciones, 
        Pedido_indicaciones, 
        Pedido_pais, 
        Pedido_estado, 
        Pedido_ciudad, 
        Pedido_colonia,
        Pedido_calle,
        Pedido_CP, 
        Pedido_Nexte,
        Pedido_Nint} = req.body;

    try {  
        // Create the pedido in the database using the received data
        const IDpedido = await dbOperation.createPedido(req.body); 

        // Respond with a success message
        res.status(201).json({ message: "Pedido registrado exitosamente #",IDpedido });
    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        res.status(500).json({ message: "Error al procesar el pedido" });
    }
});

app.get('/servicios/info_producto', async (req, res) => { 
    try {  
        // Get the price and weight of the product from the database
        const productInfo = await dbOperation.getConsultaInfoProducto(); 
        res.json(productInfo); 
    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        res.status(500).json({ message: "Error al procesar el pedido" });
    }
});

// Ruta para registrar un producto en el pedido
app.post('/servicios/pedidoproducto', async (req, res) => {
    const { IDproducto, IDpedido, Pedido_peso, Pedido_cantidad, Pedido_precio } = req.body;
    try{ 
        
        await dbOperation.createPedidoProducto(req.body);
        res.status(201).json({message: "Productos registrados exitosamente"})
    }catch (error){
        console.error('Error al insertar productos en el pedido (Pedidoproducto):', error);
        res.status(500).json({ message: 'Error al insertar productos en el pedido' }); 
    } 
   
  });
  // Ruta para actualizar un producto en el pedido
app.put('/servicios/pedidoproducto/:IDproducto/:IDpedido', async (req, res) => {
    const { IDproducto, IDpedido } = req.params;
    const { Pedido_peso, Pedido_cantidad, Pedido_precio } = req.body;
    try { 
        await dbOperation.updatePedidoProducto(IDproducto, IDpedido, req.body);
        res.status(200).json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error('Error al actualizar producto en el pedido (Pedidoproducto):', error);
        res.status(500).json({ message: 'Error al actualizar producto en el pedido' });
    }
});
 
app.get('/Seguimiento/:userId', async (req, res) => {
    try {
        const IDusuario = req.params.userId;
        const seguimientoPedidos = await dbOperation.obtenerSeguimiento(IDusuario);
        res.json(seguimientoPedidos);
    } catch (error) {
        console.error('Error al obtener el Seguimiento de pedidos:', error);
        res.status(500).json({ error: 'Error al obtener el Seguimiento de pedidos' });
    }
});

// Ruta para obtener el historial de pedidos de un usuario
app.get('/historial/:userId', async (req, res) => {
    try {
        const IDusuario = req.params.userId;
        const historialPedidos = await dbOperation.obtenerHistoria(IDusuario);
        res.json(historialPedidos);
    } catch (error) {
        console.error('Error al obtener el historial de pedidos:', error);
        res.status(500).json({ error: 'Error al obtener el historial de pedidos' });
    }
});

app.post('/servicios/orden_de_pago', async (req, res) => {
    try { 
        const { IDpedido, 
            IDempleado, 
            IDusuario } = req.body;

        if (!IDpedido || !IDempleado || !IDusuario) {
            return res.status(400).json({ error: 'Faltan parámetros para crear la orden de servicio' });
        }

        const Ordenservicio = await dbOperation.createOrdenServicio(IDpedido, IDempleado, IDusuario);
        // Crear la orden de servicio
        
        const ActualizarFechaFin = await dbOperation.actualizarFechaFin(IDpedido);
        // Actualizar la fecha de finalización del pedido
        
        res.json({ Ordenservicio, ActualizarFechaFin });
    } catch (error) {
        console.error('Error al procesar la orden de pago:', error);
        res.status(500).json({ error: 'Error al procesar la orden de pago' });
    }
});

// Ruta para obtener los pedidos pendientes por sucursal
app.get('/servicios/pedidos_pendientes', async (req, res) => {
    const IDsucursal = req.params.IDsucursal;

    try {
        //const pedidosPendientes = await dbOperation.getPedidosPendientesPorSucursal(idsucursal);
        const pedidosPendientes = await dbOperation.getPedidosPendientesPorSucursal(1);
        res.json(pedidosPendientes);
        console.log(pedidosPendientes)
        
    } catch (error) {
        console.error('Error al obtener los pedidos pendientes por sucursal:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos pendientes por sucursal' });
    }
});
 
app.get('/servicios/ver_orden_servicio', async (req, res) => {
    const idsucursal = req.query.IDsucursal; // Cambiar a req.query.idsucursal si el parámetro se envía como consulta en la URL
    try {
        const ordenesServicio = await dbOperation.getOrdenesServicioPorSucursal(1);
        res.json(ordenesServicio);
        console.log(ordenesServicio);
    } catch (error) {
        console.error('Error al obtener las órdenes de servicio por sucursal:', error);
        res.status(500).json({ error: 'Error al obtener las órdenes de servicio por sucursal' });
    }
});

// Ruta para eliminar un pedido
app.delete('/servicios/CancelarPedido/:pedidoId', async (req, res) => {
    const pedidoId = req.params.pedidoId;
    try {
        await dbOperation.eliminarPedidoCompleto(pedidoId);
        res.status(200).send('Pedido eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).send('Error al eliminar el pedido');
    }
});

app.get('/servicios/productos/:pedidoId', async (req, res) => {
    const PedidoId = req.params.pedidoId;  
    console.log("IdPedido:" ,PedidoId);
    try {
        const ProductosPedido = await dbOperation.getProductosDePedido(PedidoId);
        res.json(ProductosPedido);
        console.log(ProductosPedido);
    } catch (error) {
    console.error(`Error al obtener los productos del pedido:`, error);
        res.status(500).json({ error: 'Error al obtener las órdenes de servicio por sucursal' });
    }
});

// Ruta para actualizar el pago del pedido
app.put('/servicios/pedidos/pago/:pedidoId', async (req, res) => {
    const { pedidoId } = req.params;
    const { nuevoPago } = req.body;
    try {
        await dbOperation.actualizarPagoPedido(pedidoId, nuevoPago);
        res.status(200).json({ message: "Pago del pedido actualizado exitosamente" });
    } catch (error) {
        console.error('Error al actualizar el pago del pedido:', error);
        res.status(500).json({ message: 'Error al actualizar el pago del pedido' });
    }
});
 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});