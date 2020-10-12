import { Card, Image } from "antd";
import Meta from "antd/lib/card/Meta";
import React from "react";
import { Post } from "../models";
import { v4 as uuidv4 } from "uuid";

interface FeedProps {
  posts: Array<Post>;
}

// Displays posts in a vertical fashion
export function Feed(props: FeedProps) {
  return (
    <div className="feed">
      {props.posts.map((it) => (
        <Card className="card" key={uuidv4()}>
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
