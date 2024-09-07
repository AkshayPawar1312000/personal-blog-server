const express = require("express");
const {
  createPersonalBlog,
  getAllPersonalBlog,
  getPersonalBlog,
  updatePersonalBlog,
  deletePersonalBlog,
} = require("../controllers/personalBlogsControllers");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Router Object
const router = express.Router();
// router.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
router.use(cookieParser());

const authenticateToken = (req, res, next) => {
  // Get token from cookies
  const token = req?.cookies.token; 

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  // Verify the token using your secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }

    // Token is valid, proceed to the next middleware or route
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  });
};

// Create Pesonal_Blog
router.post("/personalBlog", authenticateToken, createPersonalBlog);

// Get all Personal Blogs
router.get("/personalBlogs", getAllPersonalBlog);

// Get perticular personal Blogs info
router.get("/personalBlog/:id", getPersonalBlog);

// Update personal Blogs
router.put("/updateBlog/:id", authenticateToken, updatePersonalBlog);

// Delete personal Blod
router.delete("/delete/:id", authenticateToken, deletePersonalBlog);

module.exports = router;
