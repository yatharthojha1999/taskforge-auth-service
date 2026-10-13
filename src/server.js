const express = require("express");
const routes = require("./routes");
const pool = require("./infrastructure/database/postgres.db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", routes);

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Service is up and running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to PostgreSQL:", error.message);
        process.exitCode = 1;
    }
}

startServer();