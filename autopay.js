"use strict";

// ─── 자동이체 데이터 ──────────────────────────────────────────────────
// bankId 는 app.js 의 groups 에 있는 기관 id 입니다 (로고·이름을 거기서 가져옴).
// accounts: 이름 옆 숫자(계좌 수), count: 오른쪽 "N 건".
// items 를 채우면 행을 눌렀을 때 펼쳐집니다. 비어 있으면 미지원 안내가 뜹니다.
const accountAutopay = [];
// 예: items: [{ payee: "한국전력공사", account: "3021772*****1", amount: 0 }]
const accountTransfers = [];
const cardAutopay = [];

const AUTOPAY_NOTE_ACCOUNT = "전영업일 기준 자동이체 내역입니다. (당일중 변경내역은 익영업일에 반영됩니다.)";
const AUTOPAY_NOTE_CARD = "전영업일 기준 자동납부 내역입니다. (당일중 변경내역은 익영업일에 반영됩니다.)";

// ─── DOM / 상태 ───────────────────────────────────────────────────────
const autopayView = $("#autopay-view");
const autopayScroll = $("#autopay-scroll");
const autopayContent = $("#autopay-content");
const autopayModal = $("#autopay-modal");

const autopayState = { tab: "account", maskOn: true, expanded: new Set(), cardNoticeSeen: false };

// ─── 렌더 ─────────────────────────────────────────────────────────────
function setAutopayTabSelection(tab) {
  document.querySelectorAll("#autopay-tabs [data-autopay-tab]").forEach((btn) => {
    const active = btn.dataset.autopayTab === tab;
    btn.setAttribute("aria-selected", active ? "true" : "false");
    if (active) btn.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  });
}

function maskNumber(number) {
  return autopayState.maskOn ? number : number.replace(/\*/g, "0");
}

function accountTabTemplate() {
  const totalAccounts = accountAutopay.reduce((sum, row) => sum + row.accounts, 0);
  const totalCount = accountAutopay.reduce((sum, row) => sum + row.count, 0);
  const rows = accountAutopay.map((row, index) => {
    const bank = findInstitution(row.bankId) || { name: row.bankId, mark: "?", color: "#8a93a6" };
    const open = autopayState.expanded.has(index);
    const items = open ? `
      <ul class="autopay-items">
        ${row.items.map((item) => `
          <li>
            <span class="autopay-item-name">${item.payee}</span>
            <span class="autopay-item-account">${maskNumber(item.account)}</span>
            ${item.amount !== undefined ? `<span class="autopay-item-amount">${formatWon(item.amount)}</span>` : ""}
          </li>`).join("")}
      </ul>` : "";
    return `
      <div class="autopay-group${open ? " is-open" : ""}">
        <button type="button" class="autopay-row" data-autopay-row="${index}" aria-expanded="${open}">
          ${logoTemplate(bank)}
          <span class="autopay-bank">${bank.name}<em>${row.accounts}</em></span>
          <span class="row-count${countClass(row.count)}">${row.count} 건</span>
          <svg class="expand-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        ${items}
      </div>`;
  }).join("");

  return `
    <div class="autopay-date-row"><span class="lookup-date-text">조회기준일 : ${PREV_BUSINESS_ISO}</span></div>
    <div class="autopay-summary">
      <strong class="lookup-counts">계좌 <em>${totalAccounts}</em> , 자동납부 <em>${totalCount}</em></strong>
      <button type="button" class="mask-toggle" id="autopay-mask" aria-pressed="${autopayState.maskOn}">
        계좌번호 일부 숨김
        <span class="switch${autopayState.maskOn ? " is-on" : ""}" aria-hidden="true"><span></span></span>
      </button>
    </div>
    <div class="autopay-list">${rows}</div>
    <ul class="feature-notes">
      <li>${AUTOPAY_NOTE_ACCOUNT}</li>
    </ul>`;
}

function transferTabTemplate() {
  return `
    <div class="autopay-date-row"><span class="lookup-date-text">조회기준일 : ${PREV_BUSINESS_ISO}</span></div>
    ${accountTransfers.length ? "" : emptyStateTemplate("등록된 계좌자동송금 내역이 없습니다.")}
    <ul class="feature-notes is-bottom">
      <li>${AUTOPAY_NOTE_ACCOUNT}</li>
    </ul>`;
}

function cardTabTemplate() {
  return `
    <div class="autopay-date-row is-split">
      <span class="lookup-caption">조회대상 <span class="info-dot" aria-hidden="true">i</span></span>
      <span class="lookup-date-text">조회기준일 : ${PREV_BUSINESS_ISO}</span>
    </div>
    ${cardAutopay.length ? "" : emptyStateTemplate("등록된 카드자동납부 내역이 없습니다.")}
    <ul class="feature-notes is-bottom">
      <li>${AUTOPAY_NOTE_CARD}</li>
    </ul>`;
}

function renderAutopay() {
  const templates = { account: accountTabTemplate, transfer: transferTabTemplate, card: cardTabTemplate };
  autopayContent.innerHTML = templates[autopayState.tab]();
  autopayContent.dataset.tab = autopayState.tab;
}

function showAutopayTab(tab) {
  autopayState.tab = tab;
  setAutopayTabSelection(tab);
  renderAutopay();
  autopayScroll.scrollTop = 0;
}

// ─── 진입 / 탭 전환 ───────────────────────────────────────────────────
function openAutopay() {
  autopayState.expanded.clear();
  autopayState.cardNoticeSeen = false;
  showAutopayTab("account");
  pushSub("autopay");
  showLookup(null, 600);
}

function selectAutopayTab(tab) {
  if (tab === autopayState.tab) return;
  if (tab === "card" && !autopayState.cardNoticeSeen && !isNoticeSnoozed("card-autopay")) {
    showLookup(() => {
      $("#autopay-modal-check").checked = false;
      autopayModal.querySelector(".modal-scroll").scrollTop = 0;
      autopayModal.hidden = false;
    });
    return;
  }
  showLookup(() => showAutopayTab(tab));
}

// ─── 등록 / 이벤트 ────────────────────────────────────────────────────
registerSub("autopay", autopayView, {
  onClose() { autopayModal.hidden = true; }
});
registerModal(autopayModal);

homeActions.autopay = () => openAutopay();

$("#autopay-tabs").addEventListener("click", (event) => {
  const btn = event.target.closest("[data-autopay-tab]");
  if (btn) selectAutopayTab(btn.dataset.autopayTab);
});

autopayContent.addEventListener("click", (event) => {
  if (event.target.closest("#autopay-mask")) {
    autopayState.maskOn = !autopayState.maskOn;
    renderAutopay();
    return;
  }
  const row = event.target.closest("[data-autopay-row]");
  if (!row) return;
  const index = Number(row.dataset.autopayRow);
  if (!accountAutopay[index].items.length) return;
  if (autopayState.expanded.has(index)) autopayState.expanded.delete(index);
  else autopayState.expanded.add(index);
  renderAutopay();
});

$("#autopay-modal-confirm").addEventListener("click", () => {
  if ($("#autopay-modal-check").checked) snoozeNotice("card-autopay");
  autopayState.cardNoticeSeen = true;
  autopayModal.hidden = true;
  showLookup(() => showAutopayTab("card"), 480);
});

$("#autopay-modal-close").addEventListener("click", () => { autopayModal.hidden = true; });
