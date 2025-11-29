from flask import Flask, jsonify

app = Flask(__name__)

SURICATA_LOG = r"C:\Program Files\Suricata\log\fast.log"   # ubah sesuai lokasimu

@app.route("/alerts")
def alerts():
    result = []
    try:
        with open(SURICATA_LOG, "r") as f:
            for line in f:
                result.append(line.strip())
    except FileNotFoundError:
        return jsonify({"error": "Log Suricata tidak ditemukan"}), 404

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
