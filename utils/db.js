import { MongoClient, ObjectID } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // MongoDB client created
    const uri = `mongodb://${host}:{port}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.client.connect((error) => {
        if (error) {
            this.db = null;
            console.error(error);
        } else {
            this.db = this.client.db(database);
            console.log('DB connected');
        }
    });
   }

   isAlive () {
    return !!this.db;
   }

   async nbUsers() {
    // This gets the number of documents in the collection users
    if (!this.isAlive) return 0;
    return this.db.collection('users').countDocuments();
   }

   async nbFiles() {
    // This gets the number of documents in the collection files
    if (!this.isAlive) return 0;
    return this.db.collection('files').countDocuments();
   }
}

const dbClient = new DBClient();

export default dbClient;