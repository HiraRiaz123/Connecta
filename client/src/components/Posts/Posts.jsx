import React, { useEffect } from 'react'
import './Posts.css'
import Post from '../Post/Post'
import { useDispatch, useSelector } from "react-redux"
import { getTimeLinePosts } from '../../actions/PostAction'
const Posts = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const { posts, loading } = useSelector((state) => state.postReducer);
  useEffect(() => {
    dispatch(getTimeLinePosts(user._id));
  }, []);
  if (!posts) return 'No Posts';
  return (
    <div className="Posts">
      {loading
        ? "Fetching posts...."
        : posts.map((post, id) => {
          return <Post data={post} key={id} />;
        })}
    </div>
  )
}

export default Posts