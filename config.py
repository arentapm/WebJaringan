import mysql.connector

try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="db_KeamananJaringan"
    )
    print("Koneksi berhasil!")
except Exception as e:
    print("Error:", e)