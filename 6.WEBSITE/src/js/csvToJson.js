const fs = require("fs");
const csv = require("csv-parser");

// Function to convert CSV to JSON
function csvToJson(csvFilePath) {
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // Convert the array of objects to JSON
      const json = JSON.stringify(results, null, 2);
      fs.writeFile("output2.json", json, (err) => {
        if (err) {
          console.error("Error writing to file", err);
        } else {
          console.log("JSON saved to output.json");
        }
      });
    });
}

// Example usage:
csvToJson("../../data2.csv");
