const { User, Profile } = require('./../models');
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');

// DEV
// const secret_key = require('./../../config/jwt.secretkey.json').key;
// PROD
const secret_key = process.env.JWT_SECRET_KEY;

// DEV
// const secret_refresh = require('./../../config/jwt.secretkey.json').refreshKey;
// PROD
const secret_refresh = process.env.JWT_SECRET_REFRESH;

const constants = require('./../helper/constants');

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
                message: 'Congratulation, you are logged!',
                token,
                refreshToken,
                user_id: user.id,
              };
              tokenList[refreshToken] = response;
              return res.status(200).json(response);
            }
          } else if (user.isActivated) {
            return res
              .status(400)
              .json({ message: 'Inputted password is not valid' });
          } else if (!user.isActivated) {
            return res
              .status(400)
              .json({ message: "Your account isn't activated" });
          }
        } else {
          return res
            .status(400)
            .json({ message: 'Before login you must sign up!' });
        }
      })
      .catch((error) => res.status(401).send(error));
  },
  activation(req, res) {
    let token = req.params.token;
    let decoder = jwt.verify(token, secret_key, (err, decoded) => {
      return (
        (decoded && decoded.id) ||
        res.status(498).json({ message: 'link is not valid' })
      );
    });
    User.findById(decoder)
      .then((user) => {
        (!user && res.status(404).json({ message: 'userNotFound' })) ||
          (user.isActivated &&
            res.status(418).json({ message: 'linkAlreadyActivated' })) ||
          (user.update({
            isActivated: true,
          }) &&
            Profile.create({
              UserId: decoder,
            }) &&
            res.redirect('http://localhost:8080/'));
      })
      .catch((error) => res.status(400).send(error));
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
      res.status(404).send('Invalid request');
    }
  },
};
