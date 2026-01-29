import User from "../models/User.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE PROFILE (TEXT)
export const updateProfile = async (req, res) => {
  try {
    const { username, phone, address } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      username: user.username,
      phone: user.phone,
      address: user.address,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// UPDATE PROFILE IMAGE
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const user = await User.findById(req.user.id);

    user.profileImage = req.file.path;       // Cloudinary URL
    user.profileImageId = req.file.filename; // Cloudinary public_id
    await user.save();

    console.log("Cloudinary URL:", req.file.path);
    console.log("Public ID:", req.file.filename);

    res.json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
};
