/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const books = require('../controllers/books');

module.exports = function(app) {
  app
    .route('/api/books')
    .get(function(req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      books
        .find()
        .then(cursor => cursor.toArray())
        .then(arr =>
          arr.map(book => {
            return {
              _id: book._id,
              title: book.title,
              commentcount: book.comment ? book.comment.length : 0
            };
          })
        )
        .then(arr => res.json(arr))
        .catch(console.error);
    })

    .post(function(req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.send('you have to give a title');
      books
        .newBook(title)
        .then(result => {
          if (result) {
            res.json({ title: result.title, _id: result._id });
          }
        })
        .catch(console.error);
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      books
        .deleteAllBooks()
        .then(result => {
          if (result) {
            res.send('complete delete successful');
          }
        })
        .catch(console.error);
    });

  app
    .route('/api/books/:id')
    .get(function(req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      books
        .findByID(bookid)
        .then(book => {
          if (book) {
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comment || []
            });
          } else {
            res.send('no book exists');
          }
        })
        .catch(console.error);
    })

    .post(function(req, res) {
      var comment = req.body.comment;
      var bookid = req.params.id;
      //json res format same as .get
      books
        .addComment(bookid, comment)
        .then(book => {
          if (book.result.ok) {
            return books.findByID(bookid);
          } else {
            return null;
          }
        })
        .then(book => {
          if (book) {
            res.json({
              _id: book._id,
              title: book.title,
              comments: book.comment
            });
          } else {
            res.send('no book exists');
          }
        })
        .catch(console.error);
    })

    .delete(function(req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      books
        .deleteById(bookid)
        .then(response => {
          if (response.result.ok) {
            res.send('delete successful');
          }
        })
        .catch(console.error);
    });
};
