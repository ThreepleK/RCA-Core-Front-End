# 컨테이너 이미지 불러오기
app_arr=("host" "admin" "rca")

for app in "${app_arr[@]}"; do
    docker load -i "web-$app.tar"
done

# docker 실행
docker compose up