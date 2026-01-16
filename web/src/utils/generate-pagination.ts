export const generatePagination = (currentPage: number, totalPages: number) => {
  const MAX_VISIBLE_PAGES = 5;
  const pages = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    // if total page is 5 or less, show all pages
    for (let i = 0; i < totalPages; i++) {
      pages.push(i + 1);
    }
  } else {
    // always show the first page
    pages.push(1);

    // beginning:  [1], [2], [3], [4], [...], [10]
    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }

      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // end: [1], [...], [7], [8], [9], [10]
      pages.push("...");

      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // middle: [1], [...], [4], [5], [6], [...], [10]
      pages.push("...");

      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);

      pages.push("...");

      pages.push(totalPages);
    }
  }

  return pages;
};
