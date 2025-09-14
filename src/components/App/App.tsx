import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import PostForm from '../CreatePostForm/CreatePostForm'

import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService.ts";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Post } from "../../types/post.ts";
import EditPostForm from "../EditPostForm/EditPostForm.tsx";

export default function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<null | Post>(null);
  const [debouncedQuery] = useDebounce(query, 500)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['posts', debouncedQuery, page],
    queryFn: () => fetchPosts(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const changeQuery = (query: string) => {
    setQuery(query);
    setPage(1);
  }
  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={changeQuery} />
        {isSuccess && data.total_pages > 1 &&
          (<Pagination currentPage={page} onPageChange={setPage} totalPages={data.total_pages} />)}
        <button className={css.button} onClick={openModal}>Create post</button>
      </header>
        {isFetching && <div>...loading</div>}
      {isModalOpen && <Modal onClose={closeModal}><PostForm onClose={closeModal}/></Modal>}
      {/* {selectedPost && <Modal onClose={closeModal}><EditPostForm initialData={selectedPost}/></Modal>} */}
      {isSuccess && data.posts.length > 1 && <PostList posts={data.posts} />}
    </div>
  );
}
