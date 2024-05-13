import { MongoClient, } from 'mongodb';
import sha1 from 'sha1';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
// MongoDB client created
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) {
        this.db = null;
        console.error(err);
      } else {
        this.db = this.client.db(database);
        console.log('Server connected');
      }
    });
   }

   isAlive () {
    return !!this.db;
   }

   async nbUsers() {
    // This gets the number of documents in the collection users
    if (!this.isAlive()) return 0;
    return this.db.collection('users').countDocuments();
   }

   async nbFiles() {
    // This gets the number of documents in the collection files
    if (!this.isAlive()) return 0;
    return this.db.collection('files').countDocuments();
   }

   async getUser(email) {
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').find({ email }).toArray();
    if (!user.length) return null;
    return user[0];
  }

  async userExist(email) {
    const user = await this.getUser(email);
    if (user) return true;
    return false;
  }

  async createUser(email, password) {
    const hashPwd = sha1(password);
    await this.client.connect();

    const res = await this.client.db(this.database)
      .collection('users').insertOne({ email, password: hashPwd });
    return res;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;