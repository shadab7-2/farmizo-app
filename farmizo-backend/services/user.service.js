const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

// ==========================
// Get User Profile
// ==========================
exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "-password"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// ==========================
// Update User Profile
// ==========================
exports.updateProfile = async (
  userId,
  updates
) => {
  const allowedFields = ["name", "email", "address"];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field]) {
      filteredUpdates[field] = updates[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
