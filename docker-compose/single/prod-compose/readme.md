# 1. 아래 스크립트를 실행 후
```sh
sh /prod-build-single.sh
```
<br />

# 2. 이미지를 복제(or 이동)
```sh
cd /docker-compose/single
cp ./prod-img/* ./prod-compose
```
<br />

# 3. 컨테이너 실행
```sh
cd /docker-compose/single/prod-compose
sh prod-run.sh
```
<br />

|파일명|설명|
|----|----|
|prod-run.sh|운영 서버에 웹 서버 실행 스크립트|
|docker-compose.yml|도커 컨테이너 실행 설정 파일|
|web-host.tar|운영 서버에 실행 할 도커 컨테이너 Host 이미지|

서버에 3가지 파일을 두고 __prod-run.sh__ 파일을 실행
