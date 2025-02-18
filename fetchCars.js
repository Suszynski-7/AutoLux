import fs from "fs";
import axios from "axios";

const makes = ["BMW", "Audi", "Mercedes"];
const years = [2020, 2019, 2018, 2017, 2016, 2015, 2014];
const apiKey = "NSqK+/3Hk0YWUNCKSUyotw==Wwj18YqoxKEGrqSl"; // Dein API-Key

const fetchData = async () => {
  try {
    console.log("📡 Fahrzeugdaten werden von der API geladen...");

    const requests = makes.flatMap((make) =>
      years.map((year) =>
        axios.get(
          `https://api.api-ninjas.com/v1/cars?make=${make}&year=${year}`,
          { headers: { "X-Api-Key": apiKey } }
        )
      )
    );

    const responses = await Promise.all(requests);
    const allCars = responses.flatMap((response) => response.data);

    const carMap = new Map();
    for (const car of allCars) {
      const key = `${car.make}-${car.model}`;
      if (!carMap.has(key) || car.year > carMap.get(key).year) {
        carMap.set(key, car);
      }
    }

    const uniqueCars = Array.from(carMap.values());

    // JSON-Datei schreiben (funktioniert nur in Node.js mit fs.promises)
    await fs.promises.writeFile("cars.json", JSON.stringify(uniqueCars, null, 2));

    console.log("✅ Fahrzeugdaten erfolgreich in cars.json gespeichert!");
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der API-Daten:", error);
  }
};

fetchData();
