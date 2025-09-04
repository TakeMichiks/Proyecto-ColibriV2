import { useState } from "react";
import "./App.css";
import Register from "./Component/Register";
import Login from "./Component/Login";
import Panel from "./Component/Panel";
import Img from "./Component/ImageUploader";
import { UserProvider } from "./context/UserContext";

function App() {
  const [activeSection, setActiveSection] = useState("login");

  const handleShowLogin = () => setActiveSection("login");
  const handleShowRegister = () => setActiveSection("register");
  const handleLoginSuccess = () => setActiveSection("panel");
  const handleOpenImgUploader = () => setActiveSection("img");
  const handleCloseImgUploader = () => setActiveSection("panel");
  const handleClosePanel = () => setActiveSection("login");

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
            onClickCerrarSecion={handleClosePanel}
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
