export interface User {
  email: string;
  username: string;
}

export interface AuthToken {
  authorization: string;
}

export interface Post {
  id: string;
  text: string;
  images: Array<Image>;
}

export interface Image {
  path: string;
}
