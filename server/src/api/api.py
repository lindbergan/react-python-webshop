from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware

from sqlmodel import create_engine, Session

from uuid import UUID

from src.database.dbconfig import settings
from src.repositories.order_repository import OrderRepository
from src.models.order import Order, OrderCreate, OrderItem

DATABASE_URL = f"postgresql://{settings.db_user}:{settings.db_password}@{settings.db_host}/{settings.db_name}"
engine = create_engine(DATABASE_URL)

app = FastAPI(title="Webshop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/order", status_code=201)
async def create_order(order_data: OrderCreate):
    try:
        with Session(engine) as session:
            db_items = [OrderItem(**item.model_dump())
                        for item in order_data.items]

            db_order = Order(
                date=order_data.date,
                customer_name=order_data.customer_name,
                currency=order_data.currency,
                items=db_items
            )

            repo = OrderRepository(session)
            repo.add(db_order)

            return db_order
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=400, detail="Order could not be created.")


@app.get("/order", response_model=list[Order])
async def get_orders():
    with Session(engine) as session:
        repo = OrderRepository(session)
        order_data = repo.get_all_orders()
        return order_data


@app.get("/order/{order_id}", response_model=Order)
async def get_order(order_id: str):
    with Session(engine) as session:
        repo = OrderRepository(session)
        order_data = repo.get_by_id(UUID(hex=order_id))

        if not order_data:
            raise HTTPException(status_code=404, detail="Order not found.")

        return order_data


@app.delete("/order/{order_id}", response_model=bool)
async def delete_order(order_id: str):
    with Session(engine) as session:
        repo = OrderRepository(session)
        success = repo.delete(UUID(hex=order_id))

        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"Order with ID {order_id} not found."
            )

        return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/health")
async def health_check():
    return {"status": "online"}
