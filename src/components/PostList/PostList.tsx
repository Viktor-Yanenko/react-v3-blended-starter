import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post.ts";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService.ts";

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void
}

export default function PostList({ posts, onEdit }: PostListProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deletePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
      console.log('removedId', data)
    },
  })
  return (
    <ul className={css.list}>
      {posts.map(post => (
        <li className={css.listItem} key={post.id}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button className={css.edit} onClick={()=>onEdit(post)}>Edit</button>
            <button className={css.delete} onClick={()=>{mutate(post.id)}} disabled={isPending}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
