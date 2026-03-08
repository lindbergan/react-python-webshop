from sqlmodel import SQLModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlmodel import create_engine


class Config(BaseSettings):
    db_host: str
    db_port: int
    db_user: str
    db_password: str
    db_name: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Config()  # type: ignore

DATABASE_URL = f"postgresql://{settings.db_user}:{settings.db_password}@{settings.db_host}/{settings.db_name}"
engine = create_engine(DATABASE_URL)
