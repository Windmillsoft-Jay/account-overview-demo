"use strict";

// ─── 카드 데이터 ──────────────────────────────────────────────────────
// 영상에 나온 값: KB국민카드 결제예정금액, 신한카드 카드 3장/이용대금/한도, 포인트 3곳.
// placeholder: true 인 항목은 영상에 안 나와서 임시로 넣은 값입니다. 실제 값으로 바꿔주세요.
const cardCompanies = [
  {
    id: "kbcard", name: "KB국민카드", mark: "KB", color: "#4e4236", textColor: "#f3c34f",
    points: 9,
    due: {
      unit: "KB카드",
      account: "국민은행 933502*****452",
      date: "2026-11-07",
      amount: 289751,
      overdue: 289751
    },
    recent: [0, 0, 0], limit: 0, shortLoanLimit: 0,
    cards: [{ name: "KB국민 체크카드", number: "0000-0000-****-000*", type: "본인/체크", note: "-", placeholder: true }]
  },
  {
    id: "shinhancard", name: "신한카드", mark: "S", color: "#2b45d8",
    points: 34,
    due: null,
    recent: [0, 0, 0], limit: 0, shortLoanLimit: 0,
    cards: [
      { name: "다드림 S-Choice 체크(선택형)", number: "4364-2007-****-031*", type: "본인/체크", note: "-" },
      { name: "국민내일배움 FANtastic S 체크신한은행즉발용", number: "5594-1000-****-126*", type: "본인/체크", note: "-" },
      { name: "모두의카드 체크", number: "5107-3751-****-104*", type: "본인/체크", note: "-" }
    ]
  }
];

const DUE_EMPTY_CODE = "6115";

// ─── DOM ──────────────────────────────────────────────────────────────
const cardNoticeView = $("#card-notice-view");
const cardsView = $("#cards-view");
const cardsScroll = $("#cards-scroll");
const cardsContent = $("#cards-content");
const cardDetailView = $("#card-detail-view");
const cardDetailTrack = $("#card-detail-track");
const consentView = $("#consent-view");
const consentEmail = $("#consent-email");
const consentConfirm = $("#consent-confirm");

const cardsState = { tab: "cards", company: null, detailTab: "due" };
const DETAIL_TABS = ["due", "recent", "info"];

// ─── 진입 ─────────────────────────────────────────────────────────────
function openCards() {
  if (nav.top === "cards" && !nav.stack.length) {
    cardsScroll.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (isNoticeSnoozed("cards")) {
    enterCards();
    return;
  }
  $("#card-notice-check").checked = false;
  $("#card-notice-scroll").scrollTop = 0;
  pushSub("cardNotice");
}

function enterCards() {
  setTop("cards");
  loadCardsTab("cards", { force: true });
}

// ─── 목록 화면 (카드 / 포인트) ────────────────────────────────────────
function setCardTabSelection(tab) {
  document.querySelectorAll("#cards-tabs [data-card-tab]").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.cardTab === tab ? "true" : "false");
  });
}

function loadCardsTab(tab, { force = false } = {}) {
  if (!force && tab === cardsState.tab) return;
  cardsState.tab = tab;
  setCardTabSelection(tab);
  renderCardsTab(tab, { loading: true });
  cardsScroll.scrollTop = 0;
  showLookup(() => renderCardsTab(tab));
}

function renderCardsTab(tab, { loading = false } = {}) {
  cardsContent.innerHTML = tab === "points" ? pointsTemplate(loading) : cardListTemplate(loading);
}

function cardListTemplate(loading) {
  const companyCount = loading ? 0 : cardCompanies.length;
  const cardCount = loading ? 0 : cardCompanies.reduce((sum, c) => sum + c.cards.length, 0);
  const rows = loading ? "" : cardCompanies.map((company) => `
    <button type="button" class="card-company-row" data-card-company="${company.id}" aria-label="${company.name}, 카드 ${company.cards.length}건">
      <svg class="favorite-star" aria-hidden="true" viewBox="0 0 24 24"><path d="m12 2.7 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.4 6.3-.9z"/></svg>
      ${logoTemplate(company)}
      <span class="institution-name">${company.name}</span>
      <span class="row-count${countClass(company.cards.length)}">${company.cards.length} 건</span>
      <span class="chevron" aria-hidden="true">›</span>
    </button>`).join("");

  return `
    <section class="lookup-summary">
      <div class="lookup-summary-top">
        <span class="lookup-caption">서비스 가능 카드사 <span class="info-dot" aria-hidden="true">i</span></span>
        <span class="lookup-date-text">조회기준일 : ${loading ? "0000-00-00" : TODAY_ISO}</span>
      </div>
      <div class="lookup-summary-main">
        <strong class="lookup-counts">카드사 <em>${companyCount}</em> , 카드 <em>${cardCount}</em></strong>
        <button type="button" class="link-action inert-control">휴면카드 관리 <span aria-hidden="true">›</span></button>
      </div>
      <button type="button" class="outline-wide inert-control">분실카드 한 번에 신고 <span aria-hidden="true">›</span></button>
    </section>
    <div class="card-company-list">${rows}</div>
    <div class="nav-space" aria-hidden="true"></div>`;
}

function pointsTemplate(loading) {
  const withPoints = loading ? [] : cardCompanies.filter((c) => c.points !== null);
  const total = withPoints.reduce((sum, c) => sum + c.points, 0);
  const rows = withPoints.map((company) => `
    <button type="button" class="point-row" data-point-company="${company.id}" aria-label="${company.name}, ${formatPoint(company.points)}">
      ${logoTemplate(company)}
      <span class="institution-name">${company.name}</span>
      <span class="point-value"><em>${company.points.toLocaleString("ko-KR")}</em> P</span>
      <span class="chevron" aria-hidden="true">›</span>
    </button>`).join("");

  return `
    <section class="lookup-summary is-points">
      <div class="lookup-summary-top">
        <span class="lookup-caption">조회 가능 카드사 <span class="info-dot" aria-hidden="true">i</span></span>
        <span class="lookup-date-text">조회기준일 : ${loading ? "0000-00-00" : TODAY_ISO}</span>
      </div>
      <strong class="lookup-counts">카드사 <em>${withPoints.length}</em></strong>
      <div class="point-total">
        <span><span class="info-dot is-outline" aria-hidden="true">!</span> 총 보유 포인트</span>
        <strong>${formatPoint(total)}</strong>
      </div>
    </section>
    <div class="point-list">${rows}</div>
    <ul class="feature-notes">
      <li>각 카드사에서 직접 관리하는 포인트만 조회됩니다.</li>
      <li>잔여 포인트와 2개월 후 소멸 예정인 포인트를 조회할 수 있습니다.</li>
    </ul>
    <div class="nav-space" aria-hidden="true"></div>`;
}

// ─── 카드 조회 (상세) ─────────────────────────────────────────────────
function recentMonths() {
  return [0, 1, 2].map((offset) => {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - offset, 1);
    return { short: `${d.getMonth() + 1}월`, long: `${d.getFullYear()}년 ${pad2(d.getMonth() + 1)}월` };
  });
}

function lookupPill() {
  return `<span class="lookup-pill">조회기준일 : ${TODAY_ISO}</span>`;
}

function dueTemplate(company) {
  const due = company.due;
  if (!due) {
    return emptyStateTemplate(
      `차기월 결제예정금액이 없습니다. (${DUE_EMPTY_CODE})`,
      "이번달 결제예정금액은 최근이용대금 메뉴에서 확인할 수 있어요."
    );
  }
  return `
    <section class="amount-card">
      <div class="amount-card-top"><span>총 결제예정금액</span>${lookupPill()}</div>
      <strong class="amount-card-value">${formatWon(due.amount)}</strong>
    </section>
    <section class="soft-box due-box">
      <dl class="kv-rows">
        <div><dt>결제단위</dt><dd>${due.unit}</dd></div>
        <div><dt>결제계좌</dt><dd>${due.account}</dd></div>
        <div><dt>결제일</dt><dd>${due.date}</dd></div>
      </dl>
      <strong class="due-amount">${formatWon(due.amount)}</strong>
      <span class="due-overdue">(연체금액 ${due.overdue.toLocaleString("ko-KR")}원 별도)</span>
    </section>
    <ul class="feature-notes">
      <li>연체금액이란 연체원금, 이자, 수수료 등이 모두 포함된 금액이며, 결제일 기준으로 산출된 금액입니다.</li>
      <li>결제단위란 해당 카드사가 카드대금 결제(청구)시 식별하기 위해 부여한 단위입니다.</li>
    </ul>
    <button type="button" class="guide-link inert-control">안내사항 <span aria-hidden="true">›</span></button>`;
}

function recentTemplate(company) {
  const months = recentMonths();
  const total = company.recent.reduce((sum, v) => sum + v, 0);
  const average = Math.round(total / company.recent.length);
  return `
    <section class="amount-card">
      <div class="amount-card-top"><span>최근 3개월 이용대금</span>${lookupPill()}</div>
      <strong class="amount-card-value">${formatWon(total)}</strong>
      <dl class="amount-card-rows">
        ${months.map((m, i) => `<div><dt>${m.short}</dt><dd>${formatWon(company.recent[i])}</dd></div>`).join("")}
        <div class="is-average"><dt>평균</dt><dd>${formatWon(average)}</dd></div>
      </dl>
    </section>
    <div class="month-list">
      ${months.map((m, i) => `
        <button type="button" class="soft-box month-item inert-control">
          <span>${m.long}</span>
          <strong>${formatWon(company.recent[i])} <span aria-hidden="true">›</span></strong>
        </button>`).join("")}
    </div>
    <button type="button" class="guide-link inert-control">안내사항 <span aria-hidden="true">›</span></button>`;
}

function infoTemplate(company) {
  return `
    <section class="amount-card">
      <div class="amount-card-top"><span>총 이용한도</span>${lookupPill()}</div>
      <strong class="amount-card-value">${formatWon(company.limit)}</strong>
      <span class="amount-card-sub">(단기 카드대출 한도 ${company.shortLoanLimit.toLocaleString("ko-KR")}원 포함)</span>
    </section>
    <div class="info-link-row">
      <button type="button" class="text-link" data-goto-points>카드 포인트 조회 <span aria-hidden="true">›</span></button>
    </div>
    <div class="owned-card-list">
      ${company.cards.map((card) => `
        <article class="soft-box owned-card">
          <p class="owned-card-name">${card.name}</p>
          <p class="owned-card-number">${card.number} (${card.type})</p>
          <div class="owned-card-note"><span>비고</span><span>${card.note}</span></div>
        </article>`).join("")}
    </div>
    <ul class="feature-notes">
      <li>이용한도는 회원별로 부여된 신용구매와 단기카드대출(현금서비스)의 한도의 합계로, 잔여한도가 아닙니다.</li>
      <li>휴면이란, 해당카드의 최종이용일로부터 1년 이상 이용실적이 없는 카드를 말합니다.</li>
    </ul>`;
}

function renderCardDetail(company) {
  $("#card-detail-company").innerHTML = `${logoTemplate(company, "logo-sm")}<span>${company.name}</span>`;
  const panels = cardDetailTrack.querySelectorAll("[data-panel]");
  panels[0].innerHTML = dueTemplate(company);
  panels[1].innerHTML = recentTemplate(company);
  panels[2].innerHTML = infoTemplate(company);
  panels.forEach((panel) => { panel.scrollTop = 0; });
}

function setDetailTab(tab, { animate = true } = {}) {
  const index = DETAIL_TABS.indexOf(tab);
  if (index < 0) return;
  cardsState.detailTab = tab;
  cardDetailTrack.classList.toggle("no-anim", !animate);
  cardDetailTrack.style.transform = `translateX(-${index * 100 / DETAIL_TABS.length}%)`;
  document.querySelectorAll("#card-detail-tabs [data-detail-tab]").forEach((btn) => {
    btn.setAttribute("aria-selected", btn.dataset.detailTab === tab ? "true" : "false");
  });
  const panel = cardDetailTrack.querySelectorAll("[data-panel]")[index];
  panel.classList.remove("replay");
  void panel.offsetWidth;
  panel.classList.add("replay");
}

function openCardDetail(id) {
  const company = cardCompanies.find((c) => c.id === id);
  if (!company) return;
  cardsState.company = company;
  renderCardDetail(company);
  setDetailTab("due", { animate: false });
  pushSub("cardDetail");
  showLookup(null, 560);
}

// ─── 포인트 현금화 위임동의 ───────────────────────────────────────────
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function openConsent() {
  $("#proxy-name").textContent = PROFILE.name;
  $("#proxy-phone").textContent = PROFILE.phone;
  $("#proxy-birth").textContent = PROFILE.birth;
  $("#proxy-sign").textContent = `${koreanDate(TODAY)}`;
  $("#proxy-signer").textContent = PROFILE.name;
  consentEmail.value = "";
  updateConsentButton();
  $("#consent-scroll").scrollTop = 0;
  pushSub("consent");
}

function updateConsentButton() {
  consentConfirm.disabled = !EMAIL_PATTERN.test(consentEmail.value.trim());
}

// ─── 등록 / 이벤트 ────────────────────────────────────────────────────
registerSub("cardNotice", cardNoticeView);
registerTop("cards", cardsView);
registerSub("cardDetail", cardDetailView, {
  onClose() { cardsState.company = null; }
});
registerSub("consent", consentView, {
  onClose() { consentEmail.blur(); }
});

homeActions.cards = () => openCards();
homeActions.points = () => openConsent();

$("#card-notice-confirm").addEventListener("click", () => {
  if ($("#card-notice-check").checked) snoozeNotice("cards");
  enterCards();
});

$("#cards-tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-card-tab]");
  if (!btn) return;
  const tab = btn.dataset.cardTab;
  if (tab === "cash") openConsent();
  else loadCardsTab(tab);
});

cardsContent.addEventListener("click", (event) => {
  const row = event.target.closest("[data-card-company]");
  if (row) { openCardDetail(row.dataset.cardCompany); return; }
  if (event.target.closest("[data-point-company]")) showToast("데모에서는 지원하지 않는 기능입니다.");
});

$("#card-detail-tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-detail-tab]");
  if (btn) setDetailTab(btn.dataset.detailTab);
});

cardDetailTrack.addEventListener("click", (event) => {
  if (!event.target.closest("[data-goto-points]")) return;
  popSub();
  loadCardsTab("points");
});

// 상세 탭 좌우 스와이프
(() => {
  let startX = 0;
  let startY = 0;
  const pager = $("#card-detail-pager");
  pager.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });
  pager.addEventListener("touchend", (event) => {
    const dx = event.changedTouches[0].clientX - startX;
    const dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const index = DETAIL_TABS.indexOf(cardsState.detailTab) + (dx < 0 ? 1 : -1);
    if (DETAIL_TABS[index]) setDetailTab(DETAIL_TABS[index]);
  }, { passive: true });
})();

consentEmail.addEventListener("input", updateConsentButton);
consentConfirm.addEventListener("click", () => {
  if (consentConfirm.disabled) return;
  showToast("데모에서는 지원하지 않는 기능입니다.");
});
