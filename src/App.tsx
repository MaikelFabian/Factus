import { useState } from "react";
import Login from "./components/Login";
import Factura from "./components/Facturacion";
import FacturasListado from "./components/Listar";
import './index.css';


const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [vista, setVista] = useState<string>("listado"); 

  return (
    <>
    {!accessToken ? (
        <Login setAccessToken={setAccessToken} setMensaje={setMensaje} />
      ) : vista === "listado" ? (
        <FacturasListado 
          accessToken={accessToken} 
          setMensaje={setMensaje} 
          setVista={setVista} 
        />
      ) : vista === "crear-factura" ? (
        <Factura accessToken={accessToken} setMensaje={setMensaje} onBackToListado={() => setVista("listado")}  />
      ) : null}

      {mensaje && <p>{mensaje}</p>}
    </>
      
  );
};

export default App