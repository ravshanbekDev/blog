const fs = require("fs");
const path = require("path");
const Blog = require("../models/userModel");

const blogDataPath = path.join(__dirname, "./db/blogs.json");

exports.getAllBlogs = (req, res) => {
  const blogs = getBlogsFromJson();
  res.json(blogs);
};

exports.getBlogById = (req, res) => {
  const blogs = getBlogsFromJson();
  const blog = blogs.find((blog) => blog.id === req.params.id);
  if (blog) {
    blog.views++;
    saveBlogsToJson(blogs);
    res.json(blog);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
};

exports.createBlog = (req, res) => {
  const { title, description, image } = req.body;
  const newBlog = new Blog(title, description, image);
  const blogs = getBlogsFromJson();
  blogs.push(newBlog);
  saveBlogsToJson(blogs);
  res.json(newBlog);
};

exports.updateBlog = (req, res) => {
  const { title, description, image } = req.body;
  const blogs = getBlogsFromJson();
  const blogIndex = blogs.findIndex((blog) => blog.id === req.params.id);
  if (blogIndex !== -1) {
    blogs[blogIndex] = { ...blogs[blogIndex], title, description, image };
    saveBlogsToJson(blogs);
    res.json(blogs[blogIndex]);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
};

exports.deleteBlog = (req, res) => {
  const blogs = getBlogsFromJson();
  const blogIndex = blogs.findIndex((blog) => blog.id === req.params.id);
  if (blogIndex !== -1) {
    const deletedBlog = blogs.splice(blogIndex, 1)[0];
    saveBlogsToJson(blogs);
    res.json(deletedBlog);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
};

exports.likeBlog = (req, res) => {
  const blogs = getBlogsFromJson();
  const blogIndex = blogs.findIndex((blog) => blog.id === req.params.id);
  if (blogIndex !== -1) {
    blogs[blogIndex].likes++;
    saveBlogsToJson(blogs);
    res.json({ message: "Blog liked" });
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
};


exports.addComment = (req, res) => {
  const { blogId, comment } = req.body;
  const blogs = getBlogsFromJson();
  const blog = blogs.find((blog) => blog.id === blogId);
  if (blog) {
    blog.comments.push(comment);
    saveBlogsToJson(blogs);
    res.json(blog.comments);
    // Emit an event to notify other clients about the new comment
    io.emit('newComment', { blogId, comment });
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
};

exports.getComments = (req, res) => {
  const { blogId } = req.params;
  const blogs = getBlogsFromJson();
  const blog = blogs.find((blog) => blog.id === blogId);
  if (blog) {
    res.json(blog.comments);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
};

function getBlogsFromJson() {
  if (!fs.existsSync(blogDataPath)) {
    fs.writeFileSync(blogDataPath, "[]");
  }
  const blogData = fs.readFileSync(blogDataPath);
  return JSON.parse(blogData);
}

function saveBlogsToJson(blogs) {
  fs.writeFileSync(blogDataPath, JSON.stringify(blogs, null, 2));
}
