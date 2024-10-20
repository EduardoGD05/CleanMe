import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Estado para almacenar los datos completos del usuario
  const [IDusuario, setUserID] = useState(null); // Estado para almacenar el ID del usuario  
  const [Usuario_email, setEmail] = useState(""); 
  const [Usuario_pais, setPais] = useState(""); 
  const [Usuario_estado, setEstado] = useState("");
  const [Usuario_ciudad, setCiudad] = useState("");
  const [Usuario_colonia, setColonia] = useState(""); 
  const [Usuario_calle, setCalle] = useState(""); 
  const [Usuario_CP, setCP] = useState(""); 
  const [Usuario_Nexte, setNexte] = useState("");
  const [Usuario_Nint, setNint] = useState("");
  const [Usuario_indicaciones, setIndicaciones] = useState("");

  const login = (userData) => { 
    // Lógica de inicio de sesión (puedes modificarla según tus necesidades)
    setIsLoggedIn(true);
    setUser(userData); // Almacena los datos completos del usuario al iniciar sesión
    setUserID(userData.user.IDusuario)
    setEmail(userData.user.Usuario_email)
    setPais(userData.user.Usuario_pais)
    setEstado(userData.user.Usuario_estado)
    setCiudad(userData.user.Usuario_ciudad) 
    setColonia(userData.user.Usuario_colonia)
    setCalle(userData.user.Usuario_calle) 
    setCP(userData.user.Usuario_CP) 
    setNexte(userData.user.Usuario_Nexte)
    setNint(userData.user.Usuario_Nint)
    setIndicaciones(userData.user.Usuario_indicaciones)
    console.log("Estado:", !isLoggedIn);
    console.log("Usuario inició sesión:", userData); // Agregar console.log aquí
    console.log("Usuario ID:",userData.user.IDusuario);
    console.log("Usuario CP:",userData.user.Usuario_CP);
  };

  const logout = () => {
    // Lógica de cierre de sesión (puedes modificarla según tus necesidades)
    setIsLoggedIn(false);
    setUser(null); // Elimina los datos del usuario al cerrar sesión
    setUserID(null)
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, IDusuario,Usuario_email,Usuario_pais,Usuario_estado, Usuario_ciudad,Usuario_colonia,  Usuario_calle,  Usuario_CP, Usuario_Nexte, Usuario_Nint, Usuario_indicaciones, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
