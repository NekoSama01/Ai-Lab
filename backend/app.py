from flask import Flask, jsonify, request, send_from_directory
from rdflib import Graph
import os

app = Flask(__name__, static_folder="static", static_url_path="/static")

# โหลด OWL จากตำแหน่งที่ถูกต้อง
owl_path = os.path.join(os.path.dirname(__file__), "mytourism.owl")

g = Graph()
g.parse(owl_path, format="xml")  # ตรวจสอบว่าไฟล์อยู่ตรงนี้จริง

# ตรวจสอบว่ามีข้อมูลใน OWL หรือไม่
print(f"จำนวนข้อมูลใน OWL: {len(g)}")  # ควรเห็นตัวเลขมากกว่า 0 ใน Terminal

# API ดึงข้อมูล OWL
@app.route("/places", methods=["GET"])
def get_places():
    lang = request.args.get("lang", "th")  # ค่าเริ่มต้นเป็นภาษาไทย

    query = """
    PREFIX myt: <http://www.my_ontology.edu/mytourism#>
    SELECT ?province ?name_en ?flower WHERE {
        ?province a myt:ThaiProvince .
        ?province myt:hasTraditionalNameOfProvince ?name_en .
        ?province myt:hasFlower ?flower .
    }
    """

    results = g.query(query)
    places = []

    for row in results:
        places.append({
            "name": row.name_en,  
            "location": row.province.split("#")[-1],  
            "type": row.flower  
        })

    return jsonify(places)

# เปิดหน้าเว็บ
@app.route("/")
def home():
    return send_from_directory("static", "index.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
