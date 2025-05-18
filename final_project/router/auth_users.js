const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if a username is valid (not empty and unique)
const isValid = (username) => {
    return username && !users.some(user => user.username === username);
};

// Function to authenticate a user based on username & password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// **Task 7: Login as a Registered User**
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid login credentials" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Login successful", accessToken });
});


// **Task 8: Add or Modify a Book Review**
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "Unauthorized: Please log in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review; // Save or update review
    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// **Task 9: Delete a Book Review**
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "Unauthorized: Please log in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found to delete" });
    }

    delete books[isbn].reviews[username]; // Remove the user's review
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

// Export required modules
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
