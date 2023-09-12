const User = require('../models/User');
const crypto = require('crypto-js');
const jwt = require('jwt-decode');
require('dotenv').config();

class userController {
  static async register(req, res) {
    const { dataEncrypted } = req.body;

    if(!dataEncrypted)
      return res.status(400).send({ message: 'invalid data.' })

    const dataDecrypted = crypto.AES.decrypt(dataEncrypted, process.env.SECRET).toString(crypto.enc.Utf8);
    const data = JSON.parse(dataDecrypted);

    if(!data.username || !data.password)
      return res.status(400).send({ message: 'invalid data.' })

    const user = {
      username: data.username,
      password: crypto.AES.encrypt(JSON.stringify(data.password), process.env.DB_SECRET).toString()
    }

    try {
      await User.create(user);
      return res.status(200).send({ message: 'Successfull!' })
    } catch (err) {
      return res.status(500).send({ message: `Error: ${err}` })
    }
  }

  static async login(req, res) {
    const { dataEncrypted } = req.body;

    if(!dataEncrypted) 
      return res.status(400).send({ message: 'invalid data.' })

    const dataDecrypted = crypto.AES.decrypt(dataEncrypted, process.env.SECRET).toString(crypto.enc.Utf8);
    const data = JSON.parse(dataDecrypted);

    if(!data.username || !data.password)
      return res.status(400).send({ message: 'invalid data.' })

    const query = User.find({ username: data.username }) // todo
  }
}

module.exports = userController;