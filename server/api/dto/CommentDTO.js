class CommentDTO {
  constructor(comment) {
    this._id = comment._id;
    this.userName = `${comment.user?.firstName} ${comment.user?.lastName}`;
    this.content = comment.content;
    this.description = comment.post?.description;
    this.createdAt = comment.createdAt;
  }
}

export default CommentDTO;
