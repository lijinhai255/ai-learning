from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .entities import Todo, User
from .routers import auth_router, todos_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # 与 NestJS 版共用同一套表结构，仅做幂等建表
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Todo 应用 API 文档",
    description="Todo 应用 API 文档（FastAPI 版，教学演示，与 NestJS 版 API 对齐）",
    version="1.0",
    docs_url="/doc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(todos_router)
