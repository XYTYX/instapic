import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal } from "antd";
import Form, { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Store } from "antd/lib/form/interface";
import Upload, { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useState } from "react";
import { Api } from "../api";
import { SortBy } from "../App";

interface NewPostProps {
  api: Api;
  visible: boolean;
  hideModal(): void;
  getPosts(sortBy: SortBy, offset: number | null, limit: number | null): void;
}

export function NewPostModal(props: NewPostProps) {
  const [fileList, setFileList] = useState<Array<UploadFile>>([]);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = useForm();

  function onSubmit() {
    form.validateFields().then(async (values: Store) => {
      const fileContainer: UploadChangeParam = values.file;
      const text: string = values.text;
      setConfirmLoading(true);
      try {
        await props.api.newPost(
          fileContainer.file.originFileObj!!,
          text ? text : ""
        );
      } catch (e) {}
      setConfirmLoading(false);
      props.hideModal();
      try {
        await props.getPosts(SortBy.MOST_RECENT, 0, 10);
      } catch (e) {}
    });
  }

  function onChange(info: UploadChangeParam) {
    let newFileList: Array<UploadFile> = [];
    switch (info.file.status) {
      case "uploading":
        newFileList = [info.file];
        break;
      case "done":
        newFileList = [info.file];
        break;
      default:
        newFileList = [];
    }
    setFileList(newFileList);
  }

  function dummyRequest({ onSuccess }: any) {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  }

  function validateFiletype(file: UploadFile) {
    const acceptedFileTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/gif",
    ];

    if (!acceptedFileTypes.includes(file.type)) {
      message.error(`${file.name} is not in a file format that we support`);
      return false;
    } else {
      return true;
    }
  }

  return (
    <Modal
      title="New Post"
      visible={props.visible}
      onCancel={props.hideModal}
      okText="Submit"
      okButtonProps={{ disabled: fileList.length === 0 }}
      onOk={onSubmit}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} name="validate_other">
        <FormItem
          name="file"
          label="Image"
          extra="Please upload a .png, .jpg, .jpeg, or .gif image"
        >
          <Upload
            customRequest={dummyRequest}
            onChange={onChange}
            fileList={fileList}
            name="logo"
            listType="picture"
            beforeUpload={validateFiletype}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </FormItem>
        <FormItem name="text" label="Subtitle">
          <Input required />
        </FormItem>
      </Form>
    </Modal>
  );
}
