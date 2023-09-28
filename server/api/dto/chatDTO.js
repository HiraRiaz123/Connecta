class ChatDTO {
  constructor(chat) {
    this._id = chat._id;
    this.members = chat.members;
  }
}

export default ChatDTO;
