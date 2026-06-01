import "dotenv/config.js";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";
import dns from "dns";

//changing dns because of mongodb not connected
dns.setServers(["1.1.1.1", "8.8.8.8"]);


app.listen(3000, () => {
  console.log("server is running on port 3000");
});
