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
  created_on: string;
}

export interface Image {
  full_src: string;
}
