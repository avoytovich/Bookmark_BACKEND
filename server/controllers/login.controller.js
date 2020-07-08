const { User } = require('./../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const secret_key = require('./../../config/jwt.secretkey').key;
const secret_refresh = require('./../../config/jwt.secretkey').refreshKey;
const constants = require('./../helper/constants');
const { login: messages } = require('./../helper/messages');

const tokenList = {};

module.exports = {
  tokenList,
  login(req, res) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (user) {
          if (passwordHash.verify(req.body.password, user.password)) {
            if (user.isActivated) {
              const token = jwt.sign({ id: user.id }, secret_key, {
                expiresIn: constants.TIME_TOKEN,
              });
              const refreshToken = jwt.sign({ id: user.id }, secret_refresh, {
                expiresIn: constants.TIME_REFRESH_TOKEN,
              });
              const response = {
                message: messages.login,
                token,
                refreshToken,
                user_id: user.id,
              };
              tokenList[refreshToken] = response;
              return res.status(200).json(response);
            } else if (!user.isActivated) {
              return res.status(400).json({ message: messages.notActivated });
            }
          } else if (user.isActivated) {
            return res.status(400).json({ message: messages.notValidPassword });
          } else if (!user.isActivated) {
            return res.status(400).json({ message: messages.notActivated });
          }
        } else {
          User.create({
            email: req.body.email,
            password: passwordHash.generate(req.body.password),
            isActivated: false,
          }).then((user) =>
            res.status(200).json({ message: messages.soonActivate })
          );
        }
      })
      .catch((error) => res.status(401).send(error));
  },
  refreshToken(req, res) {
    // refresh the damn token
    const postData = req.body;
    // if refresh token exists
    if (postData.refreshToken && postData.refreshToken in tokenList) {
      const user = {
        id: postData.id,
      };
      const token = jwt.sign(user, secret_key, {
        expiresIn: constants.TIME_TOKEN,
      });
      const response = {
        token: token,
      };
      // update the token in the list
      tokenList[postData.refreshToken].token = token;
      res.status(200).json(response);
    } else {
      res.status(403).send('Invalid request');
    }
  },
};
