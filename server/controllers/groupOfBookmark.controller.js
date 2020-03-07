const { GroupOfBookmarks } = require('./../models');

module.exports = {
    create(req, res) {
        const dataCreate = Object.assign({}, req.body, {UserId: req.decoded.id})
        GroupOfBookmarks.create(dataCreate)
            .then(groupOfBookmarks => res.status(200).json({message: 'groupOfBookmarks was created!'}))
            .catch(error => res.status(404).send(error));
    }
};