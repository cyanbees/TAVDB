#!/bin/bash
# PlayNO1 → Blinko Sync 启动脚本
# 用法: ./run.sh [mode]
#   mode: full | incremental | test-connection (默认: incremental)

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 加载 .env
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

MODE="${1:-incremental}"

echo "========================================"
echo " PlayNO1 → Blinko Sync"
echo " Mode: $MODE"
echo " Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"
echo ""

node src/index.js --mode="$MODE"

echo ""
echo "✅ 完成: $(date '+%Y-%m-%d %H:%M:%S')"
