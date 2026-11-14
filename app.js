let state = {
  sol: 1, maxSols: 7, power: 80, water: 80, health: 100, science: 0, oxygenSplit: 50,
  crewNames: ["Cmdr. Maya", "Eng. Leo", "Botanist Sam"],
  liveMode: false, liveFlareLabel: "NASA DONKI: M1.2 Solar Flare (2026-11-07)",
  decisionsLog: []
};

const events = [
  {
    sol: 1, speakerIdx: 0, mode: "normal",
    source: "Source: NASA Artemis Baseline", tag: "TEMP: +15°C | SUNLIT CRATER",
    title: "Day 1: Touchdown on the Moon",
    text: "\"We landed at Shackleton Crater! Sticky Moon dust is everywhere, and we need to line up our solar panels before the freezing dark shadow arrives.\"",
    isStorm: false,
    choiceA: { label: "Line Up Solar Panels", costText: "+20% Power | 0 Science", power: 20, water: 0, health: 0, science: 0, note: "Built an early battery buffer." },
    choiceB: { label: "Dig Up & Scan Moon Rocks", costText: "-10% Power | +15 Science", power: -10, water: 0, health: 0, science: 15, note: "Collected early Moon rock samples." }
  },
  {
    sol: 2, speakerIdx: 0, mode: "cold",
    source: "Source: NASA LRO Diviner (-230°C Data)", tag: "TEMP: -230°C | FREEZING SHADOW",
    title: "Day 2: Freezing Dark Shadow",
    text: "\"Brrr! A freezing dark shadow just covered our base—NASA measured minus 230 degrees here! How should we keep our crew warm?\"",
    isStorm: false,
    choiceA: { label: "Turn On Full Electric Heaters", costText: "-20% Power | Crew Stays Warm", power: -20, water: 0, health: 0, science: 5, note: "Used electric heaters in the minus 230°C shadow." },
    choiceB: { label: "Pump Warm Water Through Walls", costText: "-15% Water | +10 Science", power: 0, water: -15, health: -5, science: 10, note: "Used warm water loops to save battery power." }
  },
  {
    sol: 3, speakerIdx: 1, mode: "storm",
    source: "DYNAMIC_DONKI", tag: "ALERT: M1.2 SOLAR STORM",
    title: "Day 3: Solar Storm Warning!",
    text: "\"Solar storm alert! A giant M1.2 blast from the Sun is heading right at us. Slide Roof Shield to at least 60% before picking what to do!\"",
    isStorm: true,
    choiceA: { label: "Turn Off Lab & Take Cover", costText: "+10% Power | Shield Check Active", power: 10, water: 0, health: 0, science: 0, note: "Powered down gear during the Nov 2026 solar storm." },
    choiceB: { label: "Measure the Solar Storm", costText: "-15% Power | +20 Science | Shield Check Active", power: -15, water: 0, health: 0, science: 20, note: "Measured storm rays during a live solar flare." }
  },
  {
    sol: 4, speakerIdx: 2, mode: "normal",
    source: "Source: NASA OSDR (Space Plants)", tag: "LAB: MOON GREENHOUSE",
    title: "Day 4: Moon Greenhouse Experiment",
    text: "\"My Moon sprouts look droopy! NASA found that space plants can grow in Moon dirt, but they need extra water and bright grow-lights.\"",
    isStorm: false,
    choiceA: { label: "Give Plants Extra Water & Light", costText: "-15% Water | -10% Power | +20 Science", power: -10, water: -15, health: 5, science: 20, note: "Grew fresh food in Moon dirt." },
    choiceB: { label: "Recycle Used Water Instead", costText: "+15% Water | 0 Science", power: -5, water: 15, health: 0, science: 0, note: "Cleaned and saved scarce water." }
  },
  {
    sol: 5, speakerIdx: 1, mode: "normal",
    source: "Source: Apollo & OSDR Moon Dust Data", tag: "SOLAR POWER: 55% (DUSTY)",
    title: "Day 5: Sticky Moon Dust Clogs Panels",
    text: "\"Sharp, sticky Moon dust covered our solar panels! Going outside in a spacesuit to brush them off gives me a risky dose of space rays.\"",
    isStorm: false,
    choiceA: { label: "Walk Outside & Brush Panels Clean", costText: "+25% Power | -10% Health | -10% Water", power: 25, water: -10, health: -10, science: 5, note: "Braved space rays outside to clean solar panels." },
    choiceB: { label: "Stay Inside & Save Battery", costText: "-15% Power | Crew Stays Safe", power: -15, water: 0, health: 0, science: 5, note: "Stayed safely inside and rationed power." }
  },
  {
    sol: 6, speakerIdx: 1, mode: "storm",
    source: "Source: NASA DONKI X8.1 Superstorm (2026-02-01)", tag: "DANGER: X8.1 GIANT SUN BLAST",
    title: "Day 6: Giant X8.1 Sun Blast!",
    text: "\"RED ALERT! A huge X8.1 Sun blast is hitting the Moon! Pump at least 60% of our water into the Roof Shield right now!\"",
    isStorm: true,
    choiceA: { label: "Send All Backup Power to Air & Shields", costText: "-10 Science | Shield Check Active", power: 5, water: 0, health: 0, science: -10, note: "Protected the crew during an X8.1 Sun blast." },
    choiceB: { label: "Boost Shields & Record Storm", costText: "-20% Power | +15 Science | Shield Check Active", power: -20, water: 0, health: 0, science: 15, note: "Boosted shields and recorded X8.1 storm data." }
  },
  {
    sol: 7, speakerIdx: 0, mode: "normal",
    source: "Source: NASA Deep Space Network", tag: "RADIO: READY FOR EARTH",
    title: "Day 7: Send Science Before Going Home",
    text: "\"Our rescue rocket is almost here! Beaming all our Moon discoveries back to Earth takes one big burst of battery power.\"",
    isStorm: false,
    choiceA: { label: "Send All Science to Earth Now", costText: "-20% Power | +20 Science Bonus", power: -20, water: 0, health: 0, science: 20, note: "Sent all Moon science back to Earth." },
    choiceB: { label: "Save Battery for the Rocket Ride Home", costText: "+10% Power | +5 Science", power: 10, water: -5, health: 0, science: 5, note: "Saved battery power for a safe trip home." }
  }
];
function getAstronautSVG(charIdx, mood, suitColor) {
  let eyes = '<circle cx="29" cy="35" r="2.5" fill="#0f172a"/><circle cx="47" cy="35" r="2.5" fill="#0f172a"/>';
  let mouth = '<path d="M30 44 Q38 51 46 44" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  let sweat = '';
  let hair = '';

  if (charIdx === 0) {
    hair = '<path d="M21 29 Q24 19 38 19 Q52 19 55 29 Q46 24 38 25 Q30 24 21 29" fill="#451a03"/>';
  } else if (charIdx === 1) {
    hair = '<path d="M22 28 L27 20 L33 25 L38 19 L43 25 L49 20 L54 28 Z" fill="#1e293b"/>';
  } else {
    hair = '<circle cx="23" cy="23" r="5" fill="#7c2d12"/><circle cx="53" cy="23" r="5" fill="#7c2d12"/><path d="M22 28 Q38 20 54 28" fill="#7c2d12"/>';
  }

  if (mood === "warn") {
    mouth = '<line x1="30" y1="45" x2="46" y2="45" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>';
    sweat = '<path d="M55 24 Q58 30 55 33 Q52 30 55 24" fill="#38bdf8"/>';
  } else if (mood === "bad") {
    eyes = '<path d="M26 32 L32 38 M32 32 L26 38 M44 32 L50 38 M50 32 L44 38" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>';
    mouth = '<path d="M30 48 Q38 41 46 48" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  }

  return '<svg viewBox="0 0 76 76">' +
    '<rect x="16" y="54" width="44" height="22" rx="10" fill="#e2e8f0" stroke="' + suitColor + '" stroke-width="2.5"/>' +
    '<circle cx="38" cy="36" r="24" fill="#f8fafc" stroke="' + suitColor + '" stroke-width="3"/>' +
    '<rect x="20" y="21" width="36" height="30" rx="13" fill="#fde68a"/>' +
    hair + eyes + mouth + sweat +
    '</svg>';
}

const waterSlider = document.getElementById("water-slider");
waterSlider.addEventListener("input", function(e) {
  state.oxygenSplit = parseInt(e.target.value, 10);
  const shieldSplit = 100 - state.oxygenSplit;
  document.getElementById("oxygen-pct").textContent = state.oxygenSplit + "%";
  document.getElementById("shield-pct").textContent = shieldSplit + "%";
  document.getElementById("diagram-shield-bar").style.width = shieldSplit + "%";
  document.getElementById("diagram-shield-text").textContent = "ROOF WATER SHIELD: " + shieldSplit + "%";

  const warn = document.getElementById("live-warning");
  if (state.oxygenSplit < 40) { warn.style.color = "#ef4444"; warn.textContent = "WARNING: Too little Breathable Air! Crew will lose health."; }
  else if (shieldSplit < 40) { warn.style.color = "#ef4444"; warn.textContent = "WARNING: Thin Roof Shield! Crew is unsafe in solar storms."; }
  else { warn.style.color = "#94a3b8"; warn.textContent = "Balanced: Crew can breathe easily and Roof Shield is active."; }
});

function updateCast(isCold) {
  const hps = [
    Math.max(0, Math.min(100, Math.round((state.health + state.power) / 2))),
    Math.max(0, Math.min(100, state.health)),
    Math.max(0, Math.min(100, Math.round((state.health + state.water) / 2)))
  ];
  const suitColors = ["#38bdf8", "#22c55e", "#eab308"];

  for (let i = 0; i < 3; i++) {
    const num = i + 1;
    const hp = hps.at(i);
    const bar = document.getElementById("crew-bar-" + num);
    const avatar = document.getElementById("crew-avatar-" + num);
    const card = document.getElementById("actor-card-" + num);

    bar.style.width = hp + "%";
    card.className = isCold ? "actor-card shivering" : "actor-card";

    if (hp <= 35) { bar.style.background = "#ef4444"; avatar.innerHTML = getAstronautSVG(i, "bad", "#ef4444"); }
    else if (hp <= 70) { bar.style.background = "#eab308"; avatar.innerHTML = getAstronautSVG(i, "warn", "#eab308"); }
    else { bar.style.background = "#22c55e"; avatar.innerHTML = getAstronautSVG(i, "good", suitColors.at(i)); }
  }
}

function renderGame() {
  document.getElementById("sol-counter").innerHTML = "<strong>DAY " + state.sol + " / " + state.maxSols + "</strong>";
  document.getElementById("power-val").textContent = Math.max(0, state.power) + "%";
  document.getElementById("water-val").textContent = Math.max(0, state.water) + "%";
  document.getElementById("science-val").textContent = state.science + " / 50";

  const ev = events.at(state.sol - 1);
  updateCast(ev.mode === "cold");

  const stage = document.getElementById("story-stage");
  stage.className = "story-stage " + (ev.mode === "storm" ? "storm-mode" : ev.mode === "cold" ? "cold-mode" : "");

  document.getElementById("card-source").textContent = ev.source === "DYNAMIC_DONKI" ? state.liveFlareLabel : ev.source;
  document.getElementById("telemetry-tag").textContent = ev.tag;
  document.getElementById("speaker-name").textContent = state.crewNames.at(ev.speakerIdx);
  document.getElementById("card-title").textContent = ev.title;
  document.getElementById("card-text").textContent = ev.text;

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
  state.decisionsLog.push("Day " + state.sol + ": " + choice.note);

  if (state.oxygenSplit < 40) { state.health -= 15; alerts.push("Low Air (-15% Health)!"); }
  if (isStorm && shieldSplit < 60) { state.health -= 25; alerts.push("Space Ray Hit (-25% Health): Roof Shield was under 60%!"); }
  else if (isStorm) { alerts.push("Roof Water Shield blocked the solar storm!"); }

  const banner = document.getElementById("turn-feedback");
  banner.classList.remove("hidden");
  banner.textContent = alerts.length > 0 ? alerts.join(" ") : "Day " + state.sol + " done (-10% Power, -8% Water used to run the base).";

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

  if (!survived) { title.textContent = "EMERGENCY RESCUE NEEDED!"; title.style.color = "#ef4444"; subtitle.textContent = "Your base ran out of life support on Day " + state.sol + "."; }
  else if (state.science >= 50) { title.textContent = "YOU DID IT, FLIGHT DIRECTOR!"; title.style.color = "#22c55e"; subtitle.textContent = "Your crew survived all 7 Days and gathered " + state.science + " Science Points!"; }
  else { title.textContent = "CREW SAFE — NEED MORE SCIENCE"; title.style.color = "#eab308"; subtitle.textContent = "Everyone survived, but you only got " + state.science + "/50 Science Points."; }

  [
    "<strong>What You Learned:</strong> Pumping water into the Roof Shield protects astronauts from solar storms, but leaves less water for breathable air.",
    "<strong>Real NASA Science:</strong> You survived minus 230°C Moon shadows and real 2026 solar storms!"
  ].forEach(function(html) { const li = document.createElement("li"); li.innerHTML = html; list.appendChild(li); });
}

document.getElementById("to-tutorial-btn").onclick = function() {
  state.crewNames = [
    document.getElementById("input-crew-1").value.trim() || "Cmdr. Maya",
    document.getElementById("input-crew-2").value.trim() || "Eng. Leo",
    document.getElementById("input-crew-3").value.trim() || "Botanist Sam"
  ];
  for (let i = 0; i < 3; i++) {
    document.getElementById("crew-name-" + (i + 1)).textContent = state.crewNames.at(i);
  }
  document.getElementById("setup-modal").classList.add("hidden");
  document.getElementById("tutorial-modal").classList.remove("hidden");
  renderGame();
};

document.getElementById("start-mission-btn").onclick = function() {
  document.getElementById("tutorial-modal").classList.add("hidden");
};

document.getElementById("open-help-btn").onclick = function() {
  document.getElementById("tutorial-modal").classList.remove("hidden");
};

document.getElementById("data-mode-btn").addEventListener("click", async function(e) {
  state.liveMode = !state.liveMode;
  const btn = e.target;
  if (state.liveMode) {
    btn.textContent = "Fetching NASA DONKI...";
    try {
      const res = await fetch("https://nasa.gov");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const latest = data.at(-1);
        state.liveFlareLabel = "LIVE NASA DONKI: Class " + latest.classType + " (" + latest.beginTime.slice(0, 10) + ")";
        btn.textContent = "Data: Live NASA DONKI";
      } else throw new Error();
    } catch { state.liveFlareLabel = "NASA DONKI: M1.2 Solar Flare (2026-11-07)"; btn.textContent = "Data: Nov 2026 DONKI"; }
  } else { state.liveFlareLabel = "NASA DONKI: M1.2 Solar Flare (2026-11-07)"; btn.textContent = "Data: Nov 2026 DONKI"; }
  renderGame();
});

document.getElementById("judge-modal-btn").onclick = function() { document.getElementById("judge-modal").classList.remove("hidden"); };
document.getElementById("close-judge-btn").onclick = function() { document.getElementById("judge-modal").classList.add("hidden"); };
document.getElementById("restart-btn").onclick = function() {
  state = { sol: 1, maxSols: 7, power: 80, water: 80, health: 100, science: 0, oxygenSplit: 50, crewNames: state.crewNames, liveMode: state.liveMode, liveFlareLabel: state.liveFlareLabel, decisionsLog: [] };
waterSlider.value = 50;
waterSlider.dispatchEvent(new Event("input"));
document.getElementById("turn-feedback").classList.add("hidden");
document.getElementById("debrief-modal").classList.add("hidden");
renderGame();
};
renderGame();
