import { useState } from "react";
import "./App.css";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Panel from "./Component/Panel";
import Img from "./Component/ImageUploader";
import { UserProvider } from "./context/UserContext";
import PanelInicio from "./Component/PanelModalInicio";

function App() {
  const [activeSection, setActiveSection] = useState("login");

  const handleShowLogin = () => setActiveSection("login");
  const handleShowRegister = () => setActiveSection("register");
  const handleLoginSuccess = () => setActiveSection("panel");
  const handleOpenImgUploader = () => setActiveSection("img");
  const handleCloseImgUploader = () => setActiveSection("panel");
  const handleClosePanel = () => setActiveSection("login");
  const handleOpenPanelInicio = () => setActiveSection("panelInicio")
  return (
    <UserProvider>
      <div>
        {activeSection === "login" && (
          <Login 
            onClickRegister={handleShowRegister}
            onSuccessLogin={handleLoginSuccess} 
          />
        )}
        {activeSection === "register" && (
          <Register onClickLogin={handleShowLogin} />
        )}
        {activeSection === "panel" && (
          <Panel 
            onClickUploader={handleOpenImgUploader}
            onClickReturnPanel={handleCloseImgUploader}
            onClickCerrarSecion={handleClosePanel}
            onClickPanelModalInicio={handleOpenPanelInicio}
          />
        )}
        {activeSection === "panelInicio"&& (
          <PanelInicio 
          onClickReturnPanel={handleCloseImgUploader}
          />
        )}
        {activeSection === "img" && (
          <Img onClickCloseUploader={handleCloseImgUploader} />
        )}
      </div>
    </UserProvider>
  );
}

export default App;
