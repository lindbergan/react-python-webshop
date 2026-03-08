from typing import Sequence, Optional
from uuid import UUID
from sqlmodel import Session, select

from src.models.product import Product, ProductCreate


class ProductRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, product: Product) -> UUID:
        """Save an product"""
        self.session.add(product)
        self.session.commit()
        self.session.refresh(product)
        return product.id

    def get_all_products(self) -> Sequence[Product]:
        """Get all products"""
        statement = select(Product)
        return self.session.exec(statement).all()

    def get_by_id(self, product_id: UUID) -> Optional[Product]:
        """Get product by ID"""
        statement = select(Product).where(
            Product.id == product_id)
        return self.session.exec(statement).first()

    def delete(self, product_id: UUID) -> bool:
        """Delete an product"""
        product = self.session.get(Product, product_id)
        if product:
            self.session.delete(product)
            self.session.commit()
            return True
        return False
