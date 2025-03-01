const listService = require("../services/listService");
const { decodeToken } = require("../controllers/authController");

exports.createList = async (req, res) => {
  const { listName } = req.body;
  const user = req.user;
  try {
    const list = await listService.createList(
      listName,
      user.googleId,
      user.displayName,
      user.email,
      user.photo
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to create list" });
  }
};

exports.addUserToList = async (req, res) => {
  const user = req.user;
  const { listId, userEmail } = req.body;

  try {
    const list = await listService.addUserToList(user, listId, userEmail);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to add user to list" });
  }
};

exports.removeUserFromList = async (req, res) => {
  const user = req.user;
  const { listId, userId } = req.body;
  try {
    const list = await listService.removeUserFromList(listId, userId, user);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove user from list" });
  }
};

exports.getLists = async (req, res) => {
  const user = req.user;
  try {
    const lists = await listService.getLists(user.googleId);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: "Failed to get lists" });
  }
};

exports.addItemToList = async (req, res) => {
  const user = req.user;
  const { listId, itemId, itemType } = req.body;
  try {
    const list = await listService.addItemToList(listId, itemId, itemType);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to list" });
  }
};

exports.removeItemFromList = async (req, res) => {
  const user = req.user;
  const { listId, itemId, itemType } = req.body;
  try {
    const list = await listService.removeItemFromList(listId, itemId, itemType);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from list" });
  }
};

exports.updateWatching = async (req, res) => {
  const user = req.user;
  const { listId, itemId, watching, itemType } = req.body;
  try {
    const list = await listService.updateWatching(
      listId,
      itemId,
      watching,
      itemType
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to update watching" });
  }
};

exports.updateList = async (req, res) => {
  const user = req.user;
  const { listId, name, users } = req.body;
  try {
    const list = await listService.updateList(listId, name, users);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to update list" });
  }
};

exports.deleteList = async (req, res) => {
  const user = req.user;
  const { listId } = req.body;
  try {
    const list = await listService.deleteList(listId);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete list" });
  }
};
