#!/bin/bash

echo "✨Project clean start."

# Monorepo 캐시, 프로젝트 설치 패키지 제거
rm -rf ./.turbo
rm -rf ./node_modules

# pnpm에서 뭔가 꼬였다면 아래 항목도 제거
# rm ./pnpm-lock.yaml

# 하위 앱 정리
./clean.sh