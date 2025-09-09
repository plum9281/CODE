// 초보자 포인트: 데이터는 나중에 엑셀→JSON으로 바꿔 넣으면 됩니다.
const CASES = [
  {
    title: "도로 함몰 발생 시 즉시 조치",
    tags: ["도로", "침하", "긴급"],
    body: "안전통제 → 원인조사 → 임시복구 → 상부 보고 순으로 처리합니다.",
  },
  {
    title: "공사장 인근 균열 민원 대응",
    tags: ["공사", "균열", "민원"],
    body: "계측 기록 확인, 촬영·위치기록, 민원인 안내문 제공 후 현장 점검.",
  },
  {
    title: "하수관 노후로 인한 침하 의심",
    tags: ["하수관", "노후", "침하"],
    body: "관로 CCTV 조사 요청, 지반탐사 병행, 위험등급에 따라 부분 복구.",
  },
];

const listEl = document.getElementById("casesList");
const searchEl = document.getElementById("search");

function render(items) {
  listEl.innerHTML = items
    .map(
      (v) => `
    <li>
      <strong>${v.title}</strong>
      <div class="badge">${v.tags.join(", ")}</div>
      <p style="margin:6px 0 0">${v.body}</p>
    </li>
  `
    )
    .join("");
}
function filter(keyword) {
  const k = keyword.trim().toLowerCase();
  if (!k) return CASES;
  return CASES.filter(
    (v) =>
      v.title.toLowerCase().includes(k) ||
      v.body.toLowerCase().includes(k) ||
      v.tags.some((t) => t.toLowerCase().includes(k))
  );
}

render(CASES);
searchEl.addEventListener("input", (e) => render(filter(e.target.value)));
