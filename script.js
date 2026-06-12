document.addEventListener("DOMContentLoaded", () => {
  const state = {
    premiumOpen: false,
  };

  // =========================
  // Utilidades generales
  // =========================
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const formatNumber = (value, decimals = 2) => {
    if (!Number.isFinite(value)) return "—";
    const rounded = Math.abs(value) < 1000 ? value.toFixed(decimals) : value.toFixed(0);
    return rounded.replace(/\.00$/, "");
  };

  const setText = (selector, text) => {
    const el = $(selector);
    if (el) el.textContent = text;
  };

  // =========================
  // Navegación suave
  // =========================
  $$('[data-scroll]').forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-scroll");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // =========================
  // Modal Premium
  // =========================
  const premiumModal = $("#premiumModal");
  const openPremiumButtons = $$('[data-open-premium]');
  const closePremiumButtons = $$('[data-close-premium]');

  const openPremiumModal = () => {
    if (!premiumModal) return;
    premiumModal.classList.add("is-open");
    premiumModal.setAttribute("aria-hidden", "false");
    state.premiumOpen = true;
  };

  const closePremiumModal = () => {
    if (!premiumModal) return;
    premiumModal.classList.remove("is-open");
    premiumModal.setAttribute("aria-hidden", "true");
    state.premiumOpen = false;
  };

  openPremiumButtons.forEach((btn) => btn.addEventListener("click", openPremiumModal));
  closePremiumButtons.forEach((btn) => btn.addEventListener("click", closePremiumModal));

  if (premiumModal) {
    premiumModal.addEventListener("click", (event) => {
      if (event.target === premiumModal) closePremiumModal();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.premiumOpen) {
      closePremiumModal();
    }
  });

  // =========================
  // Calculadora física
  // Segunda Ley de Newton: F = m × a
  // =========================
  const massInput = $("#massInput");
  const accelerationInput = $("#accelerationInput");
  const calculateButton = $("#calculateForceBtn");
  const resultOutput = $("#forceResult");
  const formulaOutput = $("#forceFormula");
  const stepsContainer = $("#forceSteps");
  const premiumHint = $("#premiumHint");

  const renderForceSteps = (mass, acceleration, force) => {
    if (!stepsContainer) return;

    const steps = [
      "F = m × a",
      `F = ${formatNumber(mass, 2)} × ${formatNumber(acceleration, 2)}`,
      `F = ${formatNumber(force, 2)} N`,
    ];

    stepsContainer.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");
  };

  const calculateForce = () => {
    const mass = Number(massInput?.value);
    const acceleration = Number(accelerationInput?.value);

    if (!Number.isFinite(mass) || !Number.isFinite(acceleration)) {
      setText("#forceResult", "Ingresa valores válidos");
      setText("#forceFormula", "F = m × a");
      if (stepsContainer) stepsContainer.innerHTML = "";
      return;
    }

    const force = mass * acceleration;
    setText("#forceResult", `${formatNumber(force, 2)} N`);
    setText("#forceFormula", `F = ${formatNumber(mass, 2)} × ${formatNumber(acceleration, 2)}`);
    renderForceSteps(mass, acceleration, force);

    if (premiumHint) {
      premiumHint.classList.remove("hidden");
    }
  };

  calculateButton?.addEventListener("click", calculateForce);

  [massInput, accelerationInput].forEach((input) => {
    input?.addEventListener("input", () => {
      const mass = Number(massInput?.value);
      const acceleration = Number(accelerationInput?.value);
      if (!Number.isFinite(mass) || !Number.isFinite(acceleration)) return;
      const force = mass * acceleration;
      setText("#forceResult", `${formatNumber(force, 2)} N`);
      setText("#forceFormula", `F = ${formatNumber(mass, 2)} × ${formatNumber(acceleration, 2)}`);
      renderForceSteps(mass, acceleration, force);
    });
  });

  // =========================
  // Tarjetas de planes
  // =========================
  $$('[data-plan]').forEach((card) => {
    card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
    card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"));
  });

  // =========================
  // Animación simple de contadores
  // =========================
  const counterEls = $$('[data-counter]');

  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-counter"));
    if (!Number.isFinite(target)) return;

    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(startValue + (target - startValue) * progress);
      el.textContent = current.toLocaleString("es-MX");
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counterEls.forEach((el) => counterObserver.observe(el));

  // =========================
  // Gráfica simple opcional con Chart.js
  // Se deja preparada para usar cuando exista el canvas.
  // =========================
  const chartCanvas = document.getElementById("performanceChart");
  if (chartCanvas && window.Chart) {
    new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        datasets: [
          {
            label: "Usuarios",
            data: [1200, 1800, 2500, 3100, 4200, 5324],
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // =========================
  // Simulación visual de login
  // =========================
  const loginForm = $("#loginForm");
  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#loginEmail")?.value?.trim();
    const password = $("#loginPassword")?.value?.trim();

    if (!email || !password) {
      setText("#loginMessage", "Completa correo y contraseña.");
      return;
    }

    setText("#loginMessage", "Acceso de demostración aprobado.");
    const dashboard = $("#dashboard");
    if (dashboard) {
      dashboard.classList.remove("hidden");
      dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // =========================
  // Botón de reinicio demo
  // =========================
  const resetButton = $("#resetDemoBtn");
  resetButton?.addEventListener("click", () => {
    if (massInput) massInput.value = "2";
    if (accelerationInput) accelerationInput.value = "9.8";
    setText("#forceResult", "19.60 N");
    setText("#forceFormula", "F = 2.00 × 9.80");
    renderForceSteps(2, 9.8, 19.6);
    closePremiumModal();
  });

  // Estado inicial de la calculadora
  if (massInput && accelerationInput) {
    calculateForce();
  }

  // Mostrar mensaje inicial de Premium bloqueado
  if (premiumHint) {
    premiumHint.classList.add("hidden");
  }
});
