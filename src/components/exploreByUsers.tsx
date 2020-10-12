import { Card, Image } from "antd";
import React, { useState, useEffect } from "react";
import { SingleUserFeed } from ".";
import { Api } from "../api";
import { Post, User } from "../models";

interface ExploreByUsersProps {
  api: Api;
  posts: Array<Post>;
}

export function ExploreByUsers(props: ExploreByUsersProps) {
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    (async () => {
      const response = await props.api.getAllUsers();
      setUsers(response);
    })();
  }, [props.api, props.posts]);

  return (
    <div className="rowFeed">
      {users.map((user, index) => {
        const usersPosts = props.posts.filter((post) => {
          return post.user_public_id === user.public_id;
        });
        const possibleThumbnail = usersPosts[0]?.images[0]?.full_src;
        return (
          <Card className="rowCard" key={index}>
            <Image
              className="image"
              src={
                possibleThumbnail
                  ? possibleThumbnail
                  : "http://i2.wp.com/juju.com.hk/wp-content/uploads/2019/11/placeholder.png"
              }
              alt="image"
            />
            <SingleUserFeed
              username={user.username}
              index={0}
              posts={usersPosts}
            />
          </Card>
        );
      })}
    </div>
  );
}
