# apps 빌드
pnpm build

# 빌드 경로
buildPath="./docker-compose/remote"

rm -rf ./$buildPath/dist
mkdir ./$buildPath/dist

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