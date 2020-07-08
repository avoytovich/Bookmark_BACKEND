const { SubGroupOfBookmarks } = require('./../models');

const { subGroupOfBookmark: messages } = require('./../helper/messages');

module.exports = {
  create(req, res) {
    const dataCreate = Object.assign({}, req.body, {
      GroupOfBookmarksId: req.params.group,
    });
    SubGroupOfBookmarks.create(dataCreate)
      .then((subGroupOfBookmarks) =>
        res.status(200).json({ message: messages.created })
      )
      .catch((error) => res.status(404).send(error));
  },
  list(req, res) {
    SubGroupOfBookmarks.findAll({
      where: { GroupOfBookmarksId: req.params.group },
    })
      .then((subGroups) => res.status(200).json({ subGroups }))
      .catch((error) => res.status(404).send(error));
  },
  retrieve(req, res) {
    SubGroupOfBookmarks.findOne({
      where: { id: req.params.subgroup },
    })
      .then((subGroup) => res.status(200).json({ subGroup }))
      .catch((error) => res.status(404).send(error));
  },
  delete(req, res) {
    const subGroupsIds = req.body.map((each) => each.id);
    SubGroupOfBookmarks.destroy({ where: { id: subGroupsIds } })
      .then((subGroups) => res.status(200).json({ subGroups }))
      .catch((error) => res.status(404).send(error));
  },
};
