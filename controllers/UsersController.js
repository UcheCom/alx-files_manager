import dbClient from '../utils/db';
import redisClient from '../utils/redis';
// import sha1 from 'sha1';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email) {
      request.status(400).json({ error: 'Missing email' });
      response.end();
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      response.end();
      return;
    }

    const exist = await dbClient.userExist(email);
    if (exist) {
      response.status(400).json({ error: 'Already exist' });
      response.end();
      return;
    }

    const user = await dbClient.createUser(email, password);
    const id = `${user.insertedId}`;
    response.status(201).json({ id, email });
    response.end();
  }

  static async getMe(request, response) {
    function unAuthError(response) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
    }

    const token = request.headers['x-token'];
    if (!token) {
      unAuthError(response);
      return;
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      unAuthError(response);
      return;
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      unAuthError(response);
      return;
    }
    response.json({ id: user._id.toString(), email: user.email }).end();
  }
}

export default UsersController;