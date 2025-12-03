// Real-time Logs
setInterval(() => {
    const log = document.getElementById("log-output");
    const randomIP = "192.168.1." + Math.floor(Math.random() * 255);
    const msg = `[INFO] Request from ${randomIP} at ${new Date().toLocaleTimeString()}`;

    log.textContent += msg + "\n";
    log.scrollTop = log.scrollHeight;
}, 1500);

// IDS Alerts
function pushIDS() {
    const list = document.getElementById("ids-list");
    const attacks = ["SQL Injection", "XSS", "Port Scan", "Brute Force", "LFI"];

    const item = document.createElement("li");
    item.textContent = attacks[Math.floor(Math.random() * attacks.length)] + " detected — " + new Date().toLocaleTimeString();

    list.prepend(item);
}
setInterval(pushIDS, 4000);

// Firewall Blocks
function pushFW() {
    const list = document.getElementById("fw-list");
    const item = document.createElement("li");
    item.textContent = "Blocked: 103.21.44." + Math.floor(Math.random() * 255);
    list.prepend(item);
}
setInterval(pushFW, 5000);

// Notifications
function pushNotif() {
    const list = document.getElementById("notif-list");
    const item = document.createElement("li");
    item.textContent = "⚠ High traffic detected!";
    list.prepend(item);
}
setInterval(pushNotif, 8000);

// Charts
new Chart(document.getElementById("chartTraffic"), {
    type: "line",
    data: {
        labels: ["1s", "2s", "3s", "4s", "5s"],
        datasets: [{
            label: "Requests per Second",
            data: [10, 20, 15, 30, 22],
            borderWidth: 2
        }]
    }
});

new Chart(document.getElementById("chartStats"), {
    type: "bar",
    data: {
        labels: ["SQLi", "XSS", "BruteForce", "DDoS", "Scan"],
        datasets: [{
            label: "Attack Counts",
            data: [5, 2, 8, 3, 6]
        }]
    }
});

new Chart(document.getElementById("chartResource"), {
    type: "doughnut",
    data: {
        labels: ["CPU", "RAM", "Disk"],
        datasets: [{ data: [40, 65, 30] }]
    }
});
