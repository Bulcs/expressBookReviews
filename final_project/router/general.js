const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  let userFound = {};

  if (username && password) {
    userFound = users.filter((user) => {
      return user.username === username;
    });

    if (userFound == false) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "User already exist" });
    }
  } else {
    return res.status(400).json({ error: "User and password invalid" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(300).json({ message: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn) {
    return res.status(300).json({ message: books[isbn] });
  } else return res.status(400).json({ message: "ISBN didn't founded" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksFromAuthor = {};

  if (author) {
    Object.entries(books).forEach((value, key) => {
      if (value[1].author == author) booksFromAuthor[key] = value;
    });
    return res.status(300).json({ message: booksFromAuthor });
  } else return res.status(400).json({ message: "Author didn't founded" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;

  let booksFromTitle = {};

  if (title) {
    Object.entries(books).forEach((value, key) => {
      if (value[1].title == title) booksFromTitle[key] = value;
    });

    return res.status(300).json({ message: booksFromTitle });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookFromISBN = {};

  if (isbn) {
    Object.entries(books).forEach((value, key) => {
      if (value[1].reviews == isbn) bookFromISBN[key] = value;
    });

    if (bookFromISBN.length > 0) {
      return res.status(300).json({ message: bookFromISBN });
    } else {
      return res.status(204).send();
    }
  }
});

module.exports.general = public_users;
