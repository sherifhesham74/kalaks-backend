const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const accessoriesShopSchema = new mongoose.Schema({
  image: String,
  id: Number,
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: String,
  phone: Number,
  start_Date: Number,
  description: String,
});

// static signup method
accessoriesShopSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const accessoriesShop = await this.create({ email, password: hash });

  return accessoriesShop;
};

// static login method
accessoriesShopSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const accessoriesShop = await this.findOne({ email });
  if (!accessoriesShop) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, accessoriesShop.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return accessoriesShop;
};

accessoriesShopModel = new mongoose.model(
  "AccessoriesShop",
  accessoriesShopSchema
);
module.exports = accessoriesShopModel;
