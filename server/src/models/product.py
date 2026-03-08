from uuid import UUID, uuid4
from decimal import Decimal
from typing import ClassVar
from sqlmodel import SQLModel, Field


class ProductCreate(SQLModel):
    sku: str
    product_name: str
    unit_price_excl_tax: Decimal
    tax_rate: Decimal

    @property
    def tax_amount(self) -> Decimal:
        return self.unit_price_excl_tax * self.tax_rate


class Product(SQLModel, table=True):
    __tablename__: ClassVar[str] = "products"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sku: str
    product_name: str
    unit_price_excl_tax: Decimal
    tax_rate: Decimal

    @property
    def tax_amount(self) -> Decimal:
        return self.unit_price_excl_tax * self.tax_rate
