// ========================================================
// app.js — Realtime Attack Dashboard (Simulation Mode)
// ========================================================

// Helper random integer
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nowISO() {
    return new Date().toLocaleTimeString();
}

// Sample IP, port, signature
const sampleIPs = ["203.0.113.5", "198.51.100.23", "192.0.2.12", "45.33.32.1", "185.199.109.13"];
const sampleDst = [80, 443, 8080, 22, 3306];
const sampleSig = ["SQL Injection", "Port Scan", "XSS Attempt", "Brute Force", "Malicious File Upload"];

// DOM References
const totalAlertsEl = document.getElementById("total-alerts");
const attackTypeEl = document.getElementById("attack-type");
const topSrcEl = document.getElementById("top-src");
const topDstPortEl = document.getElementById("top-dst-port");
const alertsTbody = document.getElementById("alertsTbody");
const topSrcList = document.getElementById("topSrcList");
const topDstPortList = document.getElementById("topDstPortList");

// Counters
let totalAlerts = 0;
let srcCounter = {};
let dstCounter = {};
let severityCounter = { low: 0, med: 0, high: 0, crit: 0 };

// Trend chart data
let trendLabels = [];
let trendValues = [];

for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.now() - i * 5 * 60 * 1000);
    trendLabels.push(d.toLocaleTimeString());
    trendValues.push(rnd(0, 5));
}

// Chart.js — grafik
const ctx = document.getElementById("trendChart").getContext("2d");
const trendChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: trendLabels,
        datasets: [
            {
                label: "Alerts per 5min",
                data: trendValues,
                fill: true,
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    }
});

// ========================================================
// pushAlert() — menambah satu alert ke tabel + update counter
// ========================================================
function pushAlert() {
    const src = sampleIPs[rnd(0, sampleIPs.length - 1)];
    const dst = sampleDst[rnd(0, sampleDst.length - 1)];
    const sig = sampleSig[rnd(0, sampleSig.length - 1)];

    // Generate severity
    const sevRoll = rnd(1, 100);
    let sev = "low";
    if (sevRoll > 95) sev = "critical";
    else if (sevRoll > 80) sev = "high";
    else if (sevRoll > 50) sev = "medium";

    // Update counters
    totalAlerts++;
    srcCounter[src] = (srcCounter[src] || 0) + 1;
    dstCounter[dst] = (dstCounter[dst] || 0) + 1;

    if (sev === "low") severityCounter.low++;
    if (sev === "medium") severityCounter.med++;
    if (sev === "high") severityCounter.high++;
    if (sev === "critical") severityCounter.crit++;

    // Insert table row
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${nowISO()}</td>
        <td>${src}</td>
        <td>192.168.1.10</td>
        <td>${dst}</td>
        <td>${sig}</td>
        <td><span class="badge ${sev}">${sev}</span></td>
        <td><button onclick="blockIp('${src}', this)">Block</button></td>
    `;

    alertsTbody.prepend(tr);

    // Batasi hanya 50 row
    while (alertsTbody.children.length > 50) {
        alertsTbody.removeChild(alertsTbody.lastChild);
    }

    refreshOverview();
}

// ========================================================
// refreshOverview() — update card, top IP, severity, chart
// ========================================================
function refreshOverview() {
    totalAlertsEl.textContent = totalAlerts;

    // Top Source
    const topSrc = Object.entries(srcCounter).sort((a, b) => b[1] - a[1])[0];
    topSrcEl.textContent = topSrc ? `${topSrc[0]} (${topSrc[1]})` : "-";

    // Top Destination Port
    const topDst = Object.entries(dstCounter).sort((a, b) => b[1] - a[1])[0];
    topDstPortEl.textContent = topDst ? `${topDst[0]} (${topDst[1]})` : "-";

    // Attack type (sementara pakai IP terbanyak)
    attackTypeEl.textContent = topSrc ? topSrc[0] : "-";

    // Severity update
    document.querySelector(".sev.low").textContent = `Low: ${severityCounter.low}`;
    document.querySelector(".sev.med").textContent = `Med: ${severityCounter.med}`;
    document.querySelector(".sev.high").textContent = `High: ${severityCounter.high}`;
    document.querySelector(".sev.crit").textContent = `Crit: ${severityCounter.crit}`;

    updateList(topSrcList, srcCounter);
    updateList(topDstPortList, dstCounter);

    trendChart.data.labels = trendLabels;
    trendChart.data.datasets[0].data = trendValues;
    trendChart.update();
}

// ========================================================
// updateList() — tampilkan Top 8 list
// ========================================================
function updateList(ul, counter) {
    ul.innerHTML = "";

    const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
    const top8 = sorted.slice(0, 8);

    if (top8.length === 0) {
        ul.innerHTML = "<li>— no data —</li>";
        return;
    }

    top8.forEach(([key, val]) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${key}</span><strong>${val}</strong>`;
        ul.appendChild(li);
    });
}

// ========================================================
// Block IP — placeholder, belum terhubung backend
// ========================================================
window.blockIp = function (ip, btn) {
    btn.disabled = true;
    btn.textContent = "Blocked";
    console.log("TODO: Send block request to backend →", ip);
    // FETCH ke Flask nanti di sini
};

// ========================================================
// Simulation Interval — setiap 5 detik generate alert baru
// ========================================================
setInterval(() => {
    const n = rnd(1, 4);
    for (let i = 0; i < n; i++) pushAlert();
}, 5000);

// ========================================================
// Rolling bucket chart setiap 15 detik (demo mode)
// ========================================================
setInterval(() => {
    const d = new Date();
    trendLabels.push(d.toLocaleTimeString());
    trendValues.push(0);

    if (trendLabels.length > 24) {
        trendLabels.shift();
        trendValues.shift();
    }

    refreshOverview();
}, 15000);

// First render
refreshOverview();


