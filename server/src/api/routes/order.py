from fastapi import APIRouter, HTTPException
from uuid import UUID
from sqlmodel import Session
from src.database.dbconfig import engine
from src.repositories.order_repository import OrderRepository
from src.models.order import Order, OrderCreate, OrderItem, OrderRead

router = APIRouter(prefix="/order", tags=["Orders"])


@router.post("/", status_code=201, response_model=OrderRead)
async def create_order(order_data: OrderCreate):
    with Session(engine) as session:
        try:
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
            raise HTTPException(
                status_code=400, detail="Order could not be created.")


@router.get("/", response_model=list[OrderRead])
async def get_orders():
    with Session(engine) as session:
        repo = OrderRepository(session)
        return repo.get_all_orders()


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: UUID):
    with Session(engine) as session:
        repo = OrderRepository(session)
        order_data = repo.get_by_id(order_id)
        if not order_data:
            raise HTTPException(status_code=404, detail="Order not found.")
        return order_data
