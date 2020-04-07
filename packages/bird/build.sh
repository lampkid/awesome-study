#!/bin/bash
source ~/.nvm/nvm.sh
nvm use v10.10.0

if ! [ -x "$(command -v yarn)" ]; then
    echo 'Error: yarn is not installed. install yarn...' >&2
    npm install -g yarn
fi

pid=$$

pwd=`pwd`

echo "working dir...$pwd"

function make_dist() {
    local dist="dist"
    if [ -d $dist ];then
        rm -rf $dist
        local ret=$?
        if [ $ret -ne 0 ];then
            echo "====== Remove $dist failure ======"
            exit $ret
        fi
    fi
    yarn
    yarn build
    local build_ret=$?

    if [ -d $dist ];then
        echo "build:ret:$build_ret";
        return $build_ret;
    else:
        echo "====== build failure ======"
        exit 1;
    fi

}

function make_output() {
    // do tar
}


make_dist

if [ $? -eq 0 ];then

    make_output

    echo -e "build done"
    exit 0
else
    exit $?
fi
