const cloudinary = require("../config/cloudinary");

const uploadImage = async (fileBuffer, folder = "freelancehub/avatars") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder, 
          resource_type: "image", 
          transformation: [
            { width: 500, height: 500, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { format: "webp" }, 
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              url: result.secure_url, 
              publicId: result.public_id, 
            });
        },
      )
      .end(fileBuffer);
  });
};

const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error.message);
  }
};

module.exports = { uploadImage, deleteImage };