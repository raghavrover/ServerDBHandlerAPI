const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running on 3000...");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET players details
app.get("/players/", async (req, res) => {
  try {
    const getPlayersDetailsQuery = `
    SELECT *
    FROM cricket_team;`;

    const playersDetailsArray = await db.all(getPlayersDetailsQuery);
    res.send(playersDetailsArray);
  } catch (e) {
    console.log(e.message);
  }
});

//POST player details
app.post("/players/", async (req, res) => {
  try {
    const playerDetails = req.body;
    const { player_name, jersey_number, role } = playerDetails;
    const createPlayerQuery = `
  INSERT INTO 
  cricket_team (player_name, jersey_number, role)
  VALUES
  ('${player_name}',
   '${jersey_number}',
    '${role}');
  `;

    const newDB = await db.run(createPlayerQuery);
    res.send("Player Added to Team");
    console.log(newDB.lastID);
  } catch (e) {
    console.log(e.message);
  }
});

//GET player details
app.get("/players/:playerId/", async (req, res) => {
  try {
    const { playerId } = req.params;
    const getPlayerDetailsQuery = `
    SELECT *
    FROM cricket_team
    WHERE player_id= ${playerId};
    `;
    const playerDetails = await db.get(getPlayerDetailsQuery);
    res.send(playerDetails);
  } catch (e) {
    console.log(e.message);
  }
});

//PUT player details
app.put("/players/:playerId/", async (req, res) => {
  try {
    const { playerId } = req.params;
    const playerDetails = req.body;
    const { player_name, jersey_number, role } = playerDetails;
    const updatePlayerDetails = `
    UPDATE cricket_team
    SET 
    player_name = '${player_name}',
    jersey_number = ${jersey_number},
    role = '${role}'
    WHERE player_id = ${playerId};
    `;
    await db.run(updatePlayerDetails);
    res.send("Player Details Updated");
  } catch (e) {
    console.log(e.message);
  }
});

//DELETE player from cricket_team
app.delete("/players/:playerId/", async (req, res) => {
  try {
    const { playerId } = req.params;
    const deletePlayerQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;

    await db.run(deletePlayerQuery);
    res.send("Player Removed");
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = app;
# ServerDBHandlerAPI
