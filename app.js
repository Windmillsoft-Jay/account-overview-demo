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
      { id: "gwangju", name: "광주은행", mark: "KJ", color: "#44a5d8", accounts: [
        { product: "저축예금", number: "1121031*****6", balance: 0, canClose: false }
      ]},
      { id: "kb", name: "국민은행", mark: "KB", color: "#a69161", accounts: [
        { product: "KB Wise통장", number: "05100104*****1", balance: 1, canClose: true },
        { product: "KB나라사랑우대통장", number: "93350200*****2", balance: 0, canClose: false },
        { product: "KB청년도약계좌", number: "0025300*****9", balance: 701000, canClose: false }
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
      { id: "jeonbuk", name: "전북은행", mark: "JB", color: "#50a4d4", accounts: [
        { product: "JB 주거래통장(저축)", number: "1021024*****0", balance: 0, canClose: false }
      ]},
      { id: "jeju", name: "제주은행", mark: "J", color: "#7163e9", accounts: [
        { product: "보통예금 J간편한통장", number: "700100*****2", balance: 0, canClose: true }
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
      ]},
      { id: "creditunion", name: "신협", mark: "CU", color: "#416cc4", accounts: [
        { product: "자립예탁금", number: "1318801*****8", balance: 13188, canClose: false }
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

const state = { group: "bank", institution: null, securitiesNoticeSeen: false, overviewScrollTop: 0 };
const overviewView = document.querySelector("#overview-view");
const detailView = document.querySelector("#detail-view");
const overviewScroll = document.querySelector("#overview-scroll");
const detailScroll = document.querySelector("#detail-scroll");
const institutionList = document.querySelector("#institution-list");
const summaryPrefix = document.querySelector("#summary-prefix");
const summaryCount = document.querySelector("#summary-count");
const groupNote = document.querySelector("#group-note");
const detailContent = document.querySelector("#detail-content");
const detailTotal = document.querySelector("#detail-total");
const detailNotes = document.querySelector("#detail-notes");
const loadingOverlay = document.querySelector("#loading-overlay");
const securitiesModal = document.querySelector("#securities-modal");
const bottomNav = document.querySelector(".bottom-nav");
const toast = document.querySelector("#toast");
let toastTimer;

const formatWon = (value) => `${value.toLocaleString("ko-KR")} 원`;
const totalOf = (institution) => institution.accounts.reduce((sum, account) => sum + account.balance, 0);
const accountCountOf = (group) => group.institutions.reduce((sum, institution) => sum + institution.accounts.length, 0);

function logoTemplate(institution) {
  const wide = institution.wide ? " logo-wide" : "";
  const textColor = institution.textColor || "#fff";
  return `<span class="bank-logo${wide}" style="--logo-bg:${institution.color};color:${textColor}">${institution.mark}</span>`;
}

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

function showLoading(callback, delay = 520) {
  loadingOverlay.hidden = false;
  window.setTimeout(() => {
    loadingOverlay.hidden = true;
    callback();
  }, delay);
}

function activateGroup(nextGroup, { bypassNotice = false } = {}) {
  if (nextGroup === state.group) return;
  if (nextGroup === "securities" && !state.securitiesNoticeSeen && !bypassNotice) {
    securitiesModal.hidden = false;
    return;
  }
  showLoading(() => {
    state.group = nextGroup;
    renderOverview();
    overviewScroll.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function openInstitution(id, pushHistory = true) {
  const institution = groups[state.group].institutions.find((item) => item.id === id);
  if (!institution) return;
  state.overviewScrollTop = overviewScroll.scrollTop;
  state.institution = institution;
  showLoading(() => {
    renderDetail(institution);
    detailScroll.scrollTop = 0;
    detailScroll.classList.remove("is-condensed");
    overviewView.classList.remove("is-active");
    overviewView.classList.add("is-leaving");
    detailView.hidden = false;
    bottomNav.hidden = true;
    requestAnimationFrame(() => detailView.classList.add("is-active"));
    if (pushHistory) history.pushState({ detail: id, group: state.group }, "", `#${state.group}/${id}`);
  }, 440);
}

function closeDetail({ fromHistory = false } = {}) {
  if (!state.institution) return;
  detailView.classList.remove("is-active");
  overviewView.classList.remove("is-leaving");
  overviewView.classList.add("is-active");
  window.setTimeout(() => {
    detailView.hidden = true;
    bottomNav.hidden = false;
    state.institution = null;
    overviewScroll.scrollTop = state.overviewScrollTop;
  }, 220);
  if (!fromHistory) history.back();
}

function showToast(message = "현재 제공되지 않는 기능입니다.") {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 1900);
}

document.querySelector(".category-tabs").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-group]");
  if (tab) activateGroup(tab.dataset.group);
});

document.querySelector(".category-tabs").addEventListener("keydown", (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  const order = ['bank', 'secondary', 'securities'];
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const next = order[(order.indexOf(state.group) + direction + order.length) % order.length];
  document.querySelector(`[data-group="${next}"]`).focus();
  activateGroup(next);
});

institutionList.addEventListener("click", (event) => {
  const row = event.target.closest("[data-institution]");
  if (row) openInstitution(row.dataset.institution);
});

document.querySelector("#back-button").addEventListener("click", () => closeDetail());

document.querySelectorAll(".home-button").forEach((button) => button.addEventListener("click", () => {
  if (state.institution) {
    history.replaceState({}, "", location.pathname);
    closeDetail({ fromHistory: true });
  }
  if (state.group !== "bank") {
    state.group = "bank";
    renderOverview();
  }
  overviewScroll.scrollTo({ top: 0, behavior: "smooth" });
}));

document.querySelectorAll(".inert-control, .bottom-nav-item:not(.is-active)").forEach((button) => {
  button.addEventListener("click", () => showToast());
});

document.querySelector(".bottom-nav-item.is-active").addEventListener("click", () => {
  if (state.institution) closeDetail();
  else overviewScroll.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#modal-confirm").addEventListener("click", () => {
  state.securitiesNoticeSeen = true;
  securitiesModal.hidden = true;
  activateGroup("securities", { bypassNotice: true });
});

document.querySelector("#modal-close").addEventListener("click", () => { securitiesModal.hidden = true; });

securitiesModal.addEventListener("click", (event) => {
  if (event.target === securitiesModal) securitiesModal.hidden = true;
});

detailScroll.addEventListener("scroll", () => {
  detailScroll.classList.toggle("is-condensed", detailScroll.scrollTop > 85);
}, { passive: true });

window.addEventListener("popstate", () => {
  if (state.institution) closeDetail({ fromHistory: true });
});

renderOverview();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  });
}
