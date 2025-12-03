from flask import Flask, render_template, request, redirect, session, url_for, flash
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "supersecretkey"

# DB connection (pastikan sesuai dengan config.py atau centralize)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="db_KeamananJaringan"   # pastikan nama DB persis sama dengan DB server
)

@app.route("/", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()

        cursor = db.cursor()
        cursor.execute("SELECT id, nama, username, password FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()
        cursor.close()

        if user and check_password_hash(user[3], password):   # jika pakai hashing
            session["user"] = user[1]  # simpan nama atau username sesuai kebutuhan
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", error="Username atau password salah!")

    return render_template("login.html")

# ====================================
# REGISTER
# ====================================
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("nama", "").strip()
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()
        confirm = request.form.get("confirm_password", "").strip()

        if not name or not username or not password or not confirm:
            return render_template("register.html", error="Semua kolom wajib diisi!")

        if password != confirm:
            return render_template("register.html", error="Password tidak cocok!")

        cursor = db.cursor()
        cursor.execute("SELECT id FROM users WHERE username=%s", (username,))
        if cursor.fetchone():
            cursor.close()
            return render_template("register.html", error="Username sudah digunakan!")
        
        hashed = generate_password_hash(password)   # gunakan hashing
        cursor.execute(
            "INSERT INTO users (nama, username, password) VALUES (%s, %s, %s)",
            (name, username, hashed)
        )
        db.commit()
        cursor.close()

        return redirect(url_for("login"))

    return render_template("register.html")

# ====================================
# DASHBOARD
# ====================================
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("index.html", user=session["user"])

# ====================================
# LOGOUT
# ====================================
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# ====================================
# RUN
# ====================================
if __name__ == "__main__":
    app.run(debug=True)
