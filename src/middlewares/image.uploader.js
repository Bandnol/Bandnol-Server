import multer from "multer";
import mime from "mime-types";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("이미지 파일만 업로드할 수 있습니다."), false);
};

export const uploadMyPageImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 2,                  // photo + backgroundImg
  },
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "backgroundImg", maxCount: 1 },
]);