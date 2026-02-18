from flask import Flask, request
from database import get_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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


@app.delete("/api/transactions/<int:id>")
def delete_transaction(id):
    db = get_db()
    db.execute("DELETE FROM transactions WHERE id = ?", (id,))
    db.commit()
    return {"status": "deleted"}


@app.patch("/api/transactions/<int:id>/category")
def update_transaction_category(id):
    data = request.get_json() or {}
    category = data.get("category", "")

    if not isinstance(category, str) or not category.strip():
        return {"error": "category is required"}, 400

    db = get_db()
    db.execute(
        "UPDATE transactions SET category = ? WHERE id = ?",
        (category.strip(), id),
    )
    db.commit()
    return {"status": "updated"}


@app.get("/api/income")
def get_income():
    db = get_db()
    rows = db.execute("SELECT * FROM income").fetchall()
    return {"income": [dict(r) for r in rows]}


@app.post("/api/income")
def add_income():
    data = request.get_json()
    db = get_db()
    db.execute(
        "INSERT INTO income (amount, source, date, description) VALUES (?, ?, ?, ?)",
        (data["amount"], data["source"], data["date"], data.get("description"))
    )
    db.commit()
    return {"status": "ok"}


@app.delete("/api/income/<int:id>")
def delete_income(id):
    db = get_db()
    db.execute("DELETE FROM income WHERE id = ?", (id,))
    db.commit()
    return {"status": "deleted"}


if __name__ == "__main__":
    app.run(debug=True)
