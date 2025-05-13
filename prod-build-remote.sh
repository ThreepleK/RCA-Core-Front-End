# apps 빌드
pnpm build

# 빌드 경로
buildPath="./docker-compose/remote"

rm -rf ./$buildPath/dist
mkdir ./$buildPath/dist
rm -rf ./$buildPath/prod-img
mkdir ./$buildPath/prod-img

# 배포 경로 설정
for dir in ./apps/*/dist; do
    name=$(basename "$(dirname "$dir")")

    if [ "$name" = "host" ]; then
        mkdir -p "$buildPath/dist/app"
        cp -r "$dir/"* "$buildPath/dist/app"
    else
        mkdir -p "$buildPath/dist/r/$name"
        cp -r "$dir/"* "$buildPath/dist/r/$name/"
    fi
done

# docker compose 구동
cd "$buildPath"
docker compose up --build

# 컨테이너 이미지 생성
app_arr=("host" "admin" "rca")

cd "./prod-img"
for app in "${app_arr[@]}"; do
    docker commit "$app" "$app:latest"
    docker save -o "web-$app.tar" "$app:latest"
done