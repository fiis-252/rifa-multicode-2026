import { apiClient } from "./api.js";

const COHORT_META = {
  "25-2": {
    label: "Codigo 25-2",
    color: "#fbbf24",
    avatar: "assets/imgs/logo/logo_252.jpeg",
  },
  "26-1": {
    label: "Codigo 26-1",
    color: "#e51a2e",
    avatar: "assets/imgs/logo/logo_261.jpeg",
  },
  "26-2": {
    label: "Codigo 26-2",
    color: "#8b5cf6",
    avatar: "assets/imgs/logo/logo_262.jpeg",
  },
};

async function loadStats() {
  const totalTicketsEl = document.getElementById("total-tickets");
  const totalRevenueEl = document.getElementById("total-revenue");
  const soldSubTxt = document.getElementById("amt-tks-sold-txt");
  const cohortContainer = document.getElementById("cohort-bars-container");
  const vendorList = document.getElementById("top-vendors-list");

  try {
    const data = await apiClient.tickets.getStats();

    if (!data) return;

    const total = data.total || 0;
    if (totalTicketsEl) totalTicketsEl.innerText = total;
    if (soldSubTxt) {
      soldSubTxt.innerText = `${total} ticket${total === 1 ? "" : "s"} emitido${total === 1 ? "" : "s"}`;
    }

    const revenue =
      data.revenue ||
      (data.totalRevenue
        ? `S/ ${data.totalRevenue}.00`
        : `~ S/ ${total * 4}.00`);
    if (totalRevenueEl) totalRevenueEl.innerText = revenue;

    if (cohortContainer && data.codes) {
      cohortContainer.innerHTML = "";
      const cohorts = ["25-2", "26-1", "26-2"];

      const codeScores = cohorts
        .map((code) => ({
          code,
          count: data.codes[code] || 0,
          meta: COHORT_META[code] || {
            label: `Codigo ${code}`,
            color: "var(--color-blue)",
            avatar: "🎟️",
          },
        }))
        .sort((a, b) => b.count - a.count);

      const maxCount = Math.max(...codeScores.map((c) => c.count), 1);

      codeScores.forEach((item, index) => {
        const percent = Math.round((item.count / maxCount) * 100);
        const card = document.createElement("div");
        card.className = "cohort-bar-row";
        card.innerHTML = `
          <div class="cohort-bar-info">
            <span class="cohort-rank">#${index + 1}</span>
            <img class="cohort-avatar-mini" style="border: 1px solid ${item.meta.color}" src="${item.meta.avatar}"></img>
            <strong class="cohort-title-txt">${item.meta.label}</strong>
            <span class="cohort-score-badge">${item.count} tickets</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${percent}%; background: ${item.meta.color};"></div>
          </div>
        `;
        cohortContainer.appendChild(card);
      });
    }

    if (vendorList && data.topVendors) {
      vendorList.innerHTML = "";
      const top = data.topVendors.filter((v) => v.sold > 0).slice(0, 10);

      if (top.length === 0) {
        vendorList.innerHTML = `<li style="text-align: center; color: var(--text-dim); padding: 1.5rem;">Aun no hay ventas registradas.</li>`;
        return;
      }

      top.forEach((v, idx) => {
        let badge = `<span class="rank-pos">${idx + 1}</span>`;
        if (idx === 0) badge = "🥇";
        if (idx === 1) badge = "🥈";
        if (idx === 2) badge = "🥉";

        const li = document.createElement("li");
        li.className = "vendor-item";
        li.innerHTML = `
          <div class="vendor-left">
            <span class="vendor-medal">${badge}</span>
            <div class="vendor-identity">
              <strong>${v.name || v.identifier}</strong>
              <small class="vendor-code-tag">${v.code || "FIIS"}</small>
            </div>
          </div>
          <span class="vendor-sold-count">${v.sold} tickets</span>
        `;
        vendorList.appendChild(li);
      });
    }
  } catch (err) {
    console.error(err);
    if (cohortContainer)
      cohortContainer.innerHTML = `<p class="table-error">No se pudieron cargar los datos de las bases.</p>`;
    if (vendorList)
      vendorList.innerHTML = `<li class="table-error">Error al conectar con la tabla de posiciones.</li>`;
  }
}

document.addEventListener("DOMContentLoaded", loadStats);
