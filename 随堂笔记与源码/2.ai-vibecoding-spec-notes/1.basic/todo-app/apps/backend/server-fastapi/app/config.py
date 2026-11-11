from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DB_HOST: str = "localhost"
    DB_PORT: int = 5433
    DB_USERNAME: str = "postgres"
    DB_PASSWORD: str = ""
    DB_DATABASE: str = "todo_app"

    PORT: int = 8083
    JWT_SECRET: str = "todo-app-dev-secret-change-me-in-production-0123456789"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.DB_USERNAME}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_DATABASE}"
        )


settings = Settings()
