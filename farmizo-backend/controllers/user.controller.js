const userService = require("../services/user.service");

// ==========================
// Get Profile
// ==========================
exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================
// Update Profile
// ==========================
exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser =
      await userService.updateProfile(
        req.user._id,
        req.body
      );

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
