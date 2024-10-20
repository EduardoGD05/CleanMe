const config = require('./dbConfig');
const sql = require('mssql');

const getUsers = async () => {
    try {
        let pool = await sql.connect(config);
        let usuarios = await pool.request().query("SELECT * FROM Usuario");
        console.log(usuarios.recordset);
        return usuarios.recordset;
    } catch (error) {
        console.log(error);
        throw error;
    }   
};

const createUser = async (usuario) => {
    try {
        let pool = await sql.connect(config);

        // Verificar si el usuario ya existe
        const existingUserQuery = `SELECT COUNT(*) AS count FROM Usuario WHERE Usuario_email = @Usuario_email OR Usuario_nombre = @Usuario_nombre`;
        const existingUserResult = await pool.request()
            .input('Usuario_email', sql.VarChar(100), usuario.Usuario_email)
            .input('Usuario_nombre', sql.VarChar(100), usuario.Usuario_nombre)
            .query(existingUserQuery);

        const existingUserCount = existingUserResult.recordset[0].count;

        if (existingUserCount > 0) {
            // Si el usuario ya existe, puedes manejarlo como desees, lanzar una excepción, devolver un mensaje de error, etc.
            throw new Error('El usuario ya existe');
        }

        // Si el usuario no existe, procedemos con la inserción
        const query = `INSERT INTO Usuario (Usuario_nombre, Usuario_email, Usuario_contraseña, Usuario_pais, Usuario_estado, Usuario_ciudad, Usuario_colonia, Usuario_calle, Usuario_CP, Usuario_Nexte, Usuario_Nint, Usuario_indicaciones) 
                       VALUES (@Usuario_nombre, @Usuario_email, @Usuario_contraseña, @Usuario_pais, @Usuario_estado, @Usuario_ciudad, @Usuario_colonia, @Usuario_calle, @Usuario_CP, @Usuario_Nexte, @Usuario_Nint, @Usuario_indicaciones) `;

        const result = await pool.request()
            .input('Usuario_nombre', sql.VarChar(100), usuario.Usuario_nombre)
            .input('Usuario_email', sql.VarChar(100), usuario.Usuario_email)
            .input('Usuario_contraseña', sql.VarChar(50), usuario.Usuario_contraseña)
            .input('Usuario_pais', sql.VarChar(50), usuario.Usuario_pais)
            .input('Usuario_estado', sql.VarChar(50), usuario.Usuario_estado)
            .input('Usuario_ciudad', sql.VarChar(50), usuario.Usuario_ciudad)
            .input('Usuario_colonia', sql.VarChar(50), usuario.Usuario_colonia)
            .input('Usuario_calle', sql.VarChar(50), usuario.Usuario_calle)
            .input('Usuario_CP', sql.Int, usuario.Usuario_CP) 
            .input('Usuario_Nexte', sql.Int, usuario.Usuario_Nexte)
            .input('Usuario_Nint', sql.VarChar(10), usuario.Usuario_Nint)
            .input('Usuario_indicaciones', sql.VarChar(150), usuario.Usuario_indicaciones)
            .query(query); 
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error al crear usuario en la base de datos:', error);
        throw error;
    }  
};
const getUserByCredentials = async (identificador, Usuario_contraseña) => {
    try {
        let pool = await sql.connect(config);
        const query = `
            SELECT * 
            FROM Usuario 
            WHERE (Usuario_nombre = @Identificador OR Usuario_email = @Identificador) 
            AND Usuario_contraseña = @Usuario_contraseña`;
        const result = await pool.request()
            .input('Identificador', sql.VarChar(100), identificador)
            .input('Usuario_contraseña', sql.VarChar(50), Usuario_contraseña)
            .query(query);

        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
        console.error('Error al verificar las credenciales del usuario:', error);
        throw error;
    }  
};
// Función para obtener la información del usuario por ID
const getUserInfoById = async (userId) => {
    try {
        let pool = await sql.connect(config);
        const query = `SELECT * FROM Usuario WHERE IDusuario = @UserId`;
        const result = await pool.request()
            .input('IDusuario', sql.Int, userId)
            .query(query);

        return result.recordset[0]; // Retorna el primer registro encontrado (debería ser único)
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        throw error;
    }  
};

const createOrdenServicio = async (IDpedido, IDempleado, IDusuario) => {
    try {
        let pool = await sql.connect(config);

        const query = `
            INSERT INTO Ordenservicio (IDpedido, IDempleado, IDusuario, fechaOS)
            VALUES (@IDpedido, @IDempleado, @IDusuario, GETDATE());
        `;

        const result = await pool.request()
            .input('IDpedido', sql.Int, IDpedido)
            .input('IDempleado', sql.Int, IDempleado)
            .input('IDusuario', sql.Int, IDusuario)
            .query(query);

        console.log(result);
        return result;
    } catch (error) {
        console.error('Error al crear orden de servicio en la base de datos:', error);
        throw error;
    }  
};

const actualizarFechaFin = async (IDpedido) => {
    try {
        let pool = await sql.connect(config);
    
        const query = `UPDATE Pedido
                       SET Pedido_fechaFin = DEFAULT
                       WHERE IDpedido = @IDpedido;`;
    
        await pool.request()
            .input('IDpedido', sql.Int, IDpedido)
            .query(query);
    } catch (error) {
        console.error('Error al actualizar la fecha de fin del pedido:', error);
        throw error;
    }
};



const createPedido = async (pedido) => {
    try {
        let pool = await sql.connect(config);

        const query = `
            INSERT INTO Pedido (
                IDusuario, IDsucursal, IDtiposervicio, Pedido_pago, Pedido_especificaciones, Pedido_indicaciones, Pedido_fechaReg, Pedido_fechaFin, Pedido_pais, Pedido_estado, Pedido_ciudad, Pedido_colonia, Pedido_calle, Pedido_CP, Pedido_Nexte, Pedido_Nint
            ) 
            OUTPUT INSERTED.IDpedido
            VALUES (
                @IDusuario, @IDsucursal, @IDtiposervicio, @Pedido_pago, @Pedido_especificaciones, @Pedido_indicaciones, DEFAULT, NULL, @Pedido_Pais, @Pedido_estado, @Pedido_ciudad, @Pedido_colonia, @Pedido_calle, @Pedido_CP, @Pedido_Nexte, @Pedido_Nint
            )`;

        const result = await pool.request()
            .input('IDusuario', sql.Int, pedido.IDusuario)
            .input('IDsucursal', sql.Int, pedido.IDsucursal)
            .input('IDtiposervicio', sql.Int, pedido.IDtiposervicio)
            .input('Pedido_pago', sql.Money, pedido.Pedido_pago)
            .input('Pedido_especificaciones', sql.VarChar(200), pedido.Pedido_especificaciones)
            .input('Pedido_indicaciones', sql.VarChar(150), pedido.Pedido_indicaciones)
            .input('Pedido_pais', sql.VarChar(50), pedido.Pedido_pais)
            .input('Pedido_estado', sql.VarChar(50), pedido.Pedido_estado)
            .input('Pedido_ciudad', sql.VarChar(50), pedido.Pedido_ciudad)
            .input('Pedido_colonia', sql.VarChar(50), pedido.Pedido_colonia)
            .input('Pedido_calle', sql.VarChar(50), pedido.Pedido_calle)
            .input('Pedido_CP', sql.Int, pedido.Pedido_CP) 
            .input('Pedido_Nexte', sql.Int, pedido.Pedido_Nexte)
            .input('Pedido_Nint', sql.VarChar(10), pedido.Pedido_Nint)
            .query(query);

        // Extract the IDpedido from the result
        const IDpedido = result.recordset[0].IDpedido;

        console.log(result);
        return IDpedido;
    } catch (error) {
        console.error('Error al crear pedido en la base de datos:', error);
        throw error;
    }  
}; 

 

const createPedidoProducto = async (Pedidoproducto) => {
    try {
        let pool = await sql.connect(config);

        const query = `
        INSERT INTO Pedidoproducto (IDproducto, IDpedido, Pedido_peso, Pedido_cantidad, Pedido_precio)
        SELECT @IDproducto, @IDpedido, @Pedido_peso, @Pedido_cantidad, @Pedido_precio
        WHERE NOT EXISTS (
            SELECT 1 FROM Pedidoproducto WHERE IDproducto = @IDproducto AND IDpedido = @IDpedido
        );
        `;

        const result = await pool.request()
            .input('IDproducto', sql.Int, Pedidoproducto.IDproducto)
            .input('IDpedido', sql.Int, Pedidoproducto.IDpedido)
            .input('Pedido_peso', sql.Float, Pedidoproducto.Pedido_peso)
            .input('Pedido_cantidad', sql.Int, Pedidoproducto.Pedido_cantidad)
            .input('Pedido_precio', sql.Money, Pedidoproducto.Pedido_precio)
            .query(query);

        console.log(result);
        return result;
    } catch (error) {
        console.error('Error al crear el registro en la tabla PedidoProducto:', error);
        throw error;
    }  
};

// Método para actualizar un producto en el pedido
const updatePedidoProducto = async (IDproducto, IDpedido, { Pedido_peso, Pedido_cantidad, Pedido_precio }) => {
    try {
        let pool = await sql.connect(config);
        const query = `
            UPDATE Pedidoproducto
            SET Pedido_peso = @Pedido_peso, Pedido_cantidad = @Pedido_cantidad, Pedido_precio = @Pedido_precio
            WHERE IDproducto = @IDproducto AND IDpedido = @IDpedido
        `;
        await pool.request()
            .input('IDproducto', sql.Int, IDproducto)
            .input('IDpedido', sql.Int, IDpedido)
            .input('Pedido_peso', sql.Float(18, 2), Pedido_peso)
            .input('Pedido_cantidad', sql.Int, Pedido_cantidad)
            .input('Pedido_precio', sql.Decimal(18, 2), Pedido_precio)
            .query(query);
    } catch (error) {
        console.error("Error al actualizar producto en el pedido:", error);
        throw error;
    }
};

const obtenerSeguimiento = async (IDusuario) => {
    try {
        let pool = await sql.connect(config);

        const query = `    
        SELECT 
        p.IDpedido,
        p.Pedido_pago,
        p.Pedido_especificaciones,
        p.Pedido_indicaciones,
        p.Pedido_fechaReg,
        p.Pedido_pais,
        p.Pedido_estado,
        p.Pedido_ciudad,
        p.Pedido_colonia,
        p.Pedido_calle,
        p.Pedido_CP,
        p.Pedido_Nexte,
        p.Pedido_Nint,
        ts.Servicio,
        STRING_AGG(pr.Producto_descripcion + ': ' + CAST(pp.Pedido_cantidad AS VARCHAR) + ' (' + CAST(pp.Pedido_peso AS VARCHAR) + ' Kg)', ' | ') AS Productos
        FROM 
        Pedido p
        JOIN 
        PedidoProducto pp ON p.IDpedido = pp.IDpedido
        JOIN 
        Producto pr ON pp.IDproducto = pr.IDproducto
        JOIN
        TipoServicio ts ON p.IDtiposervicio = ts.IDtiposervicio
        WHERE 
        IDusuario = @IDusuario AND p.Pedido_fechaFin is NULL
        GROUP BY 
        p.IDpedido,
        p.Pedido_pago,
        p.Pedido_especificaciones,
        p.Pedido_indicaciones,
        p.Pedido_fechaReg,
        p.Pedido_pais,
        p.Pedido_estado,
        p.Pedido_ciudad,
        p.Pedido_colonia,
        p.Pedido_calle,
        p.Pedido_CP,
        p.Pedido_Nexte,
        p.Pedido_Nint,
        ts.Servicio; 
        ` 
        const result = await pool.request()
            .input('IDusuario', sql.Int, IDusuario)
            .query(query);

        console.log("Funcion obtenerSeguimiento:",result.recordset); // Verifica los datos recibidos en la consola

        return result.recordset; // Devuelve solo el conjunto de registros
    } catch (error) {
        console.error('Error al buscar los pedidos en la base de datos:', error);
        throw error;
    }  
}; 


const obtenerHistoria = async (IDusuario) => {
    try {
        let pool = await sql.connect(config);

        const query = `  
        SELECT 
        p.IDpedido,
        p.Pedido_pago,
        p.Pedido_especificaciones,
        p.Pedido_indicaciones,
        p.Pedido_fechaReg,
        p.Pedido_fechaFin,
        p.Pedido_pais,
        p.Pedido_estado,
        p.Pedido_ciudad,
        p.Pedido_colonia,
        p.Pedido_calle,
        p.Pedido_CP,
        p.Pedido_Nexte,
        p.Pedido_Nint,
        ts.Servicio,
        STRING_AGG(pr.Producto_descripcion + ': ' + CAST(pp.Pedido_cantidad AS VARCHAR) + ' (' + CAST(pp.Pedido_peso AS VARCHAR) + ' Kg)', ' | ') AS Productos
        FROM 
        Pedido p
        JOIN 
        PedidoProducto pp ON p.IDpedido = pp.IDpedido
        JOIN 
        Producto pr ON pp.IDproducto = pr.IDproducto
        JOIN
        TipoServicio ts ON p.IDtiposervicio = ts.IDtiposervicio
        WHERE 
        IDusuario = @IDusuario AND p.Pedido_fechaFin is NOT NULL
        GROUP BY 
        p.IDpedido,
        p.Pedido_pago,
        p.Pedido_especificaciones,
        p.Pedido_indicaciones,
        p.Pedido_fechaReg,
        p.Pedido_fechaFin,
        p.Pedido_pais,
        p.Pedido_estado,
        p.Pedido_ciudad,
        p.Pedido_colonia,
        p.Pedido_calle,
        p.Pedido_CP,
        p.Pedido_Nexte,
        p.Pedido_Nint,
        ts.Servicio; 
        `;

        const result = await pool.request()
            .input('IDusuario', sql.Int, IDusuario)
            .query(query);

        console.log("Funcion obtenerHistoria:",result.recordset); // Verifica los datos recibidos en la consola

        return result.recordset; // Devuelve solo el conjunto de registros
    } catch (error) {
        console.error('Error al buscar los pedidos en la base de datos:', error);
        throw error;
    }  
}; 

const getPedidosPendientesPorSucursal = async (IDsucursal) => {
    try {
        let pool = await sql.connect(config);
        const query = `
        SELECT p.*, ts.Servicio
        FROM Pedido p
        JOIN Tiposervicio ts ON p.IDtipoServicio = ts.IDtipoServicio
            WHERE IDsucursal = @IDsucursal AND Pedido_fechaFin IS NULL;
        `;
        const result = await pool.request()
            .input('IDsucursal', sql.Int, IDsucursal)
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error('Error al obtener los pedidos pendientes:', error);
        throw error;
    }
};

const getOrdenesServicioPorSucursal = async (IDsucursal) => {
    try {
        let pool = await sql.connect(config);
        const query = `
        SELECT 
            os.*, 
            u.Usuario_nombre AS NombreUsuario,
            e.Empleado_nombre AS NombreEmpleado
        FROM 
            Ordenservicio os
        JOIN 
            Usuario u ON os.IDusuario = u.IDusuario
        JOIN 
            Empleado e ON os.IDempleado = e.IDempleado
        JOIN 
            Pedido p ON os.IDpedido = p.IDpedido
        WHERE 
            p.IDsucursal = @IDsucursal;
        `;
        const result = await pool.request()
            .input('IDsucursal', sql.Int, IDsucursal)
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error('Error al obtener las órdenes de servicio por sucursal:', error);
        throw error;
    }
};

const getConsultaInfoProducto = async () => {
    try {
        let pool = await sql.connect(config);
        const query = `SELECT * FROM Producto`;
        const result = await pool.request() 
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error('Error al obtener el precio y peso del producto:', error);
        throw error;
    }
};

const eliminarPedidoCompleto = async (pedidoId) => {
    try {
        let pool = await sql.connect(config);
        
        // Iniciar una transacción
        const transaction = new sql.Transaction(pool);

        await transaction.begin();

        // Eliminar los registros de Pedidoproducto asociados con el pedido
        const queryEliminarProductos = `DELETE FROM Pedidoproducto WHERE IDpedido = @PedidoId`;
        await pool.request()
            .input('PedidoId', sql.Int, pedidoId)
            .query(queryEliminarProductos, { transaction });

        // Eliminar el pedido
        const queryEliminarPedido = `DELETE FROM Pedido WHERE IDpedido = @PedidoId`;
        await pool.request()
            .input('PedidoId', sql.Int, pedidoId)
            .query(queryEliminarPedido, { transaction });

        // Confirmar la transacción
        await transaction.commit();

    } catch (error) {
        console.error('Error al eliminar el pedido completo de la base de datos:', error);
        throw error;
    }
};
const getProductosDePedido = async (pedidoId) => {
    try {
        let pool = await sql.connect(config);
        const query = `
        SELECT p.IDproducto, p.Producto_descripcion, pp.Pedido_cantidad
        FROM Producto p
        INNER JOIN Pedidoproducto pp ON p.IDproducto = pp.IDproducto
        WHERE pp.IDpedido = @PedidoId
      `;
        const result = await pool.request() 
            .input('PedidoId', sql.Int, pedidoId)
            .query(query);

        return result.recordset;
    } catch (error) {
        console.error("Error al obtener productos del pedido:", error);
        throw error;
    }
};

// Método para actualizar el pago del pedido
const actualizarPagoPedido = async (pedidoId, nuevoPago) => {
    try {
        let pool = await sql.connect(config);
        const query = `
            UPDATE Pedido
            SET Pedido_pago = @nuevoPago
            WHERE IDpedido = @pedidoId
        `;
        await pool.request()
            .input('pedidoId', sql.Int, pedidoId)
            .input('nuevoPago', sql.Decimal(18, 2), nuevoPago)
            .query(query);
    } catch (error) {
        console.error("Error al actualizar el pago del pedido:", error);
        throw error;
    }
};



module.exports = { getUsers, createUser, getUserByCredentials,createPedido, getUserInfoById, obtenerHistoria, 
    obtenerSeguimiento,actualizarFechaFin,createOrdenServicio, getPedidosPendientesPorSucursal, getOrdenesServicioPorSucursal,
    createPedidoProducto,updatePedidoProducto,getConsultaInfoProducto,eliminarPedidoCompleto,getProductosDePedido,actualizarPagoPedido};