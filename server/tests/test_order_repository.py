from datetime import date
from decimal import Decimal
from src.models.order import Order
from src.models.orderitem import OrderItem


def test_create_and_get_order(order_repo):
    new_order = Order(
        date=date.today(),
        customer_name="Testköpare",
        currency="SEK",
        items=[
            OrderItem(product_name="Testprodukt", quantity=1,
                      unit_price_excl_tax=Decimal("100.00"), tax_rate=Decimal("0.25"))
        ]
    )

    order_id = order_repo.add(new_order)

    assert order_id is not None

    fetched_order = order_repo.get_by_id(order_id)
    print(fetched_order.total_amount_incl_tax)
    assert fetched_order.customer_name == "Testköpare"
    assert len(fetched_order.items) == 1
    assert fetched_order.items[0].unit_price_excl_tax == Decimal("100.00")
    assert fetched_order.items[0].tax_rate == Decimal("0.25")


def test_get_orders(order_repo):
    orders = order_repo.get_all_orders()
    assert len(orders) > 0


def test_delete_order(order_repo):
    new_order = Order(date=date.today(), customer_name="Ska tas bort",
                      currency="SEK", items=[])
    order_id = order_repo.add(new_order)

    success = order_repo.delete(order_id)

    assert success is True
    assert order_repo.get_by_id(order_id) is None
