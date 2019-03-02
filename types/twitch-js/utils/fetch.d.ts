
export interface FetchOptions {
  method?: "get"|"post";
  headers?: {[key: string]: string};
  search?: {[key: string]: string};
  body?: {};
}
