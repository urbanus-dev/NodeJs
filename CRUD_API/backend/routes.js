// const events = require("./db");
const fs = require('fs');
const path = require('path');
const dbFilepath = require("path").join(__dirname, "db.json");
let eventsList = JSON.parse(require("fs").readFileSync(dbFilepath, "utf-8"));
const router = (req, res) => {
    const { url, method } = req;

    // Add CORS headers to the response
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight OPTIONS request
    if (method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const sendJSONResponse = (res, status, data) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    };

    if (url === "/api/events" && method === "GET") {
        if (eventsList.length > 0) {
            sendJSONResponse(res, 200, eventsList);
        } else {
            sendJSONResponse(res, 404, { message: "No events found" });
        }
    } else if (url.match(/\/api\/events\/\d+/) && method === "GET") {
        const id = parseInt(url.split("/")[3]);
        const event = eventsList.find((event) => event.id === id);
        if (event) {
            sendJSONResponse(res, 200, event);
        } else {
            sendJSONResponse(res, 404, { message: "Event not found" });
        }
    } else if (url === "/api/events" && method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const newEvent = JSON.parse(body);
            eventsList.push(newEvent);
            sendJSONResponse(res, 201, newEvent);
        });
    } else if (url.match(/\/api\/events\/\d+/) && method === "PUT") {
        const id = parseInt(url.split("/")[3]);
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const updatedEvent = JSON.parse(body);
            eventsList = eventsList.map((event) => (event.id === id ? updatedEvent : event));
            sendJSONResponse(res, 200, updatedEvent);
        });
    } else if (url.match(/\/api\/events\/\d+/) && method === "DELETE") {
        const id = parseInt(url.split("/")[3]);
        eventsList = eventsList.filter((event) => event.id !== id);
        sendJSONResponse(res, 200, { message: "Event deleted" });
    } else {
        sendJSONResponse(res, 404, { message: "Route not found" });
    }
};
function writeEventsToFile(eventsList) {
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(eventsList, null, 2), 'utf8');
}


module.exports = router;
