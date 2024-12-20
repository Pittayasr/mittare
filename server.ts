// server.ts
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 4000; // ใช้ PORT จากไฟล์ .env หรือค่าดีฟอลต์ 3000
const UPLOADS_DIR = process.env.UPLOADS_DIRECTORY || "uploads";

// เปิดใช้งาน CORS
app.use(cors());
app.use(express.json());

// server.ts
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath = path.join(UPLOADS_DIR, "forms");

    if (file.fieldname === "registrationBookFile") {
      folderPath = path.join(UPLOADS_DIR, "forms", "registrationBook");
    } else if (file.fieldname === "licensePlateFile") {
      folderPath = path.join(UPLOADS_DIR, "forms", "licensePlate");
    } else if (file.fieldname === "passportOrIDnumberFile") {
      folderPath = path.join(UPLOADS_DIR, "deliveries", "passportOrIDnumber");
    } else if (file.fieldname === "registrationBookFileDelivery") {
      folderPath = path.join(
        UPLOADS_DIR,
        "deliveries",
        "registrationBookDelivery"
      );
    } else if (file.fieldname === "licenseFileDelivery") {
      folderPath = path.join(UPLOADS_DIR, "deliveries", "licenseDelivery");
    } else if (
      file.fieldname == "printFile" &&
      file.mimetype === "application/pdf"
    ) {
      folderPath = path.join(UPLOADS_DIR, "prints", "pdf");
    } else if (
      file.fieldname == "printFile" &&
      ["image/jpeg", "image/png"].includes(file.mimetype)
    ) {
      folderPath = path.join(UPLOADS_DIR, "prints", "photo");
    }

    // ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created directory: ${folderPath}`);
    }

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // สุ่มตัวเลข 4 หลัก
    const ext = path.extname(file.originalname);
    const randomFileName = `${formattedDate}_${randomSuffix}${ext}`;
    cb(null, randomFileName);
  },
});

// ตั้งค่า multer
const upload = multer({ storage });

const ensureDirectoriesExist = () => {
  const directories = [
    path.join(UPLOADS_DIR, "forms"),
    path.join(UPLOADS_DIR, "forms", "registrationBook"),
    path.join(UPLOADS_DIR, "forms", "licensePlate"),
    path.join(UPLOADS_DIR, "deliveries", "passportOrIDnumber"),
    path.join(UPLOADS_DIR, "deliveries", "registrationBookDelivery"),
    path.join(UPLOADS_DIR, "deliveries", "licenseDelivery"),
    path.join(UPLOADS_DIR, "prints", "pdf"),
    path.join(UPLOADS_DIR, "prints", "photo"),
  ];

  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

ensureDirectoriesExist();

// ให้บริการไฟล์ที่อัปโหลด
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ลบไฟล์จาก server
app.delete("/delete-file", (req, res) => {
  const { fileName } = req.body; // รับชื่อไฟล์จาก client
  if (!fileName) {
    return res.status(400).json({ error: "No file name provided" });
  }

  const filePath = path.resolve(__dirname, "uploads", fileName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // ลบไฟล์
      console.log(`File deleted: ${fileName}`);
      res.status(200).json({ message: "File deleted successfully" });
    } else {
      console.error("File not found:", filePath);
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// Endpoint สำหรับอัปโหลดไฟล์
app.post(
  "/upload",
  upload.fields([{ name: "printFile", maxCount: 1 }]),
  (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const printFile = files["printFile"]?.[0];

      if (!printFile) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = `${req.protocol}://${req.get("host")}/uploads/${
        printFile.mimetype === "application/pdf" ? "prints/pdf" : "prints/photo"
      }/${printFile.filename}`;

      console.log(
        `File uploaded successfully: ${printFile.originalname}, accessible at: ${filePath}`
      );

      res.status(200).json({
        printFile: {
          filePath: filePath,
          storedFileName: printFile.filename,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// เพิ่ม endpoint สำหรับการอัปโหลดหลายไฟล์
app.post(
  "/upload-multiple",
  upload.fields([
    { name: "passportOrIDnumberFile", maxCount: 1 },
    { name: "registrationBookFileDelivery", maxCount: 1 },
    { name: "licenseFileDelivery", maxCount: 1 },
    { name: "registrationBookFile", maxCount: 1 },
    { name: "licensePlateFile", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // ตรวจสอบไฟล์ที่อัปโหลด
      const passportOrIDnumberFile = files["passportOrIDnumberFile"]?.[0];
      const registrationBookFileDelivery =
        files["registrationBookFileDelivery"]?.[0];
      const licenseFileDelivery = files["licenseFileDelivery"]?.[0];
      const registrationBookFile = files["registrationBookFile"]?.[0];
      const licensePlateFile = files["licensePlateFile"]?.[0];

      if (
        !passportOrIDnumberFile &&
        !registrationBookFile &&
        !licensePlateFile
      ) {
        return res.status(400).json({
          error: "At least one required file must be uploaded.",
        });
      }

      // สร้างเส้นทางไฟล์
      const passportOrIDnumberFilePath = passportOrIDnumberFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/deliveries/passportOrIDnumber/${
            passportOrIDnumberFile.filename
          }`
        : null;

      const registrationBookFileDeliveryPath = registrationBookFileDelivery
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/deliveries/registrationBookDelivery/${
            registrationBookFileDelivery.filename
          }`
        : null;

      const licenseFileDeliveryPath = licenseFileDelivery
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/deliveries/licenseDelivery/${licenseFileDelivery.filename}`
        : null;

      const registrationBookFilePath = registrationBookFile
        ? `${req.protocol}://${req.get(
            "host"
          )}/uploads/forms/registrationBook/${registrationBookFile.filename}`
        : null;

      const licensePlateFilePath = licensePlateFile
        ? `${req.protocol}://${req.get("host")}/uploads/forms/licensePlate/${
            licensePlateFile.filename
          }`
        : null;

      // สร้าง response
      const response = {
        passportOrIDnumberFile: passportOrIDnumberFile
          ? {
              filePath: passportOrIDnumberFilePath,
              storedFileName: passportOrIDnumberFile.filename,
            }
          : null,
        registrationBookFileDelivery: registrationBookFileDelivery
          ? {
              filePath: registrationBookFileDeliveryPath,
              storedFileName: registrationBookFileDelivery.filename,
            }
          : null,
        licenseFileDelivery: licenseFileDelivery
          ? {
              filePath: licenseFileDeliveryPath,
              storedFileName: licenseFileDelivery.filename,
            }
          : null,
        registrationBookFile: registrationBookFile
          ? {
              filePath: registrationBookFilePath,
              storedFileName: registrationBookFile.filename,
            }
          : null,
        licensePlateFile: licensePlateFile
          ? {
              filePath: licensePlateFilePath,
              storedFileName: licensePlateFile.filename,
            }
          : null,
      };

      console.log("Files uploaded successfully:", response);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
