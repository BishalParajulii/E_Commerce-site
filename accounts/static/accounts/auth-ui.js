const storageKey = "orders-ui-token";
const userKey = "orders-ui-user";

function setMessage(node, message, kind = "success") {
    if (!node) {
        return;
    }
    node.textContent = message;
    node.className = `form-message ${kind}`;
}

function parseApiError(payload) {
    if (!payload || typeof payload !== "object") {
        return "Something went wrong.";
    }

    const entries = Object.entries(payload);
    if (!entries.length) {
        return "Something went wrong.";
    }

    return entries
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join(" | ");
}

async function postJson(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(parseApiError(payload));
    }

    return payload;
}

function renderAuthState() {
    const authState = document.getElementById("authState");
    const accountStatus = document.getElementById("accountStatus");
    if (!authState) {
        if (accountStatus) {
            const rawUser = localStorage.getItem(userKey);
            const user = rawUser ? JSON.parse(rawUser) : null;
            accountStatus.textContent = user?.username || "Not signed in";
        }
        return;
    }

    const token = localStorage.getItem(storageKey);
    const rawUser = localStorage.getItem(userKey);
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!token) {
        authState.innerHTML = "<p>No token saved in this browser yet.</p>";
        if (accountStatus) {
            accountStatus.textContent = "Not signed in";
        }
        return;
    }

    if (accountStatus) {
        accountStatus.textContent = `${user?.username || "Unknown"} (${user?.role || "user"})`;
    }

    authState.innerHTML = `
        <p><strong>Token:</strong> saved locally</p>
        <p><strong>User:</strong> ${user?.username || "Unknown user"}</p>
        <p><strong>Role:</strong> ${user?.role || "Unknown role"}</p>
    `;
}

async function handleRegister() {
    const form = document.getElementById("registerForm");
    if (!form) {
        return;
    }

    const message = document.getElementById("formMessage");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        try {
            await postJson("/register/", Object.fromEntries(formData.entries()));
            setMessage(message, "Account created. Redirecting to login...");
            window.setTimeout(() => {
                window.location.href = "/login/";
            }, 900);
        } catch (error) {
            setMessage(message, error.message, "error");
        }
    });
}

async function handleLogin() {
    const form = document.getElementById("loginForm");
    if (!form) {
        return;
    }

    const message = document.getElementById("formMessage");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);

        try {
            const payload = await postJson("/login/", Object.fromEntries(formData.entries()));
            localStorage.setItem(storageKey, payload.access);
            localStorage.setItem(userKey, JSON.stringify(payload.user || {}));

            setMessage(message, "Login successful. Redirecting to the orders page...");

            window.setTimeout(() => {
                window.location.href = "/orders/ui/";
            }, 800);
        } catch (error) {
            setMessage(message, error.message, "error");
        }
    });
}

function handleLogoutPage() {
    if (!window.location.pathname.startsWith("/logout/")) {
        return;
    }
    localStorage.removeItem(storageKey);
    localStorage.removeItem(userKey);
}

renderAuthState();
handleRegister();
handleLogin();
handleLogoutPage();
