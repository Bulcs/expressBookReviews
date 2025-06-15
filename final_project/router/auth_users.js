const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  const userFounded = users.filter((user) => {
    if(user.username === username && user.password === password){
      return true;
    } else {
      return false;
    }
  });

  return userFounded;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User logged in");
  } else {
    return res.status(208).json({ message: "User or password invalid" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const username = req.session.authorization.username;
  const {isbn} = req.params;

  const reviewsFromISBN = books[isbn].reviews;
  let editReview = false;

  if (reviewsFromISBN) {
    Object.values(reviewsFromISBN).forEach(reviewItem => {
      if (reviewItem.username === username) {
        reviewItem.review = review;
        editReview = true;
      }
    });
  }

  if (!editReview) {
    Object.assign(books[isbn].reviews, { "username": username, "review": review });
  }
  
  return res.status(200).json({ message: "Review created" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => { 
  const { isbn } = req.params;
  const username = req.session.authorization.username;

  let selectedReview = books[isbn].reviews;

  for (const [key, value] of Object.entries(selectedReview)) {
    if (key == "username" && value === username) {
      delete selectedReview.username;
      delete selectedReview.review;
      res.status(200).json({message: 'Review deleted successfully'})
    }
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
