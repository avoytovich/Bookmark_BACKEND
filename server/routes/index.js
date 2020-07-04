const {
  userController,
  loginController,
  groupOfBookmarkController,
  subGroupOfBookmarkController,
  bookmarkController,
  articleController,
  searchController,
} = require('./../controllers');

module.exports = (app) => {
  app.get('/test', (req, res) =>
    res.status(200).send({
      message: 'Welcome',
    })
  );

  app.post('/login', loginController.login);
  app.post('/token', loginController.refreshToken);

  app.get('/user/:id', userController.retrieve);
  app.get('/user/:id/user_list', userController.list);
  app.post('/user/:id/user_activate', userController.activation);
  app.post('/user/:id/user_deactivate', userController.deactivation);
  app.delete('/user/:id/user_delete', userController.delete);

  app.post('/user/:id/group_create', groupOfBookmarkController.create);
  app.get('/user/:id/group_list', groupOfBookmarkController.list);
  app.delete('/user/:id/groups_delete', groupOfBookmarkController.delete);

  app.post(
    '/user/:id/group/:group/subgroup_create',
    subGroupOfBookmarkController.create
  );
  app.get(
    '/user/:id/group/:group/subgroup_list',
    subGroupOfBookmarkController.list
  );
  app.get(
    '/user/:id/subgroup/:subgroup',
    subGroupOfBookmarkController.retrieve
  );
  app.delete(
    '/user/:id/group/:group/subgroup_delete',
    subGroupOfBookmarkController.delete
  );

  app.post(
    '/user/:id/group/:group/subgroup/:subgroup/bookmark_create',
    bookmarkController.create
  );
  app.get(
    '/user/:id/group/:group/subGroup/:subgroup/bookmark_list',
    bookmarkController.list
  );
  app.post(
    '/user/:id/group/:group/subgroup/:subgroup/bookmark/:bookmark/bookmark_move',
    bookmarkController.move
  );
  app.delete(
    '/user/:id/group/:group/subGroup/:subgroup/bookmark_delete',
    bookmarkController.delete
  );

  app.get('/user/:id/article', articleController.retrieve);

  app.get('/user/:id/search', searchController.list);
};
