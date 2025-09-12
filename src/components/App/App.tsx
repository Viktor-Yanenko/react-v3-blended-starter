import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import PostForm from '../CreatePostForm/CreatePostForm'

import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService.ts";
import { useState } from "react";

export default function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(query, page),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        {isSuccess && data.total_pages > 1 &&
          (<Pagination currentPage={page} onPageChange={setPage} totalPages={data.total_pages} />)}
        <button className={css.button} onClick={openModal}>Create post</button>
      </header>
        {isFetching && <div>...loading</div>}
      {isModalOpen && <Modal onClose={closeModal}><PostForm onClose={closeModal}/></Modal>}
      {isSuccess && data.posts.length > 1 && <PostList posts={data.posts} />}
    </div>
  );
}
