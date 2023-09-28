class MessageDTO {
  constructor(message) {
    this._id = message._id;
    this.chatId = message.chatId;
    this.senderId = message.senderId;
    this.text = message.text;
    this.createdAt = message.createdAt;
  }
}

export default MessageDTO;
