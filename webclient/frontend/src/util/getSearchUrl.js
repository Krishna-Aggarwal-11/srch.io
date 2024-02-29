export const getSearchUrl = (query, search_uuid) => {
    const prefix = process.env.NODE_ENV === "production" ? "/search.html" : "/search";
    return `${prefix}?q=${encodeURIComponent(query)}&rid=${search_uuid}`;
  };
  
