const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const usersFile = process.cwd() + "/db/users.json";

let users = [];

// Read user data from the JSON file on server startup
fs.readFile(usersFile, "utf8", (err, data) => {
  try {
    if (err) {
      throw err;
    }
    users = JSON.parse(data);
  } catch (err) {
    console.error("Error reading user data from file:", err);
  }
});

// Function to save user data to the JSON file
const saveUsersToFile = () => {
  fs.writeFile(usersFile, JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error saving users to file:", err);
    }
  });
};

exports.register = (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User(username, hashedPassword);
    users.push(newUser);
    saveUsersToFile(); // Save the updated user data to the file
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);
    if (
      user &&
      typeof password === "string" &&
      typeof user.password === "string"
    ) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          { username: user.username },
          process.env.SECRET_KEY
        );
        res.json({ token });
        return;
      }
    }
    res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
