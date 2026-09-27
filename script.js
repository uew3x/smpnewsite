const SERVER_IP = "nexora.joinserver.fun";

let toastTimer;

function copyIP() {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(SERVER_IP)
            .then(() => showToast("IP сервера скопировано"))
            .catch(() => fallbackCopy());
    } else {
        fallbackCopy();
    }
}

function fallbackCopy() {
    const input = document.createElement("textarea");

    input.value = SERVER_IP;
    input.style.position = "fixed";
    input.style.opacity = "0";

    document.body.appendChild(input);

    input.focus();
    input.select();

    try {
        document.execCommand("copy");
        showToast("IP сервера скопировано");
    } catch {
        showToast(`IP: ${SERVER_IP}`);
    }

    input.remove();
}

function showToast(text) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    clearTimeout(toastTimer);

    toast.textContent = text;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuButton = document.getElementById("menuButton");

    if (!navLinks || !menuButton) return;

    const isOpen = navLinks.classList.toggle("open");

    menuButton.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));

    document.body.classList.toggle("menu-open", isOpen);
}

function closeMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuButton = document.getElementById("menuButton");

    if (!navLinks || !menuButton) return;

    navLinks.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
}

function initTypewriter() {
    const container = document.getElementById("typewriterText");
    if (!container) return;

    const fullText = [
        { text: "Nexora", isPurple: false },
        { text: "Smp", isPurple: true }
    ];

    let currentPart = 0;
    let currentChar = 0;

    const mainSpan = document.createElement("span");
    const purpleSpan = document.createElement("span");
    purpleSpan.className = "purple";
    container.appendChild(mainSpan);
    container.appendChild(purpleSpan);

    function type() {
        if (currentPart < fullText.length) {
            const part = fullText[currentPart];
            if (currentChar < part.text.length) {
                const targetSpan = part.isPurple ? purpleSpan : mainSpan;
                targetSpan.textContent += part.text.charAt(currentChar);
                currentChar++;
                setTimeout(type, 110);
            } else {
                currentPart++;
                currentChar = 0;
                setTimeout(type, 150);
            }
        }
    }

    setTimeout(type, 300);
}

function initScrollAnimations() {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => observer.observe(el));
}

/* 3D TILT EFFECT FOR CARDS */
function initTiltEffect() {
    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });
    });
}

/* PARALLAX EFFECT ON SCROLL */
function initParallax() {
    const heroGrid = document.querySelector(".hero-grid");
    const heroGlow1 = document.querySelector(".hero-glow-one");
    const heroGlow2 = document.querySelector(".hero-glow-two");
    const decoration = document.querySelector(".hero-decoration");
    const header = document.querySelector(".site-header");

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;

        if (header) {
            header.classList.toggle("scrolled", scrolled > 50);
        }

        if (scrolled < 1000) {
            if (heroGrid) heroGrid.style.transform = `translateY(${scrolled * 0.25}px)`;
            if (heroGlow1) heroGlow1.style.transform = `translateY(${scrolled * 0.15}px)`;
            if (heroGlow2) heroGlow2.style.transform = `translateY(${scrolled * 0.1}px)`;
            if (decoration) decoration.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
        }
    });
}

/* CURSOR FOLLOWER & SPARKLES TRAIL EFFECT */
function initCustomCursor() {
    const cursorDot = document.getElementById("cursorDot");
    const cursorGlow = document.getElementById("cursorGlow");

    if (!cursorDot || !cursorGlow) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let glowX = 0, glowY = 0;
    let lastSparkleTime = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Создаем искры за курсором
        const now = Date.now();
        if (now - lastSparkleTime > 45) {
            createSparkle(e.clientX, e.clientY);
            lastSparkleTime = now;
        }
    });

    function animateCursor() {
        // Плавное следование за курсором (Lerp)
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;

        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Реакция курсора на элементы
    const interactables = document.querySelectorAll("a, button, .interactive-element, .tilt-card");

    interactables.forEach(item => {
        item.addEventListener("mouseenter", () => {
            document.body.classList.add("hovered-element");
        });
        item.addEventListener("mouseleave", () => {
            document.body.classList.remove("hovered-element");
        });
    });
}

function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle-particle";

    const size = Math.random() * 4 + 2;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 40;
    const dy = (Math.random() - 0.5) * 40;

    sparkle.style.setProperty("--dx", `${dx}px`);
    sparkle.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 700);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll(".nav-links a");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                links.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    sections.forEach(section => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");

    menuButton?.addEventListener("click", toggleMenu);

    navLinks?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", event => {
        if (!navLinks || !menuButton) return;

        if (
            navLinks.classList.contains("open") &&
            !navLinks.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMenu();
        }
    });

    updateActiveNavigation();
    initTypewriter();
    initScrollAnimations();
    initTiltEffect();
    initParallax();
    initCustomCursor();
});

const onlineCount = document.getElementById("onlineCount");

if (onlineCount) {
    onlineCount.textContent = "20";
}