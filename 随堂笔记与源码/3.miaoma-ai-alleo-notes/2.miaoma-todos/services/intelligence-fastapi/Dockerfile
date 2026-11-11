FROM python:3.12-slim
WORKDIR /app
COPY services/intelligence-fastapi/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY services/intelligence-fastapi/app ./app
RUN useradd --create-home appuser
USER appuser
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
