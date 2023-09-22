import React, { useEffect } from "react";
import { getTimeLinePosts } from "../../actions/PostAction";
import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import "./Posts.css";
import { useParams } from "react-router-dom";

const Posts = () => {
  const params = useParams()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);
  useEffect(() => {
    dispatch(getTimeLinePosts(user._id));
  }, []);

  if (!posts) return 'No Posts';
  if (params.id) posts = posts.filter((post) => post.userId === params.id)

  posts = posts.filter((post) => {
    return post.userId === user._id || user.following.includes(post.userId);
  });
  return (
    <div className="Posts">
      {loading
        ? "Fetching posts...."
        : posts.map((post, id) => {
          return <Post data={post} key={id} />;
        })}
    </div>
  );
};

export default Posts;