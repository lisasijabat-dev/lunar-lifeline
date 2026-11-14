let state = {
  sol: 1, maxSols: 7, power: 80, water: 80, health: 100, science: 0, oxygenSplit: 50,
  liveMode: false, liveFlareLabel: "NASA DONKI: M1.2 Flare (2026-11-07 | ID: 2026-11-07T12:26:00-FLR-001)",
  decisionsLog: []
};

const events = [
  {
    sol: 1, source: "Source: NASA Artemis ECLSS Baseline", tag: "TEMP: +15°C | SUNLIT RIM",
    title: "Sol 1: Touchdown at Shackleton Crater",
    text: "Your habitat landed on the Lunar South Pole. Sharp regolith dust covers the landing zone, and solar arrays need alignment before temperatures drop.",
    isStorm: false,
    choiceA: { label: "Option A: Calibrate Solar Arrays", costText: "+20% Power | 0 Science", power: 20, water: 0, health: 0, science: 0, note: "Prioritized power generation early to build a battery buffer." },
    choiceB: { label: "Option B: Drill & Scan Crater Soil", costText: "-10% Power | +15 Science", power: -10, water: 0, health: 0, science: 15, note: "Spent early battery power to collect high-value lunar soil samples." }
  },
  {
    sol: 2, source: "Source: NASA LRO Diviner (-230°C Crater Data)", tag: "TEMP: -230°C | ECLIPSE SHADOW",
    title: "Sol 2: Freezing Crater Shadow",
    text: "Long shadows sweep across your base. NASA's Lunar Reconnaissance Orbiter recorded temperatures plunging to -230°C here. Habitat heaters need extra energy.",
    isStorm: false,
    choiceA: { label: "Option A: Run Full Electric Heaters", costText: "-20% Power | Crew Stays Warm", power: -20, water: 0, health: 0, science: 5, note: "Used heavy electrical power to survive the -230°C lunar shadow." },
    choiceB: { label: "Option B: Use Thermal Water Loops", costText: "-15% Water | +10 Science", power: 0, water: -15, health: -5, science: 10, note: "Circulated warm water through habitat walls to save battery power." }
  },
  {
    sol: 3, source: "DYNAMIC_DONKI", tag: "ALERT: M1.2 SOLAR FLARE",
    title: "Sol 3: Solar Flare Radiation Alert",
    text: "GOES-P space weather sensors detect an M1.2 Solar Flare. Without Earth's magnetic field, radiation will hit the base. Route at least 60% of your Water Lifeline to the Roof Shield.",
    isStorm: true,
    choiceA: { label: "Option A: Power Down Lab & Brace for Impact", costText: "+10% Power | Shield Check Active", power: 10, water: 0, health: 0, science: 0, note: "Shut down non-essential gear during the November 2026 M1.2 solar flare." },
    choiceB: { label: "Option B: Record Storm Telemetry", costText: "-15% Power | +20 Science | Shield Check Active", power: -15, water: 0, health: 0, science: 20, note: "Kept sensors running during a live solar flare to gather rare radiation data." }
  },
  {
    sol: 4, source: "Source: NASA OSDR (Space Plant Biology)", tag: "LAB: HYDROPONICS BAY 02",
    title: "Sol 4: Lunar Greenhouse Experiment",
    text: "NASA Open Science Data Repository studies show plants can sprout in lunar soil, but need extra water and LED light to overcome stress.",
    isStorm: false,
    choiceA: { label: "Option A: Boost Greenhouse LEDs & Water", costText: "-15% Water | -10% Power | +20 Science", power: -10, water: -15, health: 5, science: 20, note: "Invested water and power into growing fresh space crops." },
    choiceB: { label: "Option B: Recycle Greywater Instead", costText: "+15% Water | 0 Science", power: -5, water: 15, health: 0, science: 0, note: "Paused crop growth to reclaim and purify scarce water reserves." }
  },
  {
    sol: 5, source: "Source: Apollo & OSDR Regolith Toxicity Data", tag: "SOLAR OUTPUT: 55% (DUST)",
    title: "Sol 5: Abrasive Moon Dust Clogs Panels",
    text: "Electrostatic moon dust has coated your solar panels, cutting power output. Cleaning them requires a risky spacewalk outside the shielded habitat.",
    isStorm: false,
    choiceA: { label: "Option A: Send Crew on Spacewalk to Clean", costText: "+25% Power | -10% Health (Radiation) | -10% Water", power: 25, water: -10, health: -10, science: 5, note: "Risked cosmic radiation exposure on an EVA to restore solar power." },
    choiceB: { label: "Option B: Stay Inside & Ration Power", costText: "-15% Power | Crew Stays Safe", power: -15, water: 0, health: 0, science: 5, note: "Protected crew health by avoiding an EVA, accepting lower solar power." }
  },
  {
    sol: 6, source: "Source: NASA DONKI X8.1 Superstorm (2026-02-01)", tag: "CRITICAL: X8.1 CME IMPACT",
    title: "Sol 6: Extreme X8.1 Coronal Mass Ejection",
    text: "A massive X8.1 solar eruption is slamming the Moon. Your roof water bladders need at least 60% allocation right now to protect the crew from radiation sickness.",
    isStorm: true,
    choiceA: { label: "Option A: Divert All Backup Power to Life Support", costText: "-10 Science | Shield Check Active", power: 5, water: 0, health: 0, science: -10, note: "Sacrificed research data to keep life support steady during an X8.1 storm." },
    choiceB: { label: "Option B: Run Emergency Shield Boosters", costText: "-20% Power | +15 Science | Shield Check Active", power: -20, water: 0, health: 0, science: 15, note: "Drained battery reserves to reinforce storm defenses and log data." }
  },
  {
    sol: 7, source: "Source: NASA Deep Space Network", tag: "COMMS: HIGH-GAIN DISH READY",
    title: "Sol 7: Final Transmission Before Ascent",
    text: "Your relief rocket is inbound. Beaming all your collected lunar science back to Earth requires a massive burst of transmitter power.",
    isStorm: false,
    choiceA: { label: "Option A: Full-Power Science Upload", costText: "-20% Power | +20 Science Bonus", power: -20, water: 0, health: 0, science: 20, note: "Used remaining battery reserves to transmit all research to Earth." },
    choiceB: { label: "Option B: Save Power for Safe Liftoff", costText: "+10% Power | +5 Science", power: 10, water: -5, health: 0, science: 5, note: "Played it safe to ensure a smooth, well-powered departure." }
  }
];
const waterSlider = document.getElementById("water-slider");
const oxygenPctEl = document.getElementById("oxygen-pct");
const shieldPctEl = document.getElementById("shield-pct");
const liveWarningEl = document.getElementById("live-warning");

waterSlider.addEventListener("input", function(e) {
  state.oxygenSplit = parseInt(e.target.value, 10);
  const shieldSplit = 100 - state.oxygenSplit;
  oxygenPctEl.textContent = state.oxygenSplit + "%";
  shieldPctEl.textContent = shieldSplit + "%";
  document.getElementById("diagram-shield-bar").style.width = shieldSplit + "%";
  document.getElementById("diagram-shield-text").textContent = "ROOF WATER SHIELD: " + shieldSplit + "%";
  document.getElementById("diagram-o2-bar").style.width = state.oxygenSplit + "%";
  document.getElementById("diagram-o2-text").textContent = "O2 AIR: " + state.oxygenSplit + "%";

  if (state.oxygenSplit < 40) {
    liveWarningEl.className = "warning-box danger";
    liveWarningEl.textContent = "WARNING: Low Oxygen. Crew will lose health from thin air.";
  } else if (shieldSplit < 40) {
    liveWarningEl.className = "warning-box danger";
    liveWarningEl.textContent = "WARNING: Thin Roof Shield. Crew is vulnerable to solar flares.";
  } else {
    liveWarningEl.className = "warning-box";
    liveWarningEl.textContent = "STATUS: Balanced allocation. Oxygen and roof shielding are both active.";
  }
});

function updateCrewCards() {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById("crew-status-" + i);
    if (state.health <= 35) { el.textContent = "CRITICAL"; el.className = "crew-status danger"; }
    else if (state.health <= 70 || state.power <= 25 || state.water <= 25) { el.textContent = "FATIGUED"; el.className = "crew-status warn"; }
    else { el.textContent = "NOMINAL"; el.className = "crew-status"; }
  }
}

function updateMeter(name, value) {
  const clamped = Math.max(0, Math.min(100, value));
  document.getElementById(name + "-val").textContent = clamped + "%";
  const bar = document.getElementById(name + "-bar");
  bar.style.width = clamped + "%";
  bar.className = "bar-fill " + (clamped > 50 ? "green" : clamped > 25 ? "yellow" : "red");
}

function renderGame() {
  document.getElementById("sol-counter").textContent = "SOL " + state.sol + " / " + state.maxSols;
  updateMeter("power", state.power);
  updateMeter("water", state.water);
  updateMeter("health", state.health);
  updateCrewCards();
  document.getElementById("science-val").textContent = state.science + " / 50 pts";
  document.getElementById("science-bar").style.width = Math.min(100, (state.science / 50) * 100) + "%";

  const ev = events.at(state.sol - 1);
  document.getElementById("card-source").textContent = ev.source === "DYNAMIC_DONKI" ? state.liveFlareLabel : ev.source;
  document.getElementById("telemetry-tag").textContent = ev.tag;
  document.getElementById("card-title").textContent = ev.title;
  document.getElementById("card-text").textContent = ev.text;

  const viewport = document.getElementById("sensor-viewport");
  const rayBanner = document.getElementById("solar-ray-banner");
  viewport.className = ev.isStorm ? "sensor-viewport storm-alert" : "sensor-viewport";
  rayBanner.textContent = ev.isStorm ? "WARNING: INCOMING SOLAR RADIATION STORM" : "SOLAR RADIATION: BACKGROUND LEVEL";
  rayBanner.style.color = ev.isStorm ? "#ef4444" : "#fbbf24";

  const btnA = document.getElementById("choice-a-btn");
  const btnB = document.getElementById("choice-b-btn");
  btnA.innerHTML = "<strong>" + ev.choiceA.label + "</strong><span>" + ev.choiceA.costText + "</span>";
  btnB.innerHTML = "<strong>" + ev.choiceB.label + "</strong><span>" + ev.choiceB.costText + "</span>";
  btnA.onclick = function() { handleChoice(ev.choiceA, ev.isStorm); };
  btnB.onclick = function() { handleChoice(ev.choiceB, ev.isStorm); };
}

function handleChoice(choice, isStorm) {
  const shieldSplit = 100 - state.oxygenSplit;
  let alerts = [];
  state.power += choice.power - 10;
  state.water += choice.water - 8;
  state.health += choice.health;
  state.science = Math.max(0, state.science + choice.science);
  state.decisionsLog.push("Sol " + state.sol + ": " + choice.note);

  if (state.oxygenSplit < 40) { state.health -= 15; alerts.push("[O2 ALERT] Low Oxygen (-15% Health)."); }
  if (isStorm && shieldSplit < 60) { state.health -= 25; alerts.push("[RADIATION BREACH] (-25% Health): Roof shield was below 60%."); }
  else if (isStorm) { alerts.push("[SHIELD ACTIVE] Radiation Blocked by roof water bladders."); }

  const banner = document.getElementById("turn-feedback");
  banner.classList.remove("hidden");
  banner.textContent = alerts.length > 0 ? alerts.join(" ") : "Sol " + state.sol + " complete. Base systems consumed 10% Power and 8% Water.";

  if (state.power <= 0 || state.water <= 0 || state.health <= 0) { renderGame(); showDebrief(false); return; }
  if (state.sol >= state.maxSols) { renderGame(); showDebrief(true); return; }
  state.sol += 1;
  renderGame();
}

function showDebrief(survived) {
  const modal = document.getElementById("debrief-modal");
  const title = document.getElementById("debrief-title");
  const subtitle = document.getElementById("debrief-subtitle");
  const list = document.getElementById("debrief-lessons");
  modal.classList.remove("hidden");
  list.innerHTML = "";

  if (!survived) { title.textContent = "EMERGENCY EVACUATION TRIGGERED"; title.style.color = "#ef4444"; subtitle.textContent = "Outpost ran out of critical life support on Sol " + state.sol + "."; }
  else if (state.science >= 50) { title.textContent = "MISSION ACCOMPLISHED, FLIGHT DIRECTOR"; title.style.color = "#22c55e"; subtitle.textContent = "Survived all 7 Sols and collected " + state.science + " Science Points."; }
  else { title.textContent = "CREW SURVIVED — RESEARCH GOAL MISSED"; title.style.color = "#eab308"; subtitle.textContent = "Crew came home safe, but gathered " + state.science + "/50 Science Points."; }

  const lessons = [
    "<strong>Dual-Use Water Lesson:</strong> Pumping water into roof radiation shields reduces water available for breathable oxygen.",
    "<strong>NASA Data Grounding:</strong> Mission modeled -230°C LRO crater shadows and 2026 DONKI solar flares."
  ];
  lessons.forEach(function(html) { const li = document.createElement("li"); li.innerHTML = html; list.appendChild(li); });
}

document.getElementById("data-mode-btn").addEventListener("click", async function(e) {
  state.liveMode = !state.liveMode;
  const btn = e.target;
  if (state.liveMode) {
    btn.textContent = "Fetching Live NASA DONKI...";
    try {
      const res = await fetch("https://nasa.gov");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latest = data.at(-1);
        state.liveFlareLabel = "LIVE NASA DONKI: Class " + latest.classType + " Flare (" + latest.beginTime.slice(0, 10) + ")";
        btn.textContent = "Data Mode: Live NASA DONKI Feed";
      } else throw new Error();
    } catch (err) { state.liveFlareLabel = "NASA DONKI: M1.2 Flare (2026-11-07 | ID: 2026-11-07T12:26:00-FLR-001)"; btn.textContent = "Data Mode: Live Feed (Cached)"; }
  } else { state.liveFlareLabel = "NASA DONKI: M1.2 Flare (2026-11-07 | ID: 2026-11-07T12:26:00-FLR-001)"; btn.textContent = "Data Mode: Nov 2026 DONKI Archive"; }
  renderGame();
});

document.getElementById("judge-modal-btn").onclick = function() { document.getElementById("judge-modal").classList.remove("hidden"); };
document.getElementById("close-judge-btn").onclick = function() { document.getElementById("judge-modal").classList.add("hidden"); };
document.getElementById("restart-btn").onclick = function() {
  state = { sol: 1, maxSols: 7, power: 80, water: 80, health: 100, science: 0, oxygenSplit: 50, liveMode: state.liveMode, liveFlareLabel: state.liveFlareLabel, decisionsLog: [] };
  waterSlider.value = 50;
  waterSlider.dispatchEvent(new Event("input"));
  document.getElementById("turn-feedback").classList.add("hidden");
  document.getElementById("debrief-modal").classList.add("hidden");
  renderGame();
};

renderGame();
