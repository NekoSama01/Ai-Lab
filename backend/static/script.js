let currentLang = "th";
let allData = []; // เก็บข้อมูลทั้งหมด

document.addEventListener("DOMContentLoaded", fetchData);

function fetchData() {
    fetch(`/places?lang=${currentLang}`)
        .then(response => response.json())
        .then(data => {
            console.log("🔹 Data from API:", data); // ตรวจสอบข้อมูล
            allData = data;
            renderTable(allData);
        })
        .catch(error => console.error("❌ Error fetching data:", error));
}


// ฟังก์ชันกรองข้อมูล
function filterData() {
    let searchQuery = document.getElementById("search").value.toLowerCase();
    let filteredData = allData.filter(place =>
        place.name.toLowerCase().includes(searchQuery) ||
        place.location.toLowerCase().includes(searchQuery)
    );
    renderTable(filteredData);
}

function renderTable(data) {
    console.log("🔹 Rendering Table with:", data.length, "items");
    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach(place => {
        let row = `<tr>
            <td>${place.name}</td>
            <td>${place.location}</td>
            <td>${place.type}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}


// เปลี่ยนภาษา
function changeLanguage(lang) {
    currentLang = lang;
    document.getElementById("title").innerText = lang === "th" ? "ข้อมูลสถานที่ท่องเที่ยว" : "Tourist Attractions";
    document.getElementById("search").placeholder = lang === "th" ? "🔍 ค้นหา..." : "🔍 Search...";
    fetchData(); // โหลดข้อมูลใหม่เมื่อเปลี่ยนภาษา
}
