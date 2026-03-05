import pytest

from src.database.dbmanager import DatabaseManager
from src.database.dbconfig import settings
from src.repositories.order_repository import OrderRepository


@pytest.fixture(scope="session")
def db_manager():
    """Create a manager for the whole test session."""
    manager = DatabaseManager(settings)
    return manager


@pytest.fixture
def order_repo(db_manager):
    """Create a repository for each test separately."""
    with db_manager as db:
        yield OrderRepository(db)

        if db.conn is not None:
            db.conn.rollback()
            print("\n[Pytest] Transaction rollbacked")
