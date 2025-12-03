# monitoring.py

from flask_mail import Message
from threading import Thread
import time
from app import mail, app
from config import Config


# -------------------------------
# FUNGSI KIRIM EMAIL
# -------------------------------
def send_alert_email(subject, message):
    with app.app_context():
        try:
            msg = Message(subject=subject, recipients=['target@mail.com'])  # GANTI EMAIL TUJUAN
            msg.html = message
            mail.send(msg)
            print("[ALERT] Email terkirim:", subject)
        except Exception as e:
            print("Gagal kirim email:", e)


# -------------------------------
# CONTOH: DUMMY TRAFFIC MONITORING
# -------------------------------
def get_traffic_per_minute():
    # contoh data dummy: nanti kamu ganti pakai data asli dari logs / database
    import random
    return random.randint(500, 4000)


# -------------------------------
# CEK TRAFFIC
# -------------------------------
def check_traffic():
    traffic = get_traffic_per_minute()

    print(f"[INFO] Traffic sekarang: {traffic} req/min")

    if traffic > Config.TRAFFIC_THRESHOLD:
        send_alert_email(
            "🚨 Traffic Mencurigakan",
            f"""
            <h3>Warning: Lonjakan Traffic</h3>
            <p>Terjadi lonjakan traffic sebesar <b>{traffic}</b> request/minute.</p>
            """
        )


# -------------------------------
# LOOP MONITORING BACKGROUND
# -------------------------------
def monitoring_loop():
    while True:
        check_traffic()
        time.sleep(10)    # Cek setiap 10 detik
