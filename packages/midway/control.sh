#!/bin/bash

source ~/.bashrc
env=$2
MODULE="midway"
APP_DIR=/data/deploy/$MODULE/$env
LOG_DIR=$APP_DIR/logs
workspace=$(cd $(dirname $0) && pwd -P)

function start() {
    [ ! -d $LOG_DIR ] && mkdir -p $LOG_DIR
    cd $APP_DIR  && npm run $env
    echo "app start"
}


function stop() {
    # npm run stop
    appname="midway-server-$env"
    pm2 stop $appname
    echo "app stop"
}


action=$1
case $action in
    "start" )
        # 启动服务
        start
        ;;
    "stop" )
        # 停止服务
        stop
        ;;
    * )
        echo "unknown command"
        exit 1
        ;;
esac
