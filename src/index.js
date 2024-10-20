import React from 'react';
import ReactDOM from 'react-dom/client';
//import './index.css';
import App from './App';
import Pedido from './Pedidos/Pedidos.js' 
import Mapa from './Mapa/Mapa.js'
import ChatBot from './ChatBot/ChatBot.js';
import reportWebVitals from './reportWebVitals'; 
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./InicioSesion/InicioSesion.js";
import Signup from "./Registro/Registro.js";
import NavScroll from "./NavBar/NavBar";
import Historial from './Historial/Historial.js';
import Seguimiento from './SeguimientoPedidos/SeguimientoPedidos.js';
import OrdenesDePago from './OrdenPago/OrdenPago.js';
import VisualizarOrdenServicio from './VisualizarOrdenServicio/VisualizarOrdenServicio.js';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <header>
        <NavScroll />
      </header>
      <Routes>
        <Route path="/" element={<App/>}/> 
        <Route path="/servicios/historial/:usuario" element={<Historial />} />
        <Route path="/servicios/pedidos" element={<Pedido/>}/> 
        <Route path="/servicios/orden_de_servicio" element={<OrdenesDePago />} />
        <Route path="/servicios/ver_orden_servicio" element={<VisualizarOrdenServicio/>}/> 
        <Route path="/seguimiento_pedidos/:usuario" element={<Seguimiento/>}/>  
        <Route path="/servicios/Mapa" element={<Mapa/>}/> 
        <Route path="/servicios/ChatBot" element={<ChatBot/>}/> 
        <Route path="/iniciar_sesion" element={<Login/>} />
        <Route path="/crear_cuenta" element={<Signup />} />
      </Routes>
      </BrowserRouter>
    </AuthProvider>

    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
