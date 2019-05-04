const { MongoClient, ObjectID } = require('mongodb');

const { DB = 'mongodb://localhost:27017/books' } = process.env;

let client;

async function connectDB() {
  if (!client) {
    client = await MongoClient.connect(DB, { useNewUrlParser: true });
  }
  return client.db();
}

//CRUD Create a book
async function create(title) {
  const db = await connectDB();
  const collection = db.collection('book');
  const result = await collection.insertOne({ title });
  return result.ops[0];
}
module.exports.newBook = create;

//CRUD Find all books
async function find() {
  const db = await connectDB();
  const collection = db.collection('book');
  const result = await collection.find();
  return result;
}
module.exports.find = find;

//CRUD Find one book by it's ID
async function findByID(id) {
  if (!ObjectID.isValid(id)) return null;
  id = new ObjectID(id);
  const db = await connectDB();
  const collection = db.collection('book');
  const result = await collection.findOne({ _id: id });
  return result;
}
module.exports.findByID = findByID;

//CRUD add new comment
async function addComment(id, comment) {
  if (!ObjectID.isValid(id)) return null;
  id = new ObjectID(id);
  const db = await connectDB();
  const collection = db.collection('book');
  const result = await collection.updateOne(
    { _id: id },
    { $push: { comment: comment } },
    { upsert: true }
  );
  return result;
}
module.exports.addComment = addComment;

//CRUD Delete book by ID
async function deleteById(id) {
  if (!ObjectID.isValid(id)) return null;
  id = new ObjectID(id);
  const db = await connectDB();
  const collection = db.collection('book');
  const result = await collection.deleteOne({ _id: id });
  return result;
}
module.exports.deleteById = deleteById;

//CRUD Delete all books
async function deleteAllBooks() {
  const db = await connectDB();
  const collection = await db.collection('book');
  const result = await collection.drop();
  return result;
}
module.exports.deleteAllBooks = deleteAllBooks;
