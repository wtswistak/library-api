const { CustomError } = require("../utils/error");
const { prisma } = require("../utils/prisma");

const addUser = async (username, password, isAdmin, name) => {
  await prisma.users.create({
    data: {
      username,
      password,
      isAdmin,
      name,
    },
  });
  return;
};

const getByUsername = async (username) => {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
  });

  return user;
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
