const { Op } = require('sequelize');

const {
  User,
  Profile,
  GroupOfBookmarks,
  SubGroupOfBookmarks,
  Bookmarks,
} = require('./../models');

const { user: messages } = require('./../helper/messages');

module.exports = {
  retrieve(req, res) {
    User.findOne({
      where: { id: req.params.id },
    })
      .then((user) => res.status(200).json({ user }))
      .catch((error) => res.status(404).send(error));
  },
  list(req, res) {
    User.findAll({
      where: { id: { [Op.not]: req.params.id } },
    })
      .then((users) => res.status(200).json({ users }))
      .catch((error) => res.status(404).send(error));
  },
  activation(req, res) {
    User.findById(req.body.id)
      .then((user) => {
        user.update({
          isActivated: true,
        }) &&
          Profile.findOne({
            where: { UserId: req.body.id },
          }).then((profile) => {
            !profile &&
              Profile.create({
                UserId: req.body.id,
              });
          });
        res.status(200).json({ message: messages.activated });
      })
      .catch((error) => res.status(400).send(error));
  },
  deactivation(req, res) {
    User.findById(req.body.id)
      .then((user) => {
        user.update({
          isActivated: false,
        });
        res.status(200).json({ message: messages.deactivated });
      })
      .catch((error) => res.status(400).send(error));
  },
  delete(req, res) {
    GroupOfBookmarks.findAll({ where: { UserId: req.body.id } })
      .then((groups) => {
        groups &&
          groups.forEach((group) => {
            SubGroupOfBookmarks.findAll({
              where: { GroupOfBookmarksId: group.id },
            }).then((subgroups) => {
              subgroups &&
                subgroups.forEach((subgroup) => {
                  Bookmarks.findAll({
                    where: { SubGroupOfBookmarksId: subgroup.id },
                  })
                    .then((bookmarks) => {
                      bookmarks &&
                        bookmarks.forEach((bookmark) => {
                          Bookmarks.destroy({
                            where: { id: bookmark.id },
                          });
                        });
                    })
                    .then((data) => {
                      SubGroupOfBookmarks.destroy({
                        where: { id: subgroup.id },
                      });
                    });
                });
            });
          });
      })
      .catch((error) => res.status(404).send(error));
    setTimeout(() => {
      GroupOfBookmarks.destroy({
        where: { UserId: req.body.id },
      })
        .then((data) => {
          Profile.destroy({ where: { UserId: req.body.id } });
        })
        .then((data) => {
          User.destroy({ where: { id: req.body.id } }).then((user) => {
            res.status(200).json({ user });
          });
        })
        .catch((error) => res.status(404).send(error));
    }, 1000);
  },
};
