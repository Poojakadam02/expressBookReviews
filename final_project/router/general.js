const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')

public_users.post("/register", (req,res) => {
  //Write your code here
   const { username , password} = req.body
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"})
  }
   if(isValid(username)){
    return res.status(409).json({message: "Username already exists"})
  }
  users.push({
    username: username,
    password: password
  })
  
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) =>{
  //Write your code here
  try{
    return res.status(200).json({books:books});
  }catch(error){
    return res.status(500).json({
        message: 'Error fetching book list'
      })
  }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  try{
  const isbn = req.params.isbn
  const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
  return res.status(200).json(response.data)
  }catch(error) {
    if(error.response && error.status === 404){
        return res.status(404).json({
            message: 'Book not found for this ISBN'
        })
    }

    return res.status(500).json({
        message: 'Error fetching book details'
      })

  }
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  const result = Object.values(books).filter((book)=>{
    book.author.toLowerCase() === author.toLowerCase()
  })
  if(result.length > 0){
   return res.status(200).json(result);
  }

  return res.status(404).json({message: "No books found for this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   const title = req.params.title
  const result = Object.values(books).filter((book)=>{
    book.title.toLowerCase() === title.toLowerCase()
  })
  if(result.length > 0){
   return res.status(200).json(result);
  }
  return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if(books[isbn]){
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
