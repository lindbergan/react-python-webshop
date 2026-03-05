from src.database.dbmanager import DatabaseManager
from src.database.dbconfig import settings
from src.database.order.config import ORDER_TABLE_NAME, ORDER_ITEM_TABLE_NAME
from src.database.order.schema import headers as order_headers
from src.database.order.orderitem.schema import headers as order_item_headers


def setup_database() -> DatabaseManager | None:
    try:
        manager = DatabaseManager(settings)

        with manager as db_manager:
            db_manager.create_table(ORDER_TABLE_NAME, order_headers)
            db_manager.create_table(ORDER_ITEM_TABLE_NAME, order_item_headers)
            print("Tabeller kontrollerade/skapade.")
        return manager
    except Exception as e:
        print(f"Added to DB did not work: {e}")
        return None


def main():
    db_manager = setup_database()

    if db_manager is not None:
        print("Database sync complete.")
    else:
        print("Database sync failed.")
        exit(1)


if __name__ == "__main__":
    main()
