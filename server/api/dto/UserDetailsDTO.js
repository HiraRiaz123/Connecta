class UserDetailsDTO {
  constructor(user) {
    this._id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.gender = user.gender;
    this.profilePicture = user.profilePicturePath;
    this.coverPicture = user.coverPicturePath;
    this.phoneNumber = user.phoneNumber;
    this.followers = user.followers;
    this.following = user.following;
    this.saved = user.saved;
    this.livesIn = user.livesIn;
    this.studyAt = user.studyAt;
    this.worksAt = user.worksAt;
    this.relationship = user.relationship;
    this.country = user.country;
  }
}

export default UserDetailsDTO;
