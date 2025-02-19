import "./App.css";
import NavBar from "./pages/NavBarSite";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CarList from "./pages/CarList";
import { BrowserRouter } from "react-router-dom";

function App() {
  const items = [
    { label: "Home", path: "/AutoLux/" },
    { label: "Fahrzeug-Showroom", path: "/AutoLux/cars" },
  ];

  return (
    <BrowserRouter basename="/AutoLux">
      <div className="app-background">
        <NavBar navItems={items} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="*" element={<Home />} /> {/* Fallback zu Home */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
