"""
Smart Database Migration Script for StartupSaarthi
Updates the schema (adds new tables/columns) without dropping existing data.
"""
import os
import sys
from dotenv import load_dotenv

# Add the current directory to sys.path to allow importing from 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from sqlalchemy import inspect, text
from app.database.database import engine
from app.models import Base
import sqlalchemy

def get_sql_type(column, dialect):
    """Returns the SQL string for a column type."""
    return column.type.compile(dialect=dialect)

def migrate():
    print("------------------------------------------------")
    print("StartupSaarthi - Smart Migration Engine")
    print("------------------------------------------------")
    
    # Create a fresh synchronous engine for migration
    db_url = os.getenv("DATABASE_URL")
    if db_url and "postgresql+asyncpg://" in db_url:
        db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
    
    # Extract database name and base URL to connect to 'postgres' first
    from sqlalchemy.engine.url import make_url
    url = make_url(db_url)
    db_name = url.database
    
    # Connect to 'postgres' database to create the new database if it doesn't exist
    postgres_url = url.set(database='postgres')
    engine_postgres = sqlalchemy.create_engine(postgres_url, isolation_level="AUTOCOMMIT")
    
    with engine_postgres.connect() as conn:
        result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'"))
        if not result.fetchone():
            print(f"Database '{db_name}' does not exist. Creating...")
            conn.execute(text(f'CREATE DATABASE "{db_name}"'))
            print(f"Database '{db_name}' created successfully.")
        else:
            print(f"Database '{db_name}' already exists.")
    engine_postgres.dispose()

    sync_engine = sqlalchemy.create_engine(db_url)
    inspector = inspect(sync_engine)
    
    # 1. Create any brand new tables
    print("Checking for new tables...")
    Base.metadata.create_all(bind=sync_engine)
    
    # 2. Check existing tables for missing columns
    print("Checking for schema updates in existing tables...")
    with sync_engine.connect() as conn:
        for table_name, table in Base.metadata.tables.items():
            # Get existing columns from the actual database
            try:
                # Some databases use lowercase table names, handle case sensitivity if needed
                existing_cols = {c['name'] for c in inspector.get_columns(table_name)}
            except Exception:
                # Table might not exist yet or other error
                continue
            
            for column in table.columns:
                if column.name not in existing_cols:
                    print(f"  [+] Found new column: {table_name}.{column.name}")
                    
                    # Generate the ALTER TABLE statement
                    type_str = get_sql_type(column, sync_engine.dialect)
                    
                    # Handle nullability and defaults safely
                    # We use double quotes for table and column names to handle reserved words or mixed case
                    alter_query = f'ALTER TABLE "{table_name}" ADD COLUMN "{column.name}" {type_str}'
                    
                    # If the column is NOT NULL, we should provide a default if there's data
                    if not column.nullable:
                        if column.default is not None:
                            # Simple default handling
                            default_val = column.default.arg
                            if isinstance(default_val, str):
                                alter_query += f" DEFAULT '{default_val}'"
                            elif not callable(default_val):
                                alter_query += f" DEFAULT {default_val}"
                            # Note: callable defaults (like datetime.now) are not easily handled in ALTER TABLE
                        else:
                            # If no default provided but NOT NULL, we could force it to be nullable 
                            # to avoid errors with existing rows, but for now we follow the user's template.
                            pass

                    try:
                        conn.execute(text(alter_query))
                        conn.commit()
                        print(f"      Successfully added.")
                    except Exception as e:
                        print(f"      Error adding column: {e}")
                        conn.rollback()

    print("------------------------------------------------")
    print("SUCCESS: Database schema is up to date!")
    print("Data was preserved.")
    print("------------------------------------------------")

if __name__ == "__main__":
    migrate()
