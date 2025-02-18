import "./App.css";
import NavBar from "./pages/NavBarSite";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CarList from "./pages/CarList";

function App() {
  const items = [
    { label: "Home", path: "/" },
    { label: "Fahrzeug-Showroom", path: "/cars" },
  ];

  return (
    <div className="app-background">
      <NavBar navItems={items} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
      </Routes>
    </div>
  );
}

export default App;
