from pydantic import BaseModel, Field, computed_field
from decimal import Decimal


class OrderItem(BaseModel):
    product_name: str
    quantity: int = Field(gt=0)
    unit_price_excl_tax: Decimal
    tax_rate: Decimal = Field(default=Decimal("0.25"))

    @computed_field
    @property
    def total_excl_tax(self) -> Decimal:
        return self.quantity * self.unit_price_excl_tax

    @computed_field
    @property
    def tax_amount(self) -> Decimal:
        return self.total_excl_tax * self.tax_rate
