const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

let userswithsamename = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
    return true;
} else {
    return false;
}

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login

regd_users.post("/login", (req, res) => {
//Write your code here
  const { username, password } = req.body;
  const user = users.find((user) => {
    return user.username === username;
  });
  if (!user) {
    return res.status(401).json({
      message: "User not registered. Please sign up"
    });
  }
  if (user.password !== password) {
    return res.status(401).json({
      message: "Invalid username or password"
    });
  }
  const token = jwt.sign(
    { username: username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login successful",
    token: token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const { username , review} = req.body

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  if(!review){
    return res.status(400).json({message: "Review is required"});
  }

   books[isbn].reviews[username] = review
  return res.status(200).json({message: "Review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({
        message: "Review not found"
      });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully"
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
