import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import React, { useState, useEffect } from "react";
import { Api } from "../api";
import { SortBy } from "../App";
import { Post } from "../models";
import { MenuInfo } from "rc-menu/lib/interface";
import { Feed } from "./feed";
import { ExploreByUsers } from ".";

interface ExploreProps {
  api: Api;
  posts: Array<Post>;
  getPosts(sortBy: SortBy): void;
}

export function Explore(props: ExploreProps) {
  const [sortMethod, setSortMethod] = useState<SortBy>(SortBy.MOST_RECENT);

  useEffect(() => {
    props.getPosts(sortMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMethod]);

  function renderPosts(posts: Array<Post> | null): React.ReactNode {
    if (posts === null || posts.length === 0) {
      return;
    }

    function onSortMethodClick({ key }: MenuInfo) {
      if (key === SortBy.MOST_RECENT) {
        setSortMethod(SortBy.MOST_RECENT);
      } else {
        setSortMethod(SortBy.BY_USERS);
      }
    }

    const dropdownMenu = (
      <Menu onClick={onSortMethodClick}>
        <Menu.Item key={SortBy.MOST_RECENT}>Most Recent</Menu.Item>
        <Menu.Item key={SortBy.BY_USERS}>By User</Menu.Item>
      </Menu>
    );

    return (
      <>
        <Dropdown overlay={dropdownMenu} trigger={["click"]}>
          <Button type="text">
            Sort By <DownOutlined />
          </Button>
        </Dropdown>
        {sortMethod === SortBy.MOST_RECENT ? (
          <Feed posts={posts} />
        ) : (
          <ExploreByUsers api={props.api} posts={posts} />
        )}
      </>
    );
  }

  return (
    <div className="spaced">
      <h2 style={{ marginBottom: 0 }}>Explore</h2>
      {renderPosts(props.posts)}
    </div>
  );
}
