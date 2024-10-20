# Servicio de Lavandería y Tintorería

Este proyecto es una aplicación web desarrollada en React para un servicio de lavandería y tintorería, que permite a los usuarios realizar órdenes de lavado de ropa de manera eficiente y cómoda. La plataforma ofrece múltiples módulos para gestionar inventarios, ventas, compras, entregas y clientes.

## Características del Proyecto
- Interfaz amigable y responsiva.
- Registro y gestión de productos en inventario.
- Proceso de ventas y seguimiento de órdenes.
- Gestión de entregas y comunicación con los clientes.
- Funciones para el manejo de clientes y sus pedidos.

## Módulos

### Inventarios
Gestión de entradas y salidas de productos con las siguientes funcionalidades:
- `MostrarInventario()`: Visualiza productos y cantidades disponibles.
- `ModificarInventario()`: Permite actualizar el inventario.
- `EnviarReporte()`: Envía informes detallados del estado del inventario.
- `CalcularTotal()`: Calcula el total de compras.
- `HacerPedido()`: Realiza pedidos a proveedores.

### Ventas
Módulo que gestiona las transacciones de venta:
- `CalcularCosto()`: Calcula el costo total de los servicios.
- `EnviarOrden()`: Envía la orden para procesamiento.
- `TrabajarOrden()`: Facilita el seguimiento de órdenes en curso.
- `DescribirOrden()`: Proporciona detalles de la orden de venta.

### Compras
Gestión de adquisiciones de productos:
- `GenerarOrdenes()`: Crea órdenes de compra automáticas o manuales.
- `EstadoOrdenes()`: Rastrear el estado de las órdenes de compra.
- `RegistrarFacturas()`: Registra facturas relacionadas con compras.

### Entregas
Optimización de la entrega de servicios:
- `CalcularEntrega()`: Calcula la fecha y hora estimadas de entrega.
- `LlamarRepartidor()`: Asigna tareas a repartidores.
- `AvisarCliente()`: Notifica al cliente sobre el estado de su pedido.
- `FinalizarOrden()`: Marca la orden como completada.
- `RevisarEstado()`: Verifica el estado de entregas.

### Clientes
Gestión de datos de clientes:
- `IniciarSesion()`: Permite a los usuarios acceder a sus cuentas.
- `Pedir()`: Facilita la selección de productos y envío de pedidos.
- `Pagar()`: Completa el proceso de pago.
- `RastrearPedido()`: Permite a los usuarios seguir sus pedidos.
- `Reclamar()`: Presenta quejas relacionadas con pedidos.
- `ActualizarInformacion()`: Modifica información del perfil.
- `BorrarCuenta()`: Elimina cuentas de usuario.
- `CerrarSesion()`: Cierra sesión de forma segura.

## Implementación de IA
La IA, integrada mediante Gemini, ofrece:
- Asistencia al usuario.
- Recomendaciones personalizadas.
- Soporte en la resolución de problemas.
