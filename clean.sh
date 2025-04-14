#!/bin/bash

echo "🧹 Cleaning workspace..."

# 앱 안에 package.json의 script 'clean' 실행
for dir in ./apps/*; do
    name="$(basename "$dir")"
    echo "🧽 Cleaning $dir..."
    pnpm --filter $dir clean
done

# 패키지 재설치
echo "📦 Reinstalling dependencies with pnpm..."
pnpm i

echo "✅ Done! Clean environment ready."