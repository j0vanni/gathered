const db = require("../config/firebase");

async function findOrCreateUser(profile) {
  try {
    const userRef = db.collection("users");

    const querySnapshot = await userRef
      .where("googleId", "==", profile.id)
      .get();

    const themeColors = {
      accent: "#f5f5f5",
      background: "#ffffff",
      border: "#000000",
      card: "#ffffff",
      foreground: "#000000",
      muted: "#f5f5f5",
      primary: "#171717",
      secondary: "#000000",
      sidebarAccent: "#f4f4f5",
      sidebarAccentForeground: "#18181b",
      sidebarBackground: "#fafafa",
      sidebarBorder: "#e5e7eb",
      sidebarForeground: "#3f3f46",
      sidebarPrimary: "#18181b",
      sidebarPrimaryForeground: "#fafafa",
    };

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];

      return { id: userDoc.id, ...userDoc.data() };
    } else {
      const newUserRef = userRef.doc();
      const newUserData = {
        googleId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        photo: profile.photos[0].value,
        createdAt: new Date(),
        colors: themeColors,
      };

      await newUserRef.set(newUserData);
      return { id: newUserRef.id, ...newUserData };
    }
  } catch (error) {
    res.clearCookie("token");
    if (error.code === "auth/user-not-found") {
      res.clearCookie("token");
    } else {
      console.error(error);
    }
  }
}

async function getUserById(id) {
  const userDoc = await db.collection("users").doc(id).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  return { id: userDoc.id, ...userDoc.data() };
}

async function saveColors(id, colors) {
  try {
    const userDoc = await db.collection("users").doc(id).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    const userData = userDoc.data();
    userData.colors = colors;
    await db.collection("users").doc(id).set(userData);
    return { id: userDoc.id, ...userData };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getColors(id) {
  const userDoc = await db.collection("users").doc(id).get();
  if (!userDoc.exists) {
    throw new Error("User not found");
  }
  return userDoc.data().colors;
}

module.exports = {
  findOrCreateUser,
  getUserById,
  saveColors,
  getColors,
};
