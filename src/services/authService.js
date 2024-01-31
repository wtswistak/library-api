const { CustomError } = require("../utils/error");
const { prisma } = require("../utils/prisma");

const addUser = async (username, password, isAdmin, name) => {
  try {
    const isUsernameExist = await prisma.users.findUnique({
      where: {
        username,
      },
    });
    if (isUsernameExist) {
      throw new CustomError(400, "Username is taken");
    }

    const user = await prisma.users.create({
      data: {
        username,
        password,
        isAdmin,
        name,
      },
    });
    console.log("User added:", user);
    return user;
  } catch (error) {
    throw error;
  }
};
const getUser = async (username) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new CustomError(400, "Invalid username");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addUser,
  getUser,
};
