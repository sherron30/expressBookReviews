const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const doesExist = (username) => users.some(user => user.username === username);

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    res.send(JSON.stringify(books,null,10));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters

    // Assuming `books` is an object where keys are ISBNs and values are book details
    if (books[isbn]) {
        res.json(books[isbn]); // Return book details as JSON
    } else {
        res.status(404).json({ message: "Book not found" }); // Handle missing books
    }

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const author = req.params.author.trim().toLowerCase();

    // Filter books by matching the author name
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);

    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.trim().toLowerCase();

    // Filter books by matching the title name
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);

    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn] && books[isbn].reviews) {
        res.json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
