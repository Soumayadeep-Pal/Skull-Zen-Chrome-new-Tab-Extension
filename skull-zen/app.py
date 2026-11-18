# from flask import Flask, jsonify
# from flask_cors import CORS
# import psutil

# app = Flask(__name__)
# CORS(app)  # allow requests from your extension

# def chrome_memory_bytes():
#     total = 0
#     for p in psutil.process_iter(["name", "memory_info"]):
#         try:
#             name = (p.info["name"] or "").lower()
#             if "chrome" in name:               # counts all Chrome processes
#                 total += p.info["memory_info"].rss  # bytes
#         except (psutil.NoSuchProcess, psutil.AccessDenied):
#             continue
#     return total

# @app.get("/memory")
# def memory():
#     chrome_bytes = chrome_memory_bytes()
#     system_total_bytes = psutil.virtual_memory().total
#     return jsonify({
#         "chrome_memory_mb": round(chrome_bytes / (1024*1024), 2),
#         "system_total_mb": round(system_total_bytes / (1024*1024), 2)
#     })

# if __name__ == "__main__":
#     app.run(host="127.0.0.1", port=5000)




import os
import psutil
import time
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# ----------------- Firebase setup -----------------
cred = credentials.Certificate(os.environ.get("FIREBASE_KEY_PATH", "firebase_key.json"))
firebase_admin.initialize_app(cred, {
    "databaseURL": os.environ["FIREBASE_DATABASE_URL"]
})

# Any identifier for the node your data is written under
USER_ID = os.environ.get("MEMORY_USER_ID", "default_user")

# ----------------- Function to get Chrome memory -----------------
def get_chrome_memory():
    total = 0
    for p in psutil.process_iter(["name", "memory_info"]):
        try:
            name = (p.info["name"] or "").lower()
            if "chrome" in name:
                total += p.info["memory_info"].rss
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return round(total / (1024*1024), 2)  # MB

# ----------------- Push data to Firebase -----------------
def push_memory():
    mem = get_chrome_memory()
    ref = db.reference(f"/chrome_memory/{USER_ID}")
    ref.set({
        "memory_mb": mem
    })

# ----------------- Run periodically -----------------
if __name__ == "__main__":
    while True:
        push_memory()
        time.sleep(2)  # push every 2 seconds
