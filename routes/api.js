/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const books = require('../controllers/books');
const objectId = require("mongodb").ObjectID;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      books.find()
      .then(cursor => cursor.toArray())
      .then(arr => arr.map(book => {
        return{
          _id: book._id, 
          title: book.title,
          commentcount: book.comment ? book.comment.length : 0
        }
       }))
       .then(arr => res.json(arr))
       .catch(err => {
        console.log(err.message); 
        res.send(err.message);
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) return res.send('you have to give a title')
      books.newBook(title)
      .then(result => {
        if(result){
          res.json({title: result.title, _id: result._id})
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send(err.message);
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      books.deleteAllBooks()
      .then(result => {
        if(result){
          res.send('complete delete successful');
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send(err.message);
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid;
      try {
        bookid = new objectId(req.params.id);
      } catch (error) {
        return res.send('no book exists');
      }      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      books.findByID(bookid)
      .then(book => {
        if(book){
          res.json({_id: book._id, title: book.title, comments: book.comment || []});
        }else{
          res.send('no book exists');
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send(err.message)}
        );
    })
    
    .post(function(req, res){
      var comment = req.body.comment;
      var bookid;
      try {
        bookid = new objectId(req.params.id);
      } catch (error) {
        return res.send('no book exists');
      }   
      //json res format same as .get
      books.addComment(bookid, comment)
      .then(result => result.value)
      .then(book => {
        if(book){
          res.json({_id: book._id, title: book.title, comments: book.comment || []});
        }else{
          res.send('no book exists');
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send(err.message)}
        );
    })
    
    .delete(function(req, res){
      var bookid;
      try {
        bookid = new objectId(req.params.id);
      } catch (error) {
        return res.send('no book exists');
      }   
      //if successful response will be 'delete successful'
      books.deleteById(bookid)
      .then(result => {
        if(result.ok === 1){
          res.send('delete successful')
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send(err.message)}
        );
    });
  
};
