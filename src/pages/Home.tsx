import { Link } from "react-router";
import { Button } from "react-bootstrap";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "white", 
          marginBottom: "10px",
        }}
      >
        Willkommen bei <i className="fa-solid fa-car"></i> AutoLux 
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
        Exklusive Fahrzeuge entdecken Sie hier
      </p>
      <Link to="/cars">
        <Button
          style={{
            backgroundColor: "#f0ad4e",
            borderColor: "#d6933b",
            padding: "12px 24px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "30px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            border:"1px solid black",
          }}
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)")}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)")}
        >
          📋 Zum Fahrzeug-Showroom
        </Button>
      </Link>
    </div>
  );
}

export default Home;
