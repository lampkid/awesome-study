#!/bin/bash

pid=$$

set -x

RELEASE_COPY="./*"
RELEASE_DIR="output"
TMP_DIR="/tmp/output.${pid}"
WORKER_DIR=$(cd $(dirname $0) && pwd -P)

cd $WORKER_DIR

mkdir -p $TMP_DIR

if ! [ -x "$(command -v yarn)" ]; then
    echo 'Error: yarn is not installed. install yarn...' >&2
    npm install -g yarn
fi

yarn
ret=$?
if [ $ret -ne 0 ];then
    echo "===== $npm install failure ====="
    exit $ret
else
    echo -n "===== $npm install successfully! ====="
fi

rm -rf $RELEASE_DIR

# 处理mac和linux软连接拷贝的区别, 防止node_modules/.bin/pm2软连接变成了实际文件
sys=`uname -s`
if [ $sys == "Darwin" ];then
  cp -R $RELEASE_COPY $TMP_DIR
elif [ $sys == "Linux" ];then
  cp -rfd $RELEASE_COPY $TMP_DIR
else
  cp -rfd $RELEASE_COPY $TMP_DIR
fi


mkdir $RELEASE_DIR

mv $TMP_DIR/* $RELEASE_DIR

# 编译成功
echo -e "build done"
exit 0
