import sys
from pathlib import Path


# 允许从仓库根目录执行 pytest，同时保持应用可直接用 uvicorn app.main 启动。
APP_ROOT = Path(__file__).resolve().parents[1]
if str(APP_ROOT) not in sys.path:
    sys.path.insert(0, str(APP_ROOT))
