from enum import Enum


class OrderFields(Enum):
    ID = "id"
    DATE = "date"
    CUSTOMER_NAME = "customer_name"
    CURRENCY = "currency"


ID = {
    "name": OrderFields.ID.value,
    "type": "UUID",
    "primary": True,
    "default": "gen_random_uuid()"
}

DATE = {
    "name": OrderFields.DATE.value,
    "type": "DATE"
}

CUSTOMER_NAME = {
    "name": OrderFields.CUSTOMER_NAME.value,
    "type": "TEXT"
}

CURRENCY = {
    "name": OrderFields.CURRENCY.value,
    "type": "TEXT"
}


headers = [
    ID,
    DATE,
    CUSTOMER_NAME,
    CURRENCY,
]
