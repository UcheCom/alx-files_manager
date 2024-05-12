import express from 'express';
import routes from './routes/index.js';


const server = express();
const port = process.env.PORT || 5000;

server.use(express.json);
server.use('/', routes);

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});

export default server;