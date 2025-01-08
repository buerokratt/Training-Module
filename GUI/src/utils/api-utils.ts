export const flattenPaginatedData = <T>(data: { pages: { response: T[] }[] } | undefined): T[] => {
  return data?.pages?.flatMap((page) => page.response) ?? [];
};
