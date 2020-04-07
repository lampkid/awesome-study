import React from "react";
import { Message as Msg, Upload, Icon, Modal } from "antd";

import "./index.less";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/*
 * allowPreview: true
 * maxFileCount: image count allowed
 * action: api
 */

export default class MediaList extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    prevFileList: [],
    fileList: (this.props.value || []).map((url, index) => ({
      url,
      uid: `rc-upload--${index}`
    }))
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  static getDerivedStateFromProps(props, state) {
    if (state.innerTriggerState) {
      return null;
    }
    const { value: fileList = [] } = props;
    if (JSON.stringify(fileList) !== JSON.stringify(state.prevFileList)) {
      return {
        fileList: (fileList || []).map((url, index) => ({
          url,
          uid: `rc-upload--${index}`,
          status: "done"
        })),
        prevFileList: fileList || []
      };
    }
    return null;
  }

  handleChange = ({ file, fileList }) => {
    console.log("change...");
    const { fileList: oldFileList } = this.state;
    if (!this.oldFileList) {
      this.oldFileList = oldFileList;
    }
    const {
      status,
      response: { errorCode, errno = errorCode, msg, errmsg = msg } = {}
    } = file;

    if (status === "done" && errno * 1 !== 0) {
      Msg.error(errmsg);
      this.setState({ fileList: this.oldFileList, innerTriggerState: true });
      return;
    }
    const { urlKey = "url" } = this.props;
    this.setState(
      {
        fileList: [...fileList],
        innerTriggerState: true
      },
      () => {
        const { onChange } = this.props;
        if (fileList.every(file => file.status === "done")) {
          this.oldFileList = null;
          const newFileList = (fileList || []).map(file => {
            const {
              url,
              response: { data: { [urlKey]: resURL } = {} } = {}
            } = file;
            return url || resURL;
          });
          onChange && onChange(newFileList);
        }
      }
    );
  };

  render() {
    const { fileList = [], previewVisible, previewImage } = this.state;
    const {
      action,
      listType = "picture-card",
      allowPreview,
      allowRemove,
      disabled,
      maxFileCount,
      headers
    } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div className="x-image-upload-list clearfix">
        <Upload
          action={action}
          headers={headers}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={{
            showPreviewIcon: allowPreview,
            showRemoveIcon: !disabled && allowRemove
          }}
        >
          {disabled || (maxFileCount && fileList.length >= maxFileCount)
            ? null
            : uploadButton}
        </Upload>
        <div className="file-count">
          {maxFileCount
            ? `已经上传${fileList.length}张，还能上传${maxFileCount -
                fileList.length}张`
            : ""}
        </div>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
