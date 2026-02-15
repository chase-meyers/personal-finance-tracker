from flask import Flask, request
from database import get_db

app = Flask(__name__)


@app.get("/api/transactions")
def get_transactions():
    db = get_db()
    rows = db.execute("SELECT * FROM transactions").fetchall()
    return {"transactions": [dict(r) for r in rows]}


@app.post("/api/transactions")
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


if __name__ == "__main__":
    app.run(debug=True)
