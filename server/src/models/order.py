from pydantic import BaseModel, computed_field, Field

from uuid import UUID, uuid4
from datetime import date
from typing import List, Dict, Any
from decimal import Decimal

from src.models.orderitem import OrderItem


class Order(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    date: date
    customer_name: str
    currency: str
    items: List[OrderItem]

    @computed_field
    @property
    def total_amount_excl_tax(self) -> Decimal:
        return sum((item.total_excl_tax for item in self.items), Decimal(0))

    @computed_field
    @property
    def total_tax(self) -> Decimal:
        return sum((item.tax_amount for item in self.items), Decimal(0))

    @computed_field
    @property
    def total_amount_incl_tax(self) -> Decimal:
        return self.total_amount_excl_tax + self.total_tax

    @classmethod
    def from_db_rows(cls, rows: List[Any]) -> List["Order"]:
        """
        Factory method: Convert raw SQL-rows to a list of order Objects
        """
        orders_map: Dict[UUID, Dict[str, Any]] = {}

        for row in rows:
            order_id = row["id"]

            if order_id not in orders_map:
                orders_map[order_id] = {
                    "id": order_id,
                    "date": row["date"],
                    "customer_name": row["customer_name"],
                    "currency": row["currency"],
                    "items": []
                }

            if row.get("product_name") is not None:
                orders_map[order_id]["items"].append({
                    "product_name": row["product_name"],
                    "quantity": row["quantity"],
                    "unit_price_excl_tax": row["unit_price_excl_tax"],
                    "tax_rate": row["tax_rate"],
                })

        return [cls(**data) for data in orders_map.values()]
