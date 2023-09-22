import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unFollowUser } from "../../actions/UserAction";

const User = ({ person }) => {
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch()

    const [following, setFollowing] = useState(
        person.followers.includes(user._id)
    );
    const handleFollow = () => {
        following
            ? dispatch(unFollowUser(person._id, user))
            : dispatch(followUser(person._id, user));
        setFollowing((prev) => !prev);
    };
    return (
        <div className="follower">
            <div>
                <img src={person.profilePicture ? serverPublic + person.profilePicture : serverPublic + "profileImg.jpg"} alt="profile" className="followerImage" />
                <div className="name">
                    <span>{person.firstName}</span>
                    <span>@{person.email}</span>
                </div>
            </div>
            <button
                className={following ? "button fc-button UnfollowButton" : "button fc-button"} onClick={handleFollow}>
                {following ? "Unfollow" : "Follow"}
            </button>
        </div>
    );
};

export default User;