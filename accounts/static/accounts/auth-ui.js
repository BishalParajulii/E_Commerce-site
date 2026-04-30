(function() {
    // Explicitly check for both storage keys just in case
    const storageKey = "orders-ui-token";
    const userKey = "orders-ui-user";

    console.log("Auth-UI: Script loaded. storageKey:", storageKey);

    function setMessage(node, message, kind = "success") {
        if (!node) return;
        node.textContent = message;
        node.className = `form-message ${kind}`;
    }

    function parseApiError(payload) {
        if (!payload || typeof payload !== "object") return "Something went wrong.";
        const entries = Object.entries(payload);
        if (!entries.length) return "Something went wrong.";
        return entries
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ");
    }

    async function postJson(url, body) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(parseApiError(payload));
        return payload;
    }

    function renderAuthState() {
        const token = localStorage.getItem(storageKey);
        const rawUser = localStorage.getItem(userKey);
        const user = rawUser ? JSON.parse(rawUser) : null;

        console.log("Auth-UI: Rendering auth state. Token found:", !!token);
        if (token) {
            console.log("Auth-UI: Token value (truncated):", token.substring(0, 10) + "...");
        }

        const authState = document.getElementById("authState");
        const accountStatus = document.getElementById("accountStatus");
        
        // Target all possible auth link containers
        const authContainers = [
            document.getElementById("header-auth"),
            document.getElementById("utility-auth"),
            document.getElementById("mobile-header-auth")
        ];

        authContainers.forEach(el => {
            if (!el) return;
            console.log("Auth-UI: Updating container:", el.id);
            if (token) {
                el.innerHTML = '<a href="/logout/" class="auth-link logout-link">Logout</a>';
            } else {
                el.innerHTML = '<a href="/login/" class="auth-link login-link">Sign in</a>';
            }
        });

        if (accountStatus) {
            accountStatus.textContent = token ? (user?.username || "Signed in") : "Not signed in";
        }

        if (authState) {
            if (!token) {
                authState.innerHTML = "<p>No token saved in this browser yet.</p>";
            } else {
                authState.innerHTML = `
                    <p><strong>Token:</strong> Active</p>
                    <p><strong>User:</strong> ${user?.username || "Unknown"}</p>
                    <p><strong>Role:</strong> ${user?.role || "User"}</p>
                `;
            }
        }
    }

    function handleRegister() {
        const form = document.getElementById("registerForm");
        if (!form) return;

        const message = document.getElementById("formMessage");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            try {
                await postJson("/signup/", Object.fromEntries(formData.entries()));
                setMessage(message, "Account created. Redirecting to login...");
                setTimeout(() => window.location.href = "/login/", 900);
            } catch (error) {
                setMessage(message, error.message, "error");
            }
        });
    }

    function handleLogin() {
        const form = document.getElementById("loginForm");
        if (!form) return;

        const message = document.getElementById("formMessage");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            try {
                console.log("Auth-UI: Attempting login...");
                const payload = await postJson("/login/", Object.fromEntries(formData.entries()));
                console.log("Auth-UI: Login success. Saving token.");
                localStorage.setItem(storageKey, payload.access);
                localStorage.setItem(userKey, JSON.stringify(payload.user || {}));
                setMessage(message, "Login successful. Redirecting...");
                setTimeout(() => window.location.href = "/products/ui/", 800);
            } catch (error) {
                console.error("Auth-UI: Login error:", error);
                setMessage(message, error.message, "error");
            }
        });
    }

    function handleLogoutPage() {
        if (window.location.pathname.startsWith("/logout/")) {
            console.log("Auth-UI: Logout page detected. Clearing storage.");
            localStorage.removeItem(storageKey);
            localStorage.removeItem(userKey);
        }
    }

    const init = () => {
        console.log("Auth-UI: Initializing...");
        handleLogoutPage();
        renderAuthState();
        handleRegister();
        handleLogin();
    };

    // Ensure we run at least once
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
    
    // Also run on a short delay to override any other scripts that might interfere
    setTimeout(renderAuthState, 500);
})();
