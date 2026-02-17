const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const fs = require("fs");
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid");

const PORT = 3000;
app.use(cors());
app.use(express.json());

const USER_FILE = path.join(__dirname, "db.json");

//function to read users from our db
function readUsers() {
  const data = fs.readFileSync(USER_FILE, "utf-8");
  return JSON.parse(data);
}

//Function to write data to db
function writeUsers(data) {
  fs.writeFileSync(USER_FILE, JSON.stringify(data, null, 2));
}

//Creating the sign up eendpoint
app.post("/signup", async (req, res) => {
  //object destructuring
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const data = readUsers();

  const userExists = data.users.some((user) => user.email === email);

  if (userExists) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password,10)

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password:hashedPassword,
    score: 0,
  };
  data.users.push(newUser);
  writeUsers(data);
  res.status(201).json({
    message: "Account created successfully",
  });
});

//sign in endpoint
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const data = readUsers();

  const user = data.users.find((user) => user.email == email);

  //checks if a user exists in the database
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }

  const passwordMatch = await bcrypt.compare(password,user.password);

  //checking if the passwords match
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //if the login is succesifull the data that is returned to the client
  res.json({
    message: "Login succesifull",
    user: {
      id: user.id,
      username: user.username,
      score: user.score,
    },
  });
});

app.get("/", (req, res) => {
  res.send("<h1>This is what the server returns</h1>");
});

app.get("/getuserscores", (req, res) => {
  const data = readUsers();
  const users = data.users;
  res.send(users);
});

app.post("/updateuserscore", (req, res) => {
  const data = readUsers()
  const { Id, newScore } = req.body;
  const user = data.users.find((user) => user.id == Id);
  user.score = newScore
  writeUsers(data)
  res.json({message:"Score saved succesifully"})

});

app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
