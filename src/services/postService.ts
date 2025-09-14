import axios from "axios";
import { Post } from "../types/post.ts";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

const PER_PAGE = 5;

interface fetchPostsResponse {
    posts: Post[];
    page: number;
    total_pages: number;
}

export const fetchPosts = async (searchText: string, page: number): Promise<fetchPostsResponse> => {
    const { data } = await axios.get<Post[]>('/posts', {
        params: {
            ...(searchText !== '' ? {q: searchText} : {}),
            _page: page,
            _limit: PER_PAGE,
        }
    });
    return {
        posts: data,
        page,
        total_pages: Math.ceil(100 / PER_PAGE),
    };
};

interface PostFormData {
  title: string;
  body: string;
}

export const createPost = async (newPost: PostFormData): Promise<Post> => {
    const { data } = await axios.post<Post>('/posts', newPost);
    return data;
};

interface EditPostData {
    id: number;
    title: string;
    body: string;
}

export const editPost = async (newDataPost: EditPostData): Promise<Post> => {
    const { id, ...rest } = newDataPost;
    const { data } = await axios.patch<Post>(`/posts/${id}`, rest);
    return data;
};


export const deletePost = async (postId: number): Promise<number> => {
    await axios.delete(`/posts/${postId}`);
    return postId;
};
