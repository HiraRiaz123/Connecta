class PostDetailsDTO {
  constructor(post) {
    this._id = post._id;
    this.description = post.description;
    this.file = post.filePath;
    this.likes = post.likes;
    this.userName = `${post.user?.firstName} ${post.user?.lastName}`;
    this.userEmail = post.user?.email;
    this.createdAt = post.createdAt;
  }
}

export default PostDetailsDTO;
