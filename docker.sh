#!/bin/bash
# 项目名称
name='open-nga'
# 对外端口
imgName=${name}-image:latest
mapDir=/home/open-nga/files

docker container stop ${name}
docker container rm ${name}
docker image rm ${imgName}
docker build -t ${imgName} .
docker run -d -p 11450:80 -p 11451:80 -p 11452:80 -p 11453:80 -v ${mapDir}:${mapDir} --name ${name} ${imgName}

rm -rf dist