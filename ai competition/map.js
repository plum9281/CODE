// 1) 기본 지도 띄우기
const map = L.map("map").setView([36.5, 127.8], 7); // 한반도 중부 근처
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

// 2) 위험등급별 색상
function colorByRisk(level) {
  return level === "high"
    ? "#ef4444" // 빨강
    : level === "medium"
    ? "#f59e0b" // 주황
    : "#22c55e"; // 초록
}

// 3) GeoJSON 불러와 그리기 + 선택 박스 채우기
const select = document.getElementById("areaSelect");
let layer; // 전역 레이어 참조

fetch("data/areas.geojson")
  .then((r) => r.json())
  .then((geo) => {
    // 지도 레이어
    layer = L.geoJSON(geo, {
      style: (f) => ({
        color: colorByRisk(f.properties.risk_level),
        weight: 2,
        fillOpacity: 0.25,
      }),
      onEachFeature: (f, l) => {
        const p = f.properties;
        l.bindPopup(`<strong>${p.name}</strong><br>
          위험등급: <b style="color:${colorByRisk(p.risk_level)}">${
          p.risk_level
        }</b><br>
          갱신일: ${p.updated_at}<br>
          출처: ${p.source}`);
      },
    }).addTo(map);

    // 선택 박스
    geo.features.forEach((f, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${f.properties.name} (${f.properties.risk_level})`;
      select.appendChild(opt);
    });

    // 선택 시 해당 구역으로 이동
    select.addEventListener("change", (e) => {
      const idx = Number(e.target.value);
      const feature = geo.features[idx];
      if (!feature) return;
      const temp = L.geoJSON(feature);
      map.fitBounds(temp.getBounds().pad(0.2));
      temp.remove();
    });
  })
  .catch((err) => {
    console.error(err);
    alert("데이터를 불러오지 못했습니다. Live Server로 열었는지 확인하세요.");
  });

// 4) 간단 범례
const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div");
  div.className = "leaflet-control";
  div.style.background = "#0b1222";
  div.style.color = "#e2e8f0";
  div.style.padding = "8px 10px";
  div.style.borderRadius = "8px";
  div.style.border = "1px solid #1f2937";
  div.innerHTML = `
    <div><span style="color:#ef4444;">■</span> high</div>
    <div><span style="color:#f59e0b;">■</span> medium</div>
    <div><span style="color:#22c55e;">■</span> low</div>
  `;
  return div;
};
legend.addTo(map);
