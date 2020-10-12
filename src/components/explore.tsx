import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Pagination } from "antd";
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
  getPosts(sortBy: SortBy, offset: number | null, limit: number | null): void;
}

export function Explore(props: ExploreProps) {
  const [sortMethod, setSortMethod] = useState<SortBy>(SortBy.MOST_RECENT);
  const [offset, setOffset] = useState<number | undefined>(0);
  const [limit, setLimit] = useState<number | undefined>(3);

  useEffect(() => {
    props.getPosts(sortMethod, null, null);
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

    function onNextPage(pageNumber: number, pageSize: number | undefined) {
      const actualPageSize = pageSize ? pageSize : 3;
      setOffset((pageNumber - 1) * actualPageSize);
      setLimit(actualPageSize);
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
          <>
            <Feed posts={posts.slice(offset, offset!! + limit!!)} />
            <Pagination
              style={{ marginTop: "12px", marginBottom: "12px" }}
              onChange={onNextPage}
              defaultCurrent={1}
              total={posts.length}
              pageSize={limit}
            />
          </>
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
