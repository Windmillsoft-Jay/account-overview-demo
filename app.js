"use strict";

// ─── 개인 정보 (위임장 등에 표시) ─────────────────────────────────────
// 화면에 그대로 노출되는 값입니다. 데모를 다른 사람에게 보여줄 땐 여기만 바꾸면 됩니다.
const PROFILE = {
  name: "채주병",
  phone: "010-3176-7219",
  birth: "951214"
};

const groups = {
  bank: {
    summaryPrefix: "",
    note: "",
    institutions: [
      { id: "hana", name: "하나은행", mark: "하나", color: "#42b9a8", accounts: [
        { product: "급여 하나 통장", number: "24591009*****7", balance: 0, canClose: false }
      ]},
      { id: "nh", name: "NH농협은행", mark: "NH", color: "#4f91dc", accounts: [
        { product: "NH주거래우대통장(비대면)", number: "3021772*****1", balance: 1098, canClose: true }
      ]},
      { id: "kb", name: "국민은행", mark: "KB", color: "#a69161", accounts: [
        { product: "KB Wise통장", number: "05100104*****1", balance: 1, canClose: true },
        { product: "KB나라사랑우대통장", number: "93350200*****2", balance: 0, canClose: false },
        { product: "KB청년도약계좌", number: "0025300*****9", balance: 901000, canClose: false }
      ]},
      { id: "im", name: "iM뱅크(구 대구은행)", mark: "iM", color: "#18cbb7", accounts: [
        { product: "저축예금(iM스마트통장)", number: "508149*****0", balance: 0, canClose: true }
      ]},
      { id: "shinhan", name: "신한은행", mark: "S", color: "#665bee", accounts: [
        { product: "신한 주거래 우대통장(저축예금)", number: "110545*****8", balance: 0, canClose: false },
        { product: "저축예금", number: "110639*****3", balance: 16248, canClose: false },
        { product: "마이홈플랜 주택청약종합저축", number: "2230189*****3", balance: 33240000, canClose: false }
      ]},
      { id: "citi", name: "씨티은행", mark: "CITI", color: "#6f5bb8", wide: true, accounts: [
        { product: "씨티원예금", number: "2011849*****1", balance: 1, canClose: true }
      ]},
      { id: "woori", name: "우리은행", mark: "W", color: "#59b7df", accounts: [
        { product: "우리SUPER주거래통장", number: "1002564*****3", balance: 0, canClose: true },
        { product: "우리 주거래우대 저축예금", number: "1002448*****7", balance: 0, canClose: true },
        { product: "저축예금", number: "1002119*****4", balance: 0, canClose: true }
      ]},
      { id: "kbank", name: "케이뱅크", mark: "K", color: "#8977e6", accounts: [
        { product: "플러스박스", number: "100513*****6", balance: 0, canClose: false },
        { product: "MY 입출금통장", number: "100214*****7", balance: 31164, canClose: false }
      ]},
      { id: "kakao", name: "카카오뱅크", mark: "K", color: "#ffd84b", textColor: "#4b4535", accounts: [
        { product: "카카오뱅크 입출금통장", number: "3333196*****0", balance: 0, canClose: true }
      ]}
    ]
  },
  secondary: {
    summaryPrefix: "",
    note: "",
    institutions: [
      { id: "savings", name: "저축은행중앙회", mark: "SB", color: "#4abb70", accounts: [
        { product: "사이다입출금통장", number: "02819133*****7", balance: 301, canClose: true },
        { product: "입출금통장", number: "003536*****0", balance: 0, canClose: true },
        { product: "비대면 플러스입출금통장", number: "06861210*****5", balance: 0, canClose: true }
      ]},
      { id: "saemaul", name: "새마을금고", mark: "MG", color: "#79a9c6", accounts: [
        { product: "MG주거래우대통장", number: "9003289*****8", balance: 0, canClose: false },
        { product: "온라인자립예탁금", number: "9003304*****3", balance: 2000, canClose: false },
        { product: "정기예탁금", number: "9110712*****6", balance: 28000000, canClose: false }
      ]}
    ]
  },
  securities: {
    summaryPrefix: "조회가능 증권사",
    note: "증권사 계좌해지 및 잔고이전 서비스는 평일 09:00 ~ 16:00에 제공됩니다.",
    institutions: [
      { id: "kbsec", name: "KB증권", mark: "KB", color: "#a89564", accounts: [
        { product: "01 종합위탁", number: "36143*****1", balance: 3216, canClose: false },
        { product: "01 종합위탁", number: "37478*****1", balance: 0, canClose: true }
      ]},
      { id: "yuanta", name: "유안타증권", mark: "Y", color: "#4f83bf", accounts: [
        { product: "위탁", number: "70301*****0", balance: 0, canClose: true }
      ]},
      { id: "kiwoom", name: "키움증권", mark: "K", color: "#7354b7", accounts: [
        { product: "위탁종합", number: "81014*****2", balance: 14, canClose: false }
      ]},
      { id: "toss", name: "토스증권", mark: "T", color: "#557cf1", accounts: [
        { product: "기본", number: "12701*****7", balance: 6009, canClose: false }
      ]}
    ]
  }
};

const loanContracts = [];

// ─── 날짜 ─────────────────────────────────────────────────────────────
const pad2 = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const koreanDate = (d) => `${d.getFullYear()}년 ${pad2(d.getMonth() + 1)}월 ${pad2(d.getDate())}일`;
function previousBusinessDay(base) {
  const d = new Date(base);
  do { d.setDate(d.getDate() - 1); } while (d.getDay() === 0 || d.getDay() === 6);
  return d;
}
const TODAY = new Date();
const TODAY_ISO = isoDate(TODAY);
const PREV_BUSINESS_ISO = isoDate(previousBusinessDay(TODAY));

// ─── "상기 내용을 한달 간 보지 않음" 저장 ─────────────────────────────
const NOTICE_SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;
function isNoticeSnoozed(key) {
  try { return Number(localStorage.getItem(`notice-snooze:${key}`)) > Date.now(); }
  catch { return false; }
}
function snoozeNotice(key) {
  try { localStorage.setItem(`notice-snooze:${key}`, String(Date.now() + NOTICE_SNOOZE_MS)); }
  catch { /* 저장소를 쓸 수 없으면 이번 세션에만 적용 */ }
}

// ─── 상태 ─────────────────────────────────────────────────────────────
const state = {
  group: "bank",
  institution: null,
  securitiesNoticeSeen: false,
  overviewScrollTop: 0
};

// ─── DOM 참조 ─────────────────────────────────────────────────────────
const $ = (selector) => document.querySelector(selector);
const homeView = $("#home-view");
const overviewView = $("#overview-view");
const loanView = $("#loan-view");
const detailView = $("#detail-view");
const overviewScroll = $("#overview-scroll");
const detailScroll = $("#detail-scroll");
const loanScroll = $("#loan-scroll");
const institutionList = $("#institution-list");
const summaryPrefix = $("#summary-prefix");
const summaryCount = $("#summary-count");
const groupNote = $("#group-note");
const detailContent = $("#detail-content");
const detailTotal = $("#detail-total");
const detailNotes = $("#detail-notes");
const loadingOverlay = $("#loading-overlay");
const loanLoadingOverlay = $("#loan-loading-overlay");
const lookupOverlay = $("#lookup-overlay");
const securitiesModal = $("#securities-modal");
const bottomNav = $(".bottom-nav");
const toast = $("#toast");
let toastTimer;

// ─── 포맷 / 공통 템플릿 ───────────────────────────────────────────────
const formatWon = (value) => `${value.toLocaleString("ko-KR")} 원`;
const formatPoint = (value) => `${value.toLocaleString("ko-KR")} P`;
const totalOf = (institution) => institution.accounts.reduce((sum, account) => sum + account.balance, 0);
const accountCountOf = (group) => group.institutions.reduce((sum, institution) => sum + institution.accounts.length, 0);
const countClass = (n) => (n > 1 ? " is-many" : "");

function logoTemplate(institution, extraClass = "") {
  const wide = institution.wide ? " logo-wide" : "";
  const textColor = institution.textColor || "#fff";
  const ring = institution.border ? ";box-shadow:inset 0 0 0 1px #e1e4ea" : "";
  return `<span class="bank-logo${wide} ${extraClass}" style="--logo-bg:${institution.color};color:${textColor}${ring}">${institution.mark}</span>`;
}

function findInstitution(id) {
  for (const group of Object.values(groups)) {
    const found = group.institutions.find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

const EMPTY_ILLUSTRATION = `
  <svg class="empty-illust" viewBox="0 0 96 96" aria-hidden="true">
    <rect x="19" y="15" width="52" height="66" rx="7" fill="#2a59c9"/>
    <rect x="21" y="17" width="48" height="62" rx="6" fill="#3d72e6"/>
    <rect x="26" y="22" width="38" height="50" rx="3" fill="#f5f7fb"/>
    <rect x="26" y="66" width="38" height="6" fill="#dfe4ec"/>
    <rect x="31" y="33" width="21" height="3.2" rx="1.6" fill="#97a1b4"/>
    <rect x="31" y="41" width="16" height="3.2" rx="1.6" fill="#97a1b4"/>
    <rect x="31" y="49" width="19" height="3.2" rx="1.6" fill="#97a1b4"/>
    <rect x="36" y="11" width="18" height="9" rx="3" fill="#5a8ff2"/>
    <g class="empty-badge">
      <circle cx="67" cy="45" r="14.5" fill="#17a05d"/>
      <circle cx="67" cy="45" r="11.5" fill="#22b46c"/>
      <rect x="65.2" y="36.5" width="3.6" height="11.5" rx="1.8" fill="#fff"/>
      <circle cx="67" cy="52.6" r="2.1" fill="#fff"/>
    </g>
  </svg>`;

function emptyStateTemplate(message, hint = "") {
  return `
    <div class="empty-state">
      ${EMPTY_ILLUSTRATION}
      <p class="empty-message">${message}</p>
      ${hint ? `<p class="empty-hint">${hint}</p>` : ""}
    </div>`;
}

// ─── 토스트 / 로딩 ────────────────────────────────────────────────────
function showToast(message = "현재 제공되지 않는 기능입니다.") {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 1900);
}

// 계좌 화면에서 쓰던 흰색 로딩
function showLoading(callback, delay = 520) {
  loadingOverlay.hidden = false;
  window.setTimeout(() => {
    loadingOverlay.hidden = true;
    callback();
  }, delay);
}

// 카드/자동이체 화면의 어두운 조회 로딩
let lookupTimer;
function showLookup(callback, delay = 620) {
  window.clearTimeout(lookupTimer);
  lookupOverlay.hidden = false;
  lookupTimer = window.setTimeout(() => {
    lookupOverlay.hidden = true;
    if (callback) callback();
  }, delay);
}

// ─── 화면 전환 (탭 화면 + 쌓이는 하위 화면) ───────────────────────────
// 탭 화면: 하단 메뉴가 보이는 화면 (홈 / 계좌 / 카드 / 납부)
// 하위 화면: 뒤로가기로 닫히는 화면, 하단 메뉴 숨김
const topViews = {};
const subViews = {};
const nav = { top: "home", stack: [] };
const NAV_KEY_BY_TOP = { home: "home", accounts: "accounts", cards: "cards", tax: "pay" };
let ignorePops = 0;
let lastRootBackAt = 0;

function registerTop(name, el, hooks = {}) { topViews[name] = { el, ...hooks }; }
function registerSub(name, el, hooks = {}) { subViews[name] = { el, ...hooks }; }

function currentViewEl() {
  return nav.stack.length ? subViews[nav.stack[nav.stack.length - 1]].el : topViews[nav.top].el;
}

function activateView(el) {
  window.clearTimeout(el.hideTimer);
  el.hidden = false;
  el.classList.remove("is-leaving");
  void el.offsetWidth;
  el.classList.add("is-active");
}

function deactivateView(el) {
  el.classList.remove("is-active", "is-leaving");
  window.clearTimeout(el.hideTimer);
  el.hideTimer = window.setTimeout(() => {
    if (!el.classList.contains("is-active")) el.hidden = true;
  }, 280);
}

function updateBottomNav() {
  const key = NAV_KEY_BY_TOP[nav.top];
  document.querySelectorAll(".bottom-nav-item").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.nav === key);
  });
  bottomNav.hidden = nav.stack.length > 0;
}

function closeAllSubs() {
  if (!nav.stack.length) return;
  const depth = nav.stack.length;
  while (nav.stack.length) {
    const sub = subViews[nav.stack.pop()];
    window.clearTimeout(sub.el.hideTimer);
    sub.el.classList.remove("is-active", "is-leaving");
    sub.el.hidden = true;
    if (sub.onClose) sub.onClose();
  }
  Object.values(topViews).forEach((top) => top.el.classList.remove("is-leaving"));
  ignorePops += 1;
  history.go(-depth);
}

function setTop(name) {
  const next = topViews[name];
  if (!next) return;
  closeAllSubs();
  if (nav.top !== name) {
    deactivateView(topViews[nav.top].el);
    nav.top = name;
  }
  activateView(next.el);
  if (next.onEnter) next.onEnter();
  updateBottomNav();
}

function pushSub(name) {
  const sub = subViews[name];
  if (!sub || nav.stack.includes(name)) return;
  const under = currentViewEl();
  under.classList.remove("is-active");
  under.classList.add("is-leaving");
  nav.stack.push(name);
  activateView(sub.el);
  history.pushState({ sub: name, depth: nav.stack.length }, "");
  updateBottomNav();
}

function popSubVisual() {
  const name = nav.stack.pop();
  if (!name) return;
  const sub = subViews[name];
  deactivateView(sub.el);
  const under = currentViewEl();
  window.clearTimeout(under.hideTimer);
  under.hidden = false;
  under.classList.remove("is-leaving");
  under.classList.add("is-active");
  if (sub.onClose) sub.onClose();
  updateBottomNav();
}

// 화면의 뒤로가기 버튼도 브라우저 히스토리를 거쳐서 닫습니다.
function popSub() {
  if (nav.stack.length) history.back();
}

// ─── 모달 공통 ────────────────────────────────────────────────────────
const modals = [];
function registerModal(el, onDismiss) { modals.push({ el, onDismiss }); }
function closeOpenModal() {
  const open = modals.find((modal) => !modal.el.hidden);
  if (!open) return false;
  open.el.hidden = true;
  if (open.onDismiss) open.onDismiss();
  return true;
}

// ─── 계좌 한눈에 ──────────────────────────────────────────────────────
function renderOverview() {
  const group = groups[state.group];
  const count = accountCountOf(group);
  const institutionLabel = state.group === "bank" ? "은행" : "기관";
  summaryPrefix.textContent = group.summaryPrefix;
  summaryPrefix.hidden = !group.summaryPrefix;
  summaryCount.textContent = `${institutionLabel} ${group.institutions.length}, 계좌 ${count}`;
  groupNote.textContent = group.note;
  groupNote.hidden = !group.note;

  institutionList.innerHTML = group.institutions.map((institution) => `
    <button class="institution-row" type="button" data-institution="${institution.id}" aria-label="${institution.name}, 계좌 ${institution.accounts.length}건">
      <svg class="favorite-star" aria-hidden="true" viewBox="0 0 24 24"><path d="m12 2.7 2.8 5.7 6.3.9-4.5 4.4 1.1 6.2-5.7-3-5.7 3 1.1-6.2-4.5-4.4 6.3-.9z"/></svg>
      ${logoTemplate(institution)}
      <span class="institution-name">${institution.name}</span>
      <span class="institution-count">${institution.accounts.length} 건</span>
      <span class="chevron" aria-hidden="true">›</span>
    </button>
  `).join("");

  document.querySelectorAll(".category-tabs [role='tab']").forEach((tab) => {
    const active = tab.dataset.group === state.group;
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.tabIndex = active ? 0 : -1;
  });
}

function renderDetail(institution) {
  const total = totalOf(institution);
  detailTotal.textContent = formatWon(total);
  detailContent.innerHTML = `
    <header class="institution-heading">
      ${logoTemplate(institution)}
      <h2>${institution.name}<small>${institution.accounts.length}</small></h2>
      <span class="institution-total">${formatWon(total)}</span>
    </header>
    <div class="account-list">
      ${institution.accounts.map((account) => `
        <article class="account-card">
          <span class="product-name">${account.product}</span>
          <span class="account-number">${account.number}</span>
          <span class="account-status${account.canClose ? " can-close" : ""}">${account.canClose ? "해지가능" : "해지불가"}</span>
          <span class="account-balance">${formatWon(account.balance)} <span aria-hidden="true">›</span></span>
        </article>
      `).join("")}
    </div>
  `;

  const securities = state.group === "securities";
  detailNotes.innerHTML = securities
    ? `<li>1년 이상 거래가 없으며 예수금만 보유한 소액계좌에 한해 해지할 수 있습니다.</li><li>투자재산을 보유한 계좌는 항상 활동성 계좌로 분류됩니다.</li><li>총 잔고는 투자재산 평가금액과 예수금 잔고의 합계입니다.</li>`
    : `<li>1년 이상 입출금거래가 없는 소액계좌만 계좌해지 및 잔고이전을 신청할 수 있습니다.</li><li>마이너스 통장의 (-)금액은 잔액이 '0'원으로 표시됩니다.</li><li>'해지불가' 계좌는 해당 금융기관에 문의해주시기 바랍니다.</li><li>개인연금저축은 일부 조건에 따라 해지신청이 가능합니다.</li>`;
}

function activateGroup(nextGroup, { bypassNotice = false } = {}) {
  if (nextGroup === state.group) return;
  if (nextGroup === "securities" && !state.securitiesNoticeSeen && !isNoticeSnoozed("securities") && !bypassNotice) {
    $("#month-checkbox").checked = false;
    securitiesModal.hidden = false;
    return;
  }
  showLoading(() => {
    state.group = nextGroup;
    renderOverview();
    overviewScroll.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function openInstitution(id) {
  const institution = groups[state.group].institutions.find((item) => item.id === id);
  if (!institution) return;
  state.overviewScrollTop = overviewScroll.scrollTop;
  state.institution = institution;
  showLoading(() => {
    renderDetail(institution);
    detailScroll.scrollTop = 0;
    detailScroll.classList.remove("is-condensed");
    pushSub("detail");
  }, 440);
}

// ─── 대출 한눈에 ──────────────────────────────────────────────────────
function renderLoan() {
  const loanList = $("#loan-list");
  if (!loanList) return;
  loanList.innerHTML = loanContracts.map((loan) => `
    <li class="loan-item">
      <div class="loan-item-inner">
        <span class="loan-type">
          ${loan.type}
          ${loan.isExample ? '<em class="loan-example-tag">예시</em>' : ""}
        </span>
        <span class="loan-institution">${loan.institution}</span>
        <span class="loan-amount">${formatWon(loan.amount)} <span class="loan-chevron" aria-hidden="true">›</span></span>
      </div>
    </li>
  `).join("");
  const total = loanContracts.reduce((sum, loan) => sum + loan.amount, 0);
  $(".loan-summary-amount").textContent = formatWon(total);
  $(".loan-count strong").textContent = String(loanContracts.length);
}

let loanLoadTimer;
function openLoan() {
  window.clearTimeout(loanLoadTimer);
  loanLoadingOverlay.hidden = false;
  loanLoadTimer = window.setTimeout(() => {
    loanLoadingOverlay.hidden = true;
    loanScroll.scrollTop = 0;
    pushSub("loan");
  }, 650);
}

// ─── 화면 등록 ────────────────────────────────────────────────────────
registerTop("home", homeView, {
  onEnter() {
    if (state.group !== "bank") {
      state.group = "bank";
      renderOverview();
    }
  }
});
registerTop("accounts", overviewView, {
  onEnter() { overviewScroll.scrollTop = state.overviewScrollTop; }
});
registerSub("detail", detailView, {
  onClose() { state.institution = null; }
});
registerSub("loan", loanView, {
  onClose() {
    window.clearTimeout(loanLoadTimer);
    loanLoadingOverlay.hidden = true;
  }
});
registerModal(securitiesModal);

// 홈 그리드 동작. 다른 파일(cards.js 등)이 여기에 항목을 추가합니다.
const homeActions = {
  accounts: () => setTop("accounts"),
  loans: () => openLoan()
};

// ─── 이벤트 ───────────────────────────────────────────────────────────
// 카테고리 탭
$(".category-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-group]");
  if (tab) activateGroup(tab.dataset.group);
});

$(".category-tabs").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const order = ["bank", "secondary", "securities"];
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const next = order[(order.indexOf(state.group) + direction + order.length) % order.length];
  document.querySelector(`[data-group="${next}"]`).focus();
  activateGroup(next);
});

// 기관 목록
institutionList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-institution]");
  if (row) openInstitution(row.dataset.institution);
});

// 문서 전체 위임: 홈 버튼, 뒤로가기 버튼, 홈 그리드, 미지원 버튼
document.addEventListener("click", (event) => {
  if (event.target.closest(".home-button")) { setTop("home"); return; }
  if (event.target.closest("[data-back]")) { popSub(); return; }

  const actionBtn = event.target.closest("[data-action]");
  if (actionBtn && homeView.contains(actionBtn)) {
    const action = homeActions[actionBtn.dataset.action];
    if (action) action();
    return;
  }

  if (event.target.closest(".inert-control")) showToast();
});

// 대출 목록
$("#loan-list").addEventListener("click", (event) => {
  if (event.target.closest(".loan-item")) showToast("데모에서는 지원하지 않는 기능입니다.");
});

// 하단 메뉴
document.querySelectorAll(".bottom-nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.nav;
    if (key === "home") {
      setTop("home");
    } else if (key === "accounts") {
      if (nav.top === "accounts") overviewScroll.scrollTo({ top: 0, behavior: "smooth" });
      else setTop("accounts");
    } else if (key === "cards" && typeof openCards === "function") {
      openCards();
    } else if (key === "pay") {
      setTop("tax");
    } else {
      showToast();
    }
  });
});

// 증권 안내 모달
$("#modal-confirm").addEventListener("click", () => {
  if ($("#month-checkbox").checked) snoozeNotice("securities");
  state.securitiesNoticeSeen = true;
  securitiesModal.hidden = true;
  activateGroup("securities", { bypassNotice: true });
});
$("#modal-close").addEventListener("click", () => { securitiesModal.hidden = true; });
securitiesModal.addEventListener("click", (event) => {
  if (event.target === securitiesModal) securitiesModal.hidden = true;
});

// 계좌 상세 스크롤 축소
detailScroll.addEventListener("scroll", () => {
  detailScroll.classList.toggle("is-condensed", detailScroll.scrollTop > 85);
}, { passive: true });

// 뒤로가기: 모달 → 하위 화면 → (최상위) "한 번 더 뒤로가기" 안내
window.addEventListener("popstate", () => {
  if (ignorePops > 0) { ignorePops -= 1; return; }
  if (closeOpenModal()) {
    history.pushState({ restore: true }, "");
    return;
  }
  if (nav.stack.length) {
    popSubVisual();
    return;
  }
  if (Date.now() - lastRootBackAt < 2000) {
    history.back();
    return;
  }
  lastRootBackAt = Date.now();
  showToast("한 번 더 뒤로가기를 하시면 앱이 종료됩니다.");
  history.pushState({ guard: true }, "");
});

// 크롬은 사용자 조작 없이 넣은 히스토리를 건너뛰므로, 첫 터치 때 보호 항목을 넣습니다.
history.replaceState({ base: true }, "");
document.addEventListener("pointerdown", () => {
  if (!nav.stack.length) history.pushState({ guard: true }, "");
}, { once: true, capture: true });

// Escape 키
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (closeOpenModal()) return;
  popSub();
});

// ─── 초기화 ───────────────────────────────────────────────────────────
document.querySelectorAll(".summary-date, .lookup-date").forEach((el) => {
  el.textContent = `조회기준일 : ${TODAY_ISO}`;
});
$("#loan-date").textContent = TODAY_ISO;
renderOverview();
renderLoan();
updateBottomNav();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  });
}
