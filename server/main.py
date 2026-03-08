from fastapi import FastAPI
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware

from src.database.dbconfig import engine
from src.api.routes import order, product


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


create_db_and_tables()

app = FastAPI(title="Webshop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(order.router)
app.include_router(product.router)


@app.get("/health")
async def health_check():
    return {"status": "online"}
