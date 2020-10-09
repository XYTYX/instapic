export interface User {
  email: string;
  username: string;
  public_id: string;
}

export interface AuthToken {
  authorization: string;
}

export interface Post {
  id: string;
  text: string | undefined;
  images: Array<Image>;
  created_on: string;
  user_public_id: string;
}

export interface Image {
  full_src: string;
}
