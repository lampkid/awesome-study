import MediaUpload from './MediaUpload';

import { set } from './config';

const Media = MediaUpload;
MediaUpload.set = set;

export default Media;
