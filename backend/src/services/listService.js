const db = require("../config/firebase");
const { getDetailsTV, getDetailsMovie } = require("./detailsService");

async function createList(listName, userId, userName, userEmail, userPhoto) {
  try {
    const listCollection = db.collection("lists");
    const newListRef = listCollection.doc();

    const newList = {
      name: listName,
      listId: newListRef.id,
      users: [
        { id: userId, name: userName, email: userEmail, photo: userPhoto },
      ],
      userIds: [userId],
      items: [],
      createdAt: new Date(),
    };

    await newListRef.set(newList);
    return { id: newListRef.id, ...newList };
  } catch (error) {
    return { error: error.message };
  }
}

async function addUserToList(user, listId, userEmail) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();
    if (listData.userIds.includes(user.googleId) === false) {
      throw new Error("User not in list to add new user");
    }

    const usersRef = db.collection("users");
    const userSnapshot = await usersRef
      .where("email", "==", userEmail)
      .limit(1)
      .get();

    const userDoc = userSnapshot.docs[0].data();
    const newUser = {
      id: userDoc.googleId,
      email: userDoc.email,
      name: userDoc.displayName,
      photo: userDoc.photo,
    };
    if (!newUser.id) {
      throw new Error("User document missing googleId");
    }

    listData.users.push(newUser);
    listData.userIds.push(newUser.id);
    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}

async function removeUserFromList(listId, userId, user) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }

    const listData = list.data();
    if (listData.userIds.length === 1) {
      throw new Error("Cannot remove last user from list");
    }

    if (!listData.userIds.includes(user.googleId)) {
      throw new Error("User not in list to remove");
    }

    if (userId === listData.userIds[0]) {
      throw new Error("Cannot remove owner from list");
    }

    if (listData.userIds.includes(userId)) {
      listData.users = listData.users.filter((user) => user.id !== userId);
      listData.userIds = listData.userIds.filter((id) => id !== userId);
    }
    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}

async function renameList(listId, newName) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();
    listData.name = newName;
    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}

async function deleteList(listId) {
  try {
    const listRef = db.collection("lists").doc(listId);
    await listRef.delete();
    return { id: listId };
  } catch (error) {
    return { error: error.message };
  }
}

async function addItemToList(listId, itemId, itemType) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();

    if (listData.items[itemId + itemType]) {
      throw new Error("Item already in list");
    }

    let details =
      itemType === "tv"
        ? await getDetailsTV(itemId)
        : await getDetailsMovie(itemId);

    details = {
      ...details,
      watching:
        itemType === "tv" ? { season: 1, episode: 1 } : { watched: false },
    };

    listData.items = {
      ...listData.items,
      [itemId + itemType]: { ...details },
    };

    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}

async function removeItemFromList(listId, itemId, itemType) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();
    delete listData.items[itemId + itemType];

    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}
async function getLists(userId) {
  try {
    const listRef = db.collection("lists");

    const snapshotQuery = await listRef
      .where("userIds", "array-contains", userId)
      .get();

    const lists = snapshotQuery.docs.map((doc) => doc.data());
    return lists;
  } catch (error) {
    throw error;
  }
}

async function isUserInList(listId, userId) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();
    return listData.users.some((user) => user.id === userId);
  } catch (error) {
    return { error: error.message };
  }
}

async function updateWatching(listId, itemId, watching, itemType) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();
    listData.items[itemId + itemType].watching = watching;
    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}

async function updateList(listId, name, users) {
  try {
    const listRef = db.collection("lists").doc(listId);
    const list = await listRef.get();
    if (!list.exists) {
      throw new Error("List not found");
    }
    const listData = list.data();
    listData.name = name;
    listData.users = users;
    await listRef.update(listData);
    return { id: listId, ...listData };
  } catch (error) {
    return { error: error.message };
  }
}

async function deleteList(listId) {
  try {
    const listRef = db.collection("lists").doc(listId);
    await listRef.delete();
    return { id: listId };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = {
  createList,
  addUserToList,
  getLists,
  addItemToList,
  removeItemFromList,
  updateWatching,
  updateList,
  deleteList,
  removeUserFromList,
};
