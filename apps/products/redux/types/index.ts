
export interface LinkHeaderEntry {
  page: string;
  per_page: string;
  rel: string;
  sha: string;
  url: string;
}

export interface ResponseWithLink<T> {
  response: T;
  next?: LinkHeaderEntry;
  last?: LinkHeaderEntry;
  prev?: LinkHeaderEntry;
  first?: LinkHeaderEntry;
}
