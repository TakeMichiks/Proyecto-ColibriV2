import { useState } from "react";
import "./App.css";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Panel from "./Component/Panel";
import Img from "./Component/ImageUploader";

function App() {
  const [activeSection, setActiveSection] = useState("login");

  const handleShowLogin = () => {
    setActiveSection("login");
  };

  const handleShowRegister = () => {
    setActiveSection("register");
  };
    // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setActiveSection('panel');
  };

  // Función para cerrar el panel (ej. logout)
  const handleCloseImgUploader = () => {
    setActiveSection('panel');
  };

  const handleOpenImgUploader = () =>{
    setActiveSection("img")
  };
  const handleClosePanel = () => {
    setActiveSection("login")
  };

  return (
    <>
      <div>
        {activeSection === "login" && (
          <Login 
          onClickRegister={handleShowRegister}
          onSuccessLogin={handleLoginSuccess} />
        )}
        {activeSection === "register" && (
          <Register onClickLogin={handleShowLogin} />
        )}
        {activeSection === "panel" && (
          <Panel onClickUploader={handleOpenImgUploader} 
          onClickCerrarSecion={handleClosePanel}/>
        )}
        {activeSection === "img" &&(
          <Img 
          onClickCloseUploader={handleCloseImgUploader}
          />
        )}
      </div>
    </>
  );
}

export default App;
