from fastapi import APIRouter, HTTPException
from sqlmodel import Session

from uuid import UUID

from src.models.product import Product, ProductCreate
from src.database.dbconfig import engine
from src.repositories.product_repository import ProductRepository


router = APIRouter(prefix="/product", tags=["Products"])


@router.get("/", response_model=list[Product])
async def get_products():
    with Session(engine) as session:
        repo = ProductRepository(session)
        return repo.get_all_products()


@router.get("/{product_id}", response_model=Product)
async def get_product_id(product_id: UUID):
    with Session(engine) as session:
        repo = ProductRepository(session)
        return repo.get_by_id(product_id)


@router.post("/", response_model=Product)
async def save_product(product: ProductCreate):
    with Session(engine) as session:
        try:
            repo = ProductRepository(session)
            db_product = Product(
                product_name=product.product_name,
                sku=product.sku,
                tax_rate=product.tax_rate,
                unit_price_excl_tax=product.unit_price_excl_tax,
            )
            repo.add(db_product)
            return db_product
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=400, detail="Product could not be created.")
