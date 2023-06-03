const { v4: uuid4 } = require("uuid");

class Blog {
  constructor(title, description, image) {
    this.id = uuid4();
    this.title = title;
    this.description = description;
    this.image = image;
    this.likes = 0;
    this.views = 0;
  }
}

module.exports = Blog;
