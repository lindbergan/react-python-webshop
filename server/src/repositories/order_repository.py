from typing import List, Optional

from src.models.order import Order

from src.database.dbmanager import DatabaseManager
from src.database.order.config import ORDER_TABLE_NAME
from src.database.order.config import ORDER_ITEM_TABLE_NAME

from src.database.order.schema import OrderFields
from src.database.order.orderitem.schema import OrderItemFields


class OrderRepository:
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager

    def add(self, order: Order) -> Optional[str]:
        """Save an order and its rows"""
        if self.db.cursor is None:
            return None

        order_cols = [
            OrderFields.ID.value,
            OrderFields.DATE.value,
            OrderFields.CUSTOMER_NAME.value,
            OrderFields.CURRENCY.value
        ]

        placeholders = ", ".join(["%s"] * len(order_cols))
        columns_sql = ", ".join(order_cols)

        query_order = f"INSERT INTO {ORDER_TABLE_NAME} ({columns_sql}) VALUES ({placeholders}) RETURNING id;"

        self.db.cursor.execute(query_order, (
            str(order.id), order.date, order.customer_name, order.currency
        ))

        result = self.db.cursor.fetchone()
        if not result:
            return None

        order_id = result[OrderFields.ID.value]

        item_cols = [
            OrderItemFields.ORDER_ID.value,
            OrderItemFields.PRODUCT_NAME.value,
            OrderItemFields.QUANTITY.value,
            OrderItemFields.UNIT_PRICE_EXCL_TAX.value,
            OrderItemFields.TAX_RATE.value
        ]

        item_placeholders = ", ".join(["%s"] * len(item_cols))
        item_columns_sql = ", ".join(item_cols)

        query_item = f"INSERT INTO {ORDER_ITEM_TABLE_NAME} ({item_columns_sql}) VALUES ({item_placeholders});"

        item_values = [
            (str(order_id), item.product_name, item.quantity,
             item.unit_price_excl_tax, item.tax_rate)
            for item in order.items
        ]

        self.db.cursor.executemany(query_item, item_values)
        return str(order_id)

    def _get_base_query(self) -> str:
        """
        Helper query
        """
        return f"""
            SELECT * FROM {ORDER_TABLE_NAME} o
            LEFT JOIN {ORDER_ITEM_TABLE_NAME} i ON o.id = i.order_id
        """

    def get_all_orders(self) -> List[Order]:
        """
        Get orders

        :return: The orders found
        :rtype: List[Order]
        """
        if self.db.cursor is not None:
            self.db.cursor.execute(self._get_base_query())
            return Order.from_db_rows(self.db.cursor.fetchall())
        else:
            return []

    def get_by_id(self, order_id: str) -> Optional[Order]:
        """
        Get order by ID

        :param order_id: Order UUID
        :type order_id: str
        :return: Order if it exists
        :rtype: Order | None
        """
        if self.db.cursor is not None:
            query = f"{self._get_base_query()} WHERE o.id = %s;"
            self.db.cursor.execute(query, (order_id,))

            orders = Order.from_db_rows(self.db.cursor.fetchall())
            return orders[0] if orders else None
        return None

    def delete(self, order_id: str) -> bool:
        """
        Delete an order

        :param order_id: Order UUID
        :type order_id: str
        :return: If successful
        :rtype: bool
        """
        if self.db.cursor is not None:
            query = f"DELETE FROM {ORDER_TABLE_NAME} WHERE id = %s"
            self.db.cursor.execute(query, (order_id,))
            return self.db.cursor.rowcount > 0
        else:
            return False
