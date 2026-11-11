from fastapi import FastAPI

app = FastAPI(title="Miaoma Intelligence", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "intelligence-fastapi"}


@app.post("/v1/parse-date")
def parse_date(payload: dict[str, str]) -> dict[str, str | None]:
    text = payload.get("text", "").strip()
    return {"input": text, "date": None, "time": None, "repeat": None}
