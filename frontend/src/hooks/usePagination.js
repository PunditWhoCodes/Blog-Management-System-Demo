import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setPage(prevPage => Math.max(1, prevPage - 1));
  };

  const goToPage = (pageNumber) => {
    setPage(Math.max(1, pageNumber));
  };

  const reset = () => {
    setPage(initialPage);
  };

  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); 
  };

  return {
    page,
    limit,
    setPage: goToPage,
    nextPage,
    prevPage,
    reset,
    changeLimit
  };
};
