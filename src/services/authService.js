const { CustomError } = require("../utils/error");
const { prisma } = require("../utils/prisma");

const addUser = async (username, password, isAdmin, name) => {
  try {
    await prisma.users.create({
      data: {
        username,
        password,
        isAdmin,
        name,
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};

const getByUsername = async (username) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
    });

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
  getByUsername,
};
