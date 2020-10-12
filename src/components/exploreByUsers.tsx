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

  const posts = props.posts.sort(sort);

  function sort(first: Post, second: Post) {
    var t1 = first.created_on.split(/[- :]/).map((it) => {
      return Number(it);
    });
    var t2 = second.created_on.split(/[- :]/).map((it) => {
      return Number(it);
    });

    var d1 = new Date(Date.UTC(t1[0], t1[1] - 1, t1[2], t1[3], t1[4], t1[5]));
    var d2 = new Date(Date.UTC(t2[0], t2[1] - 1, t2[2], t2[3], t2[4], t2[5]));
    if (d1 < d2) {
      return 1;
    } else {
      return -1;
    }
  }

  return (
    <div className="rowFeed">
      {users.map((user, index) => {
        const usersPosts = posts.filter((post) => {
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
