import { ExpandAltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { Feed } from ".";
import { Post } from "../models";

interface SingleUserFeed {
  username: string;
  posts: Array<Post>;
}

// This component displays a single user's posts in a modal sorted by recency
export function SingleUserFeed(props: SingleUserFeed) {
  const [showModal, setShowModal] = useState<boolean>(false);

  function _showModal() {
    setShowModal(true);
  }

  function hideModal() {
    setShowModal(false);
  }

  function okButton() {
    return (
      <Button type="primary" onClick={hideModal}>
        Close
      </Button>
    );
  }

  return (
    <>
      <Button style={{ marginTop: "10px" }} type="link" onClick={_showModal}>
        {props.username}
        <ExpandAltOutlined />
      </Button>
      <Modal
        footer={okButton()}
        visible={showModal}
        onOk={hideModal}
        onCancel={hideModal}
      >
        {props.posts.length !== 0 ? (
          <Feed posts={props.posts} />
        ) : (
          <div>This user hasn't uploaded any photos yet!</div>
        )}
      </Modal>
    </>
  );
}
