from typing import Sequence, Optional
from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from src.models.order import Order


class OrderRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, order: Order) -> UUID:
        """Save an order and its rows automatically"""
        self.session.add(order)
        self.session.commit()
        self.session.refresh(order)
        return order.id

    def get_all_orders(self) -> Sequence[Order]:
        """Get all orders with items already attached"""
        statement = select(Order).options(selectinload(Order.items))
        return self.session.exec(statement).all()

    def get_by_id(self, order_id: UUID) -> Optional[Order]:
        """Get order by ID"""
        statement = select(Order).where(
            Order.id == order_id).options(selectinload(Order.items))
        return self.session.exec(statement).first()

    def delete(self, order_id: UUID) -> bool:
        """Delete an order"""
        order = self.session.get(Order, order_id)
        if order:
            self.session.delete(order)
            self.session.commit()
            return True
        return False
