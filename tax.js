"use strict";

// ─── 세금/공과금 메뉴 ─────────────────────────────────────────────────
const TAX_ICONS = {
  local: `<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="2" y="7" width="24" height="15" rx="3" fill="#1fae5b"/><rect x="2" y="7" width="24" height="5" rx="2" fill="#17924b"/><text x="14" y="19.5" text-anchor="middle" font-size="7" font-weight="800" fill="#fff" font-family="Arial,sans-serif">TAX</text></svg>`,
  national: `<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="5" width="15" height="19" rx="2.5" fill="#2f62d8"/><rect x="6" y="9" width="9" height="2" rx="1" fill="#fff" opacity=".85"/><rect x="6" y="13" width="9" height="2" rx="1" fill="#fff" opacity=".85"/><rect x="6" y="17" width="6" height="2" rx="1" fill="#fff" opacity=".7"/><circle cx="20.5" cy="19.5" r="5.5" fill="#f5b731"/><text x="20.5" y="22.3" text-anchor="middle" font-size="7.5" font-weight="800" fill="#fff" font-family="Arial,sans-serif">₩</text></svg>`,
  insurance: `<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="2" y="7" width="24" height="15" rx="3" fill="#f08a24"/><rect x="2" y="7" width="24" height="5" rx="2" fill="#d97614"/><text x="14" y="19.5" text-anchor="middle" font-size="7" font-weight="800" fill="#fff" font-family="Arial,sans-serif">4대</text></svg>`,
  utility: `<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="6" width="22" height="16" rx="4" fill="#22a99a"/><path d="M8 14h3l2-4 3 8 2-4h3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const taxSections = [
  { icon: "local", title: "지방세입", items: ["지방세", "환경개선 부담금", "상하수도 요금", "세외수입"] },
  { icon: "national", title: "국고금", items: ["국세", "관세(통고처분)", "경찰청범칙금", "법무부 국고금", "특허수수료", "기금 및 기타국고"] },
  { icon: "insurance", title: "4대 사회보험료", items: ["통합징수(건강/연금/고용/산재)", "국민연금(반납금/추납보험료)", "고용(연납/분기납)", "산재(연납/분기납)"] },
  { icon: "utility", title: "일반 공과금", items: ["전기요금", "일반지로요금", "TV수신료"] }
];

function renderTax() {
  $("#tax-content").innerHTML = taxSections.map((section) => `
    <section class="tax-section">
      <h2 class="tax-section-title"><span class="tax-icon">${TAX_ICONS[section.icon]}</span>${section.title}</h2>
      <ul class="tax-items">
        ${section.items.map((item) => `
          <li><button type="button" class="tax-item inert-control">${item}<span class="chevron" aria-hidden="true">›</span></button></li>
        `).join("")}
      </ul>
    </section>`).join("");
}

registerTop("tax", $("#tax-view"), {
  onEnter() { $("#tax-scroll").scrollTop = 0; }
});
homeActions.tax = () => setTop("tax");
renderTax();
