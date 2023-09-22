import * as PostsApi from "../api/PostsRequest";

export const getTimeLinePosts = (id) => async (dispatch) => {
  dispatch({ type: "RETREIVING_START" });
  try {
    const { data } = await PostsApi.getTimeLinePosts(id);
    dispatch({ type: "RETREIVING_SUCCESS", data: data });
    // console.log(data);
  } catch (error) {
    console.log(error);
    dispatch({ type: "RETREIVING_FAIL" });
  }
};
