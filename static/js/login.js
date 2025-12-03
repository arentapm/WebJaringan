document.getElementById("loginForm").addEventListener("submit", function(e) {
    let username = e.target.username.value.trim();
    let password = e.target.password.value.trim();

    if (!username || !password) {
        alert("Semua kolom wajib diisi!");
        e.preventDefault();
    }
});
