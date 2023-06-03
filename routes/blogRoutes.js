const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authMiddleware = require("../utils/authMiddleware");

router.get("/", blogController.getAllBlogs, (req, res) => {
  const blogs = req.blogs;
  res.render("blogs", { blogs });
});

router.get("/:id", blogController.getBlogById, (req, res) => {
  const blog = req.blog;
  res.render("blogDetails", { blog });
});

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", authMiddleware.authenticate, blogController.createBlog);
router.put("/:id", authMiddleware.authenticate, blogController.updateBlog);
router.delete("/:id", authMiddleware.authenticate, blogController.deleteBlog);
router.post("/:id/like", authMiddleware.authenticate, blogController.likeBlog);
router.post("/:blogId/comments", blogController.addComment);
router.get("/:blogId/comments", blogController.getComments);


module.exports = router;
