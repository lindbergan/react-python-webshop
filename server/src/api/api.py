from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware

from src.database.dbconfig import settings
from src.database.dbmanager import DatabaseManager

from src.repositories.order_repository import OrderRepository

from src.models.order import Order

app = FastAPI(title="Webshop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_manager = DatabaseManager(settings)
order_repo = OrderRepository(db_manager)


@app.post("/order", status_code=201)
async def create_order(order: Order):
    try:
        with db_manager as _:
            order_id = order_repo.add(order)
            order_id_resp = {
                "order_id": order_id
            }
            merged = {
                **order_id_resp,
                **order.model_dump(mode='json')
            }
            return merged
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/order", response_model=list[Order])
async def get_orders():
    with db_manager as _:
        order_data = order_repo.get_all_orders()
        return order_data


@app.get("/order/{order_id}", response_model=Order)
async def get_order(order_id: str):
    with db_manager as _:
        order_data = order_repo.get_by_id(order_id)

        if not order_data:
            raise HTTPException(status_code=404, detail="Order not found")

        return order_data


@app.delete("/order/{order_id}", response_model=bool)
async def delete_order(order_id: str):
    with db_manager as _:
        success = order_repo.delete(order_id)

        if not success:
            raise HTTPException(
                status_code=404,
                detail=f"Order with ID {order_id} not found"
            )

        return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/health")
async def health_check():
    return {"status": "online"}
