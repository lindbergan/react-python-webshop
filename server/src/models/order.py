from typing import List
from uuid import UUID, uuid4
from datetime import date
from typing import ClassVar, Sequence
from sqlmodel import SQLModel, Field, Relationship

# API validation schemas


class OrderItemBase(SQLModel):
    product_name: str
    product_sku: str
    quantity: int
    unit_price_excl_tax: float
    tax_rate: float


class OrderCreate(SQLModel):
    date: date
    customer_name: str
    currency: str
    items: Sequence[OrderItemBase]


class OrderRead(SQLModel):
    date: date
    customer_name: str
    currency: str
    items: Sequence[OrderItemBase] = []


# Data base tables


class Order(SQLModel, table=True):
    __tablename__: ClassVar[str] = "orders"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    date: date
    customer_name: str
    currency: str

    items: List["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__: ClassVar[str] = "orderitems"
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    product_name: str
    product_sku: str
    quantity: int
    unit_price_excl_tax: float
    tax_rate: float

    order_id: UUID = Field(foreign_key="orders.id")
    order: "Order" = Relationship(back_populates="items")
