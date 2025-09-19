// Simple wrapper for registering service worker

export function register(config) {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log("ServiceWorker registered: ", registration);

                    // 🔹 If there's an updated service worker
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;
                        if (installingWorker) {
                            installingWorker.onstatechange = () => {
                                if (
                                    installingWorker.state === "installed" &&
                                    navigator.serviceWorker.controller
                                ) {
                                    console.log("New content available; reloading...");
                                    window.location.reload(); // ✅ auto refresh when update detected
                                }
                            };
                        }
                    };
                })
                .catch((error) => {
                    console.error("ServiceWorker registration failed:", error);
                });
        });
    }
}

export function unregister() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}