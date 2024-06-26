const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const app = express();
app.use(express.json());

app.use(cors());
const dbPath = path.join(__dirname, "task.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4001, () => {
      console.log("Server Running at http://localhost:4001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();


// Checking Authentication...

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        
        next();
      }
    });
  }
};


//Registe_API!!!

app.post("/register", async (request, response) => {
  const { name, phone, email, password } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE name = '${name}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        user (name, phone, email, password) 
      VALUES 
        (
          
          '${name}',
          '${phone}',
          '${email}',
          '${hashedPassword}'
          
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.send(`Created new user with ${newUserId}`);
  } else {
    response.status = 400;
    response.send("User already exists");
  }
});

//Login_API!!!!

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE name = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400).json({ error: "Invalid Password" });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      // response.send("Login Success!");
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.send({ jwtToken });
    } else {
      
      response.status(400).json({ error: "Invalid Password" });
    }
  }
});


//Getting Users Data...

app.get("/user/", authenticateToken, async (request, response) => {
  const getUsersQuery = `
  SELECT
    *
  FROM
    user
  ORDER BY
    id;`;
  const usersArray = await db.all(getUsersQuery);
  response.send(usersArray);
});








//Delete User Data...

app.delete("/user/:userId/",authenticateToken, async (request, response) => {
  const { userId } = request.params;
  const delete1query = `DELETE FROM user WHERE id = ${userId};`;
  const res4 = await db.run(delete1query);
  response.send("user Deleted");
});

























module.exports = app;