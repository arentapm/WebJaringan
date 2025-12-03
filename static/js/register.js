document.getElementById("registerForm").addEventListener("submit", function(e) {
    let p = e.target.password.value.trim();
    let c = e.target.confirm_password.value.trim();

    if (p !== c) {
        alert("Password tidak cocok!");
        e.preventDefault();
    }
});
