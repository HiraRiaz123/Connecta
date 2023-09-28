class PostDTO {
  constructor(post) {
    this._id = post._id;
    this.user = post.user;
    this.description = post.description;
    this.file = post.filePath;
  }
}

export default PostDTO;
