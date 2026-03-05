from enum import Enum


class OrderItemFields(Enum):
    ID = "id"
    ORDER_ID = "order_id"
    PRODUCT_NAME = "product_name"
    QUANTITY = "quantity"
    UNIT_PRICE_EXCL_TAX = "unit_price_excl_tax"
    TAX_RATE = "tax_rate"


ID = {
    "name": OrderItemFields.ID.value,
    "type": "UUID",
    "primary": True,
    "default": "gen_random_uuid()"
}

ORDER_ID = {
    "name": OrderItemFields.ORDER_ID.value,
    "type": "UUID",
}

PRODUCT_NAME = {
    "name": OrderItemFields.PRODUCT_NAME.value,
    "type": "TEXT"
}

QUANTITY = {
    "name": OrderItemFields.QUANTITY.value,
    "type": "NUMERIC(12, 2)"
}

UNIT_PRICE_EXCL_TAX = {
    "name": OrderItemFields.UNIT_PRICE_EXCL_TAX.value,
    "type": "NUMERIC(12, 2)"
}

TAX_RATE = {
    "name": OrderItemFields.TAX_RATE.value,
    "type": "NUMERIC(12, 2)"
}


headers = [
    ORDER_ID,
    PRODUCT_NAME,
    QUANTITY,
    UNIT_PRICE_EXCL_TAX,
    TAX_RATE,
]
