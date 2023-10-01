async function dataFilteration(flightData) {
  // flightData = [
  //     '8:50 PM8:50 PM on Tue, Oct 10 – 12:25 PM+112:25 PM on Wed, Oct 11Biman, Emirates20 hr 5 minCCUNetaji Subhash Chandra Bose International Airport–LHRHeathrow Airport2 stops3 hr 15 min layoverOvernight layoverDACHazrat Shahjalal International Airport, DXBDubai International Airport2,943 kg CO2+22% emissions₹1,856,129round tripDepartureTue, Oct 102,943 kg CO2+22% emissionsSelect flight₹1,856,129round trip8:50 PMCCU12:25 PM+1LHR₹1,856,129round trip2 stops in DAC, DXB2 stops20 hr 5 minBiman, Emirates2,943 kg CO2+22% emissions'
  // ]

  const structuredFlightData = [];

  for (const data of flightData) {
    const timePattern = /\d{1,2}:\d{2} [AP]M/g;
    const departureTime = data.match(timePattern)[0];
    const arrivalTime = data.match(timePattern)[2];

    const datePattern = /[A-Za-z]{3}, [A-Za-z]{3} \d{1,2}/g;
    const departureDate = data.match(datePattern)[0];
    const arrivalDate = data.match(datePattern)[1];

    const emissionsPattern = /(\d{1,3}(?:,\d{3})*\s*kg\s+CO2)/g;
    const totalCarbonEmissions = data.match(emissionsPattern);

    const costPattern = /₹[0-9,]+/g;
    const averageEmissionsCost = data.match(costPattern);

    const numberOfStops = data.match(/(\d+)\s+stop/);

    const totalDurationMatch = data.match(/\d+ hr|\d+ hr \d+ min/g);
    const totalDuration = totalDurationMatch ? totalDurationMatch[0] : "N/A";

    const departureAirportMatch = data.match(
      /hr \d+\s*min?[A-Za-z\s]+Airport/g
    );
    const departureAirportNew = departureAirportMatch
      ? departureAirportMatch[0].replace(/^hr\s*(\d*\s*min)?/, "")
      : "N/A - Departure Airport";
    const departureAirport = departureAirportNew
      ? departureAirportNew.replace(/(\w{3})(\w.*)/, "$2 ($1)")
      : "N/A - Departure Airport";

    const airportMatch = data.match(/–(.*?Airport)/g);
    const airportMatchNew = airportMatch[1].replace(/^–/, "");
    const arrivalAirport = airportMatchNew
      ? airportMatchNew.replace(/(\w{3})(\w.*)/, "$2 ($1)")
      : "N/A";

    const airlineMatch = data.match(/[A-Za-z\s,]+(?=\d+\s*hr)/g);
    const airlines = airlineMatch[0]
      ? airlineMatch[0].split(",").map((airline) => airline.trim())
      : "N/A";

    structuredFlightData.push({
      "Departure Date": departureDate,
      "Departure Time": departureTime,
      "Arrival Date": arrivalDate,
      "Arrival Time": arrivalTime,
      "Total Duration": totalDuration,
      Airlines: airlines,
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
      "Number of Stops": numberOfStops ? numberOfStops[0] : "No stops",
      "Total Carbon Emissions": totalCarbonEmissions
        ? totalCarbonEmissions[0]
        : "–",
      "Average Emissions Cost": averageEmissionsCost
        ? averageEmissionsCost[0]
        : "Price unavailable",
    });
  }

  console.log(structuredFlightData);
  console.log(structuredFlightData.length);
}

module.exports = dataFilteration;
