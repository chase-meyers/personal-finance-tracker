from flask import Blueprint, request
from database import get_db

transactions = Blueprint("transactions", __name__)


@transactions.post("/")
def add_transaction():
    data = request.json
    db = get_db()
    db.execute(
        "INSERT INTO transactions (amount, category, date, description) VALUES (?, ?, ?, ?)",
        (data["amount"], data["category"],
         data["date"], data.get("description"))
    )
    db.commit()
    return {"status": "ok"}
