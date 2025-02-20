import { useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Form, InputGroup, Modal } from "react-bootstrap";
import "./CarList.css";

interface Car {
  make: string;
  model: string;
  year: number;
  fuel_type: string;
  transmission: string;
  cylinders: number;
  displacement: number;
  drive: string;
  city_mpg: number;
  highway_mpg: number;
  combination_mpg: number;
  price?: number;
  body_type?: string;
  images?: string[];
  img?: string;
}

function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [originalCars, setOriginalCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter- & Sortier-Zustände
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterPrice, setFilterPrice] = useState<number | string>("");
  const [sortOption, setSortOption] = useState("standard");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [filterType, setFilterType] = useState("");

  const vehicleTypes = ["", "Coupe", "Limousine", "SUV", "Cabrio"];
  const placeholderImages = [
    "https://placehold.co/700x500/f0ad4e/white",
    "https://placehold.co/800x800/lightgray/f0ad4e",
  ];

  // Laden der Fahrzeugdaten aus /public/cars.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}cars.json`);

        if (!response.ok) {
          throw new Error("Netzwerkantwort war nicht ok");
        }
        const data = await response.json();
        const transformedData = data.map((car: Car) => ({
          ...car,
          images: [
            ...(car.images || (car.img ? [`${import.meta.env.BASE_URL}${car.img.replace(/^\//, "")}`] : [])), 
            placeholderImages[0],
          ],
        }));
        
        setCars(transformedData);
        setOriginalCars(transformedData);
        setFilteredCars(transformedData);
      } catch (err) {
        setError("Fehler beim Laden der Fahrzeugdaten.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowModal = (car: Car) => {
    setSelectedCar({
      ...car,
      images:
        car.images && car.images.length > 0 ? car.images : placeholderImages,
    });
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Sortier-Funktion
  const sortCars = useCallback(
    (carsToSort: Car[]): Car[] => {
      if (sortOption === "standard") {
        return originalCars.filter((car) => carsToSort.includes(car));
      }
      const sorted = [...carsToSort];
      switch (sortOption) {
        case "price-asc":
          sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price-desc":
          sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case "make-asc":
          sorted.sort((a, b) => a.make.localeCompare(b.make));
          break;
        case "make-desc":
          sorted.sort((a, b) => b.make.localeCompare(a.make));
          break;
        case "year-desc":
          sorted.sort((a, b) => b.year - a.year);
          break;
        case "year-asc":
          sorted.sort((a, b) => a.year - b.year);
          break;
        default:
          break;
      }
      return sorted;
    },
    [sortOption, originalCars]
  );

  // Filter-Funktion
  const filterCars = useCallback((): Car[] => {
    let filtered = [...cars];
    if (filterMake) {
      const lowerMake = filterMake.trim().toLowerCase();
      filtered = filtered.filter((car) =>
        car.make.toLowerCase().includes(lowerMake)
      );
    }
    if (filterModel && filterMake) {
      const lowerModel = filterModel.trim().toLowerCase();
      filtered = filtered.filter((car) =>
        car.model.toLowerCase().includes(lowerModel)
      );
    }
    if (filterPrice) {
      const priceNum = Number(filterPrice);
      filtered = filtered.filter(
        (car) => car.price !== undefined && car.price <= priceNum
      );
    }
    if (filterType) {
      const lowerType = filterType.trim().toLowerCase();
      filtered = filtered.filter(
        (car) => (car.body_type || "").toLowerCase() === lowerType
      );
    }
    return filtered;
  }, [cars, filterMake, filterModel, filterPrice, filterType]);

  const handleOpenTypeModal = () => setShowTypeModal(true);
  const handleSelectType = (type: string) => {
    setFilterType(type);
    setShowTypeModal(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    const filtered = filterCars();
    setFilteredCars(sortCars(filtered));
  }, [sortOption, filterType, filterCars, sortCars]);

  // Bildwechsel im Modal
  const handlePreviousImage = () => {
    if (selectedCar && selectedCar.images && selectedCar.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? (selectedCar.images?.length || 1) - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedCar && selectedCar.images && selectedCar.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === (selectedCar.images?.length || 1) - 1 ? 0 : prevIndex + 1
      );
    }
  };

  if (loading) return <p>Lade Fahrzeugdaten...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      {/* Autofilter */}
      <div className="searchbar-container">
        <InputGroup className="inputGroup-container">
          <Form.Control
            type="text"
            placeholder="Marke"
            value={filterMake}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Marke")}
            onChange={(e) => setFilterMake(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Modell"
            value={filterModel}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Modell")}
            onChange={(e) => setFilterModel(e.target.value)}
            disabled={!filterMake}
          />
          <Form.Control
            type="number"
            placeholder="Max. Preis"
            value={filterPrice}
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "Max. Preis")}
            onChange={(e) => setFilterPrice(e.target.value)}
          />
        </InputGroup>
      </div>

      {/* Sortierbereich */}
      <div className="sort-container">
        <Form.Select value={sortOption} onChange={handleSortChange}>
          <option value="standard">Standard-Sortierung</option>
          <option value="price-asc">Preis (niedrigster zuerst)</option>
          <option value="price-desc">Preis (höchster zuerst)</option>
          <option value="make-asc">Marke (A-Z)</option>
          <option value="make-desc">Marke (Z-A)</option>
          <option value="year-desc">Baujahr (neueste zuerst)</option>
          <option value="year-asc">Baujahr (älteste zuerst)</option>
        </Form.Select>

        <Button
          variant="warning"
          className="filtertyp-button"
          onClick={handleOpenTypeModal}
        >
          {filterType ? `${filterType}` : "Fahrzeugtyp wählen"}
        </Button>

        <Modal
          show={showTypeModal}
          onHide={() => setShowTypeModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Fahrzeugtyp wählen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-wrap justify-content-center">
              {vehicleTypes.map((type) => (
                <Button
                  key={type}
                  variant="warning"
                  className="filtertyp-button m-2"
                  onClick={() => handleSelectType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTypeModal(false)}>
              Schließen
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Kartenübersicht */}
      <div className="custom-container mt-5">
        <div className="cardComp">
          {filteredCars.map((car, index) => (
            <Card key={index} className="car-card mb-5">
              <Card.Img
                className="car-card-img"
                variant="top"
                src={car.images?.[0] || placeholderImages[0]}
                alt={`${car.make} ${car.model}`}
              />
              <Card.Body className="card-body">
                <Card.Title className="car-card-title">
                  {car.make} {car.model}
                </Card.Title>
                <Card.Text className="car-card-text">
                  Preis:{" "}
                  {car.price ? `${car.price} €` : "Preis nicht verfügbar"}
                  <br />
                  Baujahr: {car.year}
                </Card.Text>
                <Button
                  className="card-button"
                  variant="warning"
                  onClick={() => handleShowModal(car)}
                >
                  Details
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal für Fahrzeugdetails */}
      <Modal show={showModal} onHide={handleCloseModal} centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{`${selectedCar?.make} ${selectedCar?.model}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCar && (
            <div className="modal-body-content">
              <div className="image-content">
                <Button
                  variant="light"
                  className="image-nav left"
                  onClick={handlePreviousImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="white"
                  >
                    <path
                      d="M15 19l-7-7 7-7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>

                <img
                  src={
                    selectedCar?.images?.[currentImageIndex] ||
                    placeholderImages[0]
                  }
                  alt={`${selectedCar?.make} ${selectedCar?.model}`}
                  className={`modal-image ${
                    selectedCar?.images?.[currentImageIndex]?.includes(
                      "placehold"
                    )
                      ? "placeholder-image"
                      : "car-image"
                  }`}
                />

                <Button
                  variant="light"
                  className="image-nav right"
                  onClick={handleNextImage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="white"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>

                <div className="thumbnail-container">
                  {(selectedCar?.images?.length
                    ? selectedCar.images
                    : placeholderImages
                  ).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-ul">
                <ul>
                  <li>
                    <strong>Preis:</strong> {selectedCar.price} €
                  </li>
                  <li>
                    <strong>Baujahr:</strong> {selectedCar.year}
                  </li>
                  <li>
                    <strong>Typ:</strong> {selectedCar.body_type}
                  </li>
                  <li>
                    <strong>Kraftstoff:</strong>{" "}
                    {selectedCar.fuel_type === "gas" ? "Benzin" : "Diesel"}
                  </li>
                  <li>
                    <strong>Zylinder:</strong> {selectedCar.cylinders}
                  </li>
                  <li>
                    <strong>Getriebe:</strong>{" "}
                    {selectedCar.transmission === "a" ? "Automatik" : "Manuell"}
                  </li>
                  <li>
                    <strong>Hubraum:</strong> {selectedCar.displacement}L
                  </li>
                  <li>
                    <strong>Antrieb:</strong> {selectedCar.drive.toUpperCase()}
                  </li>
                  <li>
                    <strong>Verbrauch Stadt:</strong>{" "}
                    {(235.21 / selectedCar.city_mpg)
                      .toFixed(1)
                      .replace(".", ",")}{" "}
                    l/100km
                  </li>
                  <li>
                    <strong>Verbrauch Autobahn:</strong>{" "}
                    {(235.21 / selectedCar.highway_mpg)
                      .toFixed(1)
                      .replace(".", ",")}{" "}
                    l/100km
                  </li>
                  <li>
                    <strong>Verbrauch Kombiniert:</strong>{" "}
                    {(235.21 / selectedCar.combination_mpg)
                      .toFixed(1)
                      .replace(".", ",")}{" "}
                    l/100km
                  </li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Schließen
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CarList;
