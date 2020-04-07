/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import { Upload, Icon, message as Msg } from 'antd';

import config from './config';

import './index.less';

function isMap(data) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

const TYPE_TEXT_MAP = {
  'image': '图片',
  'video': '视频',
};

const DEFAULT_UPLOAD_PROPS = {
  btn: {
      title: '点击上传'
  },
  style: {
      width: '100%',
  },
  limit: {
      accept: 'image/*', //'png,jpeg',
  //size: 10000 // 10 000 kb = 10M
  },
  action: '',
  data: {
  },

  showUploadList: false,
};

class MediaUpload extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          imageURL: props.value || props.defaultValue
      };

      this.initData(props.value);
  }

  getData() {
      return this.state;
  }

  initData(data) {
      if (isMap(data)) {
          this.state.imageURL = data.imageURL;
          this.state.imagePath = data.imagePath;

      } else {
          this.state.imageURL = data || this.props.defaultValue;
      }
  }

  setData(data) {
      this.state.imageURL = data.imageURL;
      this.state.imagePath = data.imagePath;
      this.setState(this.state);
  }

  getFileFormat(file) {
      let fileType;
      if (typeof file === 'object') {
          fileType = file.type;
      } else if (typeof file === 'string') {
          const matchResult = /\.([a-zA-Z0-9]{2,})$/g.exec(file);
          if (matchResult && matchResult.length >= 2) {
              fileType = matchResult[1];
          }
      }

      const formatMap = {

          jpeg: 'image',
          jpg: 'image',
          png: 'image',
          bmp: 'image',
          gif: 'image',


          mp3: 'audio',
          m4a: 'audio',
          mp4: 'video',
      }

      return formatMap[fileType] || fileType;


  }

  getFileSuffix(file) {
      let fileType;
      if (typeof file === 'object') {
          file = file.name;
      }
      if (typeof file === 'string') {
          const matchResult = /\.([a-zA-Z0-9]{2,})$/g.exec(file);
          if (matchResult && matchResult.length >= 2) {
              fileType = matchResult[1];
          }
      }


      return fileType && fileType.toLowerCase();


  }



  checkFileType(fileTypesAllowed, file) {

      const fileType = file.type;
      const fileName = file.name; // 避免windows对csv判断为xls，增加file.name的判断

      let isFormatRight = false;

      fileTypesAllowed.forEach((fileTypeAllowed) => {
          if (fileType.match(/image\/\*/) || fileType.match(fileTypeAllowed) || this.getFileSuffix(fileName).match(fileTypeAllowed)) {
              isFormatRight = true;
          }
      });


      return isFormatRight;


  }

  checkFilesize(maxFilesize, filesize) {
      return filesize / 1024.0 < maxFilesize;
  }

  validateFile(file) {
      let errMsg;
      errMsg = file.error && file.error.message;

      const {limit} = this.props;
      const limitProps = {
          ...DEFAULT_UPLOAD_PROPS.limit, ...limit
      };

      const fileTypesAllowed = (limitProps.accept || '').split(',');

      if (!this.checkFileType(fileTypesAllowed, file)) {
          errMsg = `格式错误, 格式须是${limitProps.accept}`;
      } else if (limitProps.size && !this.checkFilesize(limitProps.size, file.size)) {
          errMsg = `大小不能超过${limitProps.size}K`;
      }

      return errMsg;


  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
          this.state.imageURL = nextProps.value;
      }
  }

  beforeUpload(file) {

      const errMsg = this.validateFile(file);
      if (errMsg) {
          Msg.error(errMsg);
          return false;
      }
  }

  handleUpload(fileInfo) {

      let {urlKey, pathKey} = this.props;

      urlKey = urlKey || 'url';
      pathKey = pathKey || 'ext_info';

      const file = fileInfo.file;
      if (file.status === 'uploading') {
          return;
      }

      if (file.response && file.response.errno * 1 === 0) {

          const errMsg = this.validateFile(file);
          if (errMsg) {
              Msg.error(errMsg);
              return;
          }

          const imageInfo = (file.response && file.response.data) || {};
          const imageURL = imageInfo[urlKey];
          const fileFormat = this.getFileFormat(file);
          const fileType = this.getFileSuffix(file);

          const FORMAT_EVT_MAP = {
            img: 'onload',
            video: 'oncanplay'
          };

          const FORMAT_WIDTH_MAP = {
            img: 'width',
            video: 'videoWidth'
          };

          const FORMAT_HEIGHT_MAP = {
            img: 'height',
            video: 'videoHeight'
          };

          const isImageFormat = fileFormat.match('image');
          const isVideoFormat = fileFormat.match('video');
          
          if (isImageFormat || isVideoFormat) {
              const tag = this.getElementTag(imageURL);

              const imageDom = document.createElement(tag);
              
              imageDom[FORMAT_EVT_MAP[tag]] = () => {
                  const {limit} = this.props;
                  const limitProps = {
                      ...DEFAULT_UPLOAD_PROPS.limit, ...limit
                  };

                  const { ratio, delta: limitDelta = 1, width: limitWidth, height: limitHeight } = limitProps;
                  const mediaWidth = imageDom[FORMAT_WIDTH_MAP[tag]];
                  const mediaHeight = imageDom[FORMAT_HEIGHT_MAP[tag]];
                
                  let dimensionErr = [];
                  if (ratio && limitWidth && limitHeight) {

                    const computedMediaWidth = limitWidth * 1.0 / limitHeight * mediaHeight;
                    const delta = Math.abs(computedMediaWidth - mediaWidth)
                    if (delta > limitDelta) {
                      dimensionErr.push('宽高比例错误');
                    }

                    if (ratio === 'gte' && mediaWidth < limitWidth) {
                      dimensionErr.push('图片尺寸必须大于等于规定尺寸');
                    } else if (ratio ==='lte' && mediaWidth > limitWidth) {
                      dimensionErr.push('图片尺寸必须小于等于规定尺寸');
                    }

                  } else if (limitWidth || limitHeight) {

                      if (limitWidth) {
                          const widthErr = limitWidth !== mediaWidth ? `宽度${mediaWidth}错误，应为${limitWidth},` : '';
                          if (widthErr) {
                            dimensionErr.push(widthErr);
                          }
                      }
                      if (limitHeight) {
                          const extraInfo = fileType === 'mp4' && mediaHeight === 0 ? '，请确认视频编解码是否为H.264 AAC': '';
                          const heightErr = limitHeight !== mediaHeight ? `高度${mediaHeight}错误，应为${limitHeight}${extraInfo}` : '';
                          if (heightErr) {
                            dimensionErr.push(heightErr);
                          }
                      }
                  }

                  if (dimensionErr.length > 0) {
                      Msg.error(dimensionErr.join(','));
                      return;
                  }

                  this.state = {
                      imageURL,
                      imagePath: imageInfo[pathKey]
                  };
                  this.setState(this.state, () => {
                      this.props.onChange && this.props.onChange(this.state.imageURL); // {download_url:}
                  });


              };

              imageDom.src = imageURL;

          } else {
              // 非图片资源直接更新数据,不需要做宽、高验证
              this.state = {
                  imageURL,
                  imagePath: imageInfo[pathKey]
              };
              this.setState(this.state, () => {
                  this.props.onChange && this.props.onChange(this.state.imageURL); // {download_url:}
              });

          }



      } else {
          file.response && Msg.error(file.response && file.response.errmsg);
      }


  }

  getLimitInfo() {
      let limitInfo = [];
      const {limit} = this.props;
      const limitProps = {
          ...DEFAULT_UPLOAD_PROPS.limit, ...limit
      };


      if (limitProps.accept !== 'image/*') {
          const imageFormatStr = '格式';
          limitInfo.push(imageFormatStr + ":" + limitProps.accept);
      }

      // 非图片不需要做这些验证，非图片资源不需要传入这些参数
      let widthHeightInfo = '';
      if (limitProps.width && limitProps.height) {
          const imageCanvasSize = "尺寸";
          widthHeightInfo = `${imageCanvasSize}:${limitProps.width}x${limitProps.height}`
      } else if (limitProps.width) {
          const imageWidth = '宽度';
          widthHeightInfo = `${imageWidth}:${limitProps.width}`;
      } else if (limitProps.height) {
          const imageHeight = '高度';
          widthHeightInfo = `${imageHeight}:${limitProps.height}`;
      }

      const { ratio } = limitProps;

      const ratioMap = {
        gte: '最小',
        lte: '最大',
        true: ''
      }

      if (ratio) {
        widthHeightInfo = `${ratioMap[ratio]}${widthHeightInfo}`;
      }
      limitInfo.push(widthHeightInfo);

      if (ratio) {
        limitInfo.push(`支持等比例`);
      }

      if (limitProps.size) {
          const imageSize = '大小限制';
          limitInfo.push(`${imageSize}:${limitProps.size}K`);
      }


      return limitInfo.join('，');
  }

  getTip() {
      let {tip} = this.props;
      if (!tip)
          tip = '';
      else if (Array.isArray(tip)) {
          tip = (
              <p style={{
                  display: 'inline-block'
              }}>
                  {
              tip.map(tipItem => {
                  return <a style={{
                          marginRight: 10
                      }} target="_blank" href={tipItem.url}>{tipItem.title}</a>;
              })
              }
              </p>
          );
      }
      return tip;
  }

  getElementTag(mediaURL) {
      // 如果没有传accept，默认是图片
      let fileFormat = this.getFileFormat(mediaURL);
      const {limit} = this.props;
      const limitProps = {
          ...DEFAULT_UPLOAD_PROPS.limit, ...limit
      };
      if (limitProps.accept.match(/image\/\*/)) {
          fileFormat = 'image';
      } else if (limitProps.accept.match(/video\/\*/)) {
        fileFormat = 'video';
      }


      const elementMap = {
          'image': 'img',
          'audio': 'audio',
          'video': 'video'
      }

      const element = elementMap[fileFormat];
      return element;
  }

  renderMedia(mediaURL) {

      const element = this.getElementTag(mediaURL); 

      let mediaComp;
      if (element && mediaURL) {

          let childComp, compProps = {};
          if (['audio', 'video'].indexOf(element) !== -1) {
              childComp = [<p>{"浏览器不支持播放该格式"}</p>, <p>{mediaURL}</p>];
              compProps = { controls: 'controls' };
          }
          mediaComp = React.createElement(element, {
              src: mediaURL,
              style: {
                  width: '100%',
                  height: '100%'
              },
              ...compProps,
          }, childComp)
      } else {
          mediaComp = mediaURL || this.state.imagePath;
      }

      return mediaComp;



  }

  render() {
    const {props} = this;

    const {style} = props;

    let canvasStyle = {
        ...DEFAULT_UPLOAD_PROPS.style, ...style
    };

    const imageComp = this.renderMedia(this.state.imageURL);

    if (typeof imageComp === 'Object') {
      canvasStyle = {
          ...canvasStyle,
          border: "2px solid #efefef",
          backgroundColor: '#fff'
      }
    } else {
      canvasStyle = {
          wordBreak: 'break-all'
      }

    }

    const uploadProps = {
      ...DEFAULT_UPLOAD_PROPS,
      ...config,
    };

    let uploadData = {};

    uploadData = {
      ...uploadData, ...props.data
    };

    const { imageURL } = this.state;

    const { type } = this.props; // type的判断也可以根据accept的传入判断

    const fileText = TYPE_TEXT_MAP[type] ? TYPE_TEXT_MAP[type] : '图片/视频'; 

    const mediaClassNames = classnames('media', imageURL ? '' : 'min-height');
    const uploadComp = props.disabled ? imageComp : (
      <Upload 
        { ...uploadProps }  
        { ...props } 
        data={ uploadData }  
        onChange={(fileInfo) => this.handleUpload(fileInfo)}  beforeUpload={(file) => this.beforeUpload(file)} 
      >
        <div className={mediaClassNames}>
         {imageURL ?
            imageComp :
            <div className="media-upload-icon-wrap">
              <Icon className="media-upload-icon" type="plus" />
              <div className="media-upload-tip">{`点击上传${fileText}`}</div>
            </div>
          }
        </div>
      </Upload>
    );


    const limitInfo = props.disabled ? null : <div><span style={{
      marginLeft: 8
    }}>{this.getLimitInfo()}</span>{this.getTip()}</div>;

    const wrapperClassNames = classnames('media-wrapper', imageURL ? '' : 'min-height');

    return (
      <div className="media-wrapper-container">
          <div className={wrapperClassNames}>{uploadComp}</div> <span className="media-limit-info">{limitInfo}</span>
      </div>
    );
  }
}

/*
 * limit : {
 *      accept: jpg,png
 *      width:100,
 *      height: 333, //单位px
 *      size: 333 // 单位kb
 * }
 *
 * style: {
 *  width: 显示的宽度
 *  height: 显示的高度
 * }
 */
MediaUpload.Props = {
  limit: PropTypes.object,
  style: PropTypes.object
};


export default MediaUpload;
