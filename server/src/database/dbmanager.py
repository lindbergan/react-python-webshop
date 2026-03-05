import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import connection

from src.database.dbconfig import Config


class DatabaseManager:
    def __init__(self, config: Config):
        self.config = config
        self.conn: connection | None = None
        self.cursor: RealDictCursor | None = None

    def create_table(self, table_name: str, schema: list):
        column_definitions = []
        for col in schema:
            name = col["name"]
            ctype = col["type"]

            is_primary = " PRIMARY KEY" if col.get("primary") else ""
            default_val = f" DEFAULT {col.get('default')}" if col.get(
                "default") else ""

            definition = f"{name} {ctype}{is_primary}{default_val}"
            column_definitions.append(definition)

        query = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(column_definitions)})"

        if self.cursor is not None:
            self.cursor.execute(query)

    def __enter__(self):
        config_json = {
            "database": self.config.db_name,
            "user": self.config.db_user,
            "password": self.config.db_password,
            "host": self.config.db_host,
            "port": self.config.db_port
        }
        self.conn = psycopg2.connect(**config_json)
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)
        return self

    def __exit__(self, exc_type, exc_vat, exc_tbh):
        if self.conn:
            if exc_type is None:
                self.conn.commit()
            else:
                self.conn.rollback()
            if self.cursor:
                self.cursor.close()
            self.conn.close()
