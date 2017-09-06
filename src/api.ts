/**
 * Conduit API
 *
 * OpenAPI spec version: 1.0.0
 *
 */

window['defaultBasePath'] = 'https://conduit.productionready.io/api';

import { getToken, setToken, toQueryString, serializeObject, get, post, del, put } from './fetch';
export { getToken, setToken, toQueryString, serializeObject }

export interface ITags {
  tags: Array<string>;
}

export interface IFeed {
  articles: Array<IArticle>;
  articlesCount: number;
}

export interface IAuthor {
  username: string;
  bio: string;
  image: string;
  following: true;
}

export interface IUser {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
}
export interface ISession {
  user: IUser
}

export interface IArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: IAuthor;
  tagList: Array<string>;
}

export interface IArticlesRequest {
  tag?: string;
  author?: string;
  favorited?: string;
  limit: number;
  offset: number;
}

export interface INewArticle {
  title: string,
  description: string,
  body: string,
  tagList: Array<string>;

}

export interface IArticlesResponse {
  article: IArticle
}

export const tags = {
  all: () => get<ITags>('/tags')
}

export const auth = {
  current: () => getToken()
    ? get<ISession>('/user')
    : null,
  signIn: (user: { email: string, password: string }) =>
    post<ISession>('/users/login', { user }),
  register: (user: { username: string, email: string, password: string }) =>
    post<ISession>('/users', { user }),
  save: user =>
    put('/user', { user })
}

export const articles = {
  search: (request: IArticlesRequest) =>
    get<IFeed>(`/articles?${toQueryString(request)}`),
  feed: (request: {limit: number, offset: number}) =>
    get<IFeed>(`/articles/feed?${toQueryString(request)}`),
  get: (slug: string) =>
    get<IArticlesResponse>(`/articles/${slug}`),
  favorite: slug =>
    post(`/articles/${slug}/favorite`),
  unfavorite: (slug: string) =>
    del(`/articles/${slug}/favorite`),
  update: (article: IArticle) =>
    put(`/articles/${article.slug}`, { article }),
  create: (article: INewArticle) =>
    post<IArticlesResponse>('/articles', { article })
}


export const comments = {
  create: (slug, comment) =>
    post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    get(`/articles/${slug}/comments`)
};

export const profile = {
  follow: username =>
    post(`/profiles/${username}/follow`),
  get: username =>
    get(`/profiles/${username}`),
  unfollow: username =>
    del(`/profiles/${username}/follow`)
};
