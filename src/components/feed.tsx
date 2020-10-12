import { Card, Image } from "antd";
import Meta from "antd/lib/card/Meta";
import React from "react";
import { Post } from "../models";

interface FeedProps {
  posts: Array<Post>;
}

export function Feed(props: FeedProps) {
  return (
    <div className="feed">
      {props.posts.map((it, index) => (
        <Card className="card" key={index}>
          <Image className="image" src={it.images[0].full_src} alt="image" />
          <Meta
            style={{ marginTop: "16px" }}
            title={it.text !== undefined ? it.text : ""}
          />
        </Card>
      ))}
    </div>
  );
}
