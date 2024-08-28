import { BaseFilter } from "./sorting-base-filter";

enum SortDirections {
  ASC = "ASC",
  DESC = "DESC",
}

export type PaginationType = {
  pageNumber: number;
  pageSize: number;
  skip: number;
  sortBy: string;
  sortDirection: keyof typeof SortDirections;
  sort?: string[];
};

export const getQueryPagination = <T extends BaseFilter>(
  inputData: T,
): PaginationType => {
  const sortDirection =
    inputData?.sortDirection === SortDirections.ASC ? "ASC" : "DESC";
  const sortBy = inputData?.sortBy || "created_at";

  const parsedPageNumber = parseInt(inputData.pageNumber, 10);
  const pageNumber = !isNaN(parsedPageNumber)
    ? Math.min(parsedPageNumber, 50)
    : 1;

  const parsedPageSize = parseInt(inputData.pageSize, 10);
  const pageSize = !isNaN(parsedPageSize) ? Math.min(parsedPageSize, 50) : 10;

  const skip = (pageNumber - 1) * pageSize;

  return {
    pageNumber,
    pageSize,
    skip,
    sortBy,
    sortDirection,
  };
};
