let state = {
  sol: 1, maxSols: 7, power: 80, water: 80, health: 100, science: 0, oxygenSplit: 50,
  bestScore: parseInt(localStorage.getItem("lunarBestScore") || "0", 10),
  crewNames: ["Commander Maya", "Engineer Leo", "Botanist Sam"],
  avatarStyles: Array.of(0, 1, 2),
  liveMode: false, liveFlareLabel: "NASA DONKI: M1.2 Solar Flare (2026-11-07)",
  failReason: "", pendingGameOver: false
};

const events = [
  {
    sol: 1, speakerIdx: 0, mode: "normal",
    source: "Source: NASA Artemis ECLSS Baseline", tag: "TEMP: +15°C | SUNLIT CRATER",
    title: "Sol 1: Touchdown at Shackleton Crater",
    text: "\"We landed on the Moon's South Pole! Sharp lunar dust covers the ground outside our habitat and Greenhouse Dome. Before the freezing shadow arrives, how should we spend our first Sol?\"",
    isStorm: false,
    choiceA: {
      label: "Align Solar Arrays with the Sun",
      desc: "Turn our solar panels directly toward the low polar sunlight to charge the base batteries.",
      costText: "+20% Power | 0 Science", power: 20, water: 0, health: 0, science: 0,
      evalTitle: "Smart Energy Move!",
      evalMsg: "You built a strong battery buffer early, though you did not gather any Moon samples during this Sol.",
      fact: "Fun Space Fact: At the Lunar South Pole, the Sun stays very low on the horizon, so astronauts must tilt solar arrays vertically to catch maximum sunlight."
    },
    choiceB: {
      label: "Drill & Scan Crater Soil",
      desc: "Use our electric drill to dig up ancient Moon dirt and scan it for trapped water ice.",
      costText: "-10% Power | +15 Science", power: -10, water: 0, health: 0, science: 15,
      evalTitle: "Great Discovery, Watch Your Battery!",
      evalMsg: "You gathered valuable Moon soil data for Earth, though running the heavy drill drained your battery power.",
      fact: "Fun Space Fact: Lunar soil (called regolith) is not soft like Earth dirt. It is made of tiny, razor-sharp glass fragments created by meteorite impacts."
    }
  },
  {
    sol: 2, speakerIdx: 0, mode: "cold",
    source: "Source: NASA LRO Diviner (-230°C Data)", tag: "TEMP: -230°C | FREEZING SHADOW",
    title: "Sol 2: Freezing Crater Shadow",
    text: "\"Brrr! A freezing shadow just covered our base and Greenhouse Dome. NASA's Lunar Reconnaissance Orbiter measured minus 230°C here! How should we keep our crew from freezing?\"",
    isStorm: false,
    choiceA: {
      label: "Run Full Electric Space Heaters",
      desc: "Blast electric heaters inside the walls using battery power to keep the crew warm.",
      costText: "-20% Power | Crew Stays Warm", power: -20, water: 0, health: 0, science: 5,
      evalTitle: "Crew Safe, Heavy Power Cost!",
      evalMsg: "Your crew stayed warm and healthy, though heating a Moon base in minus 230°C cold uses up huge amounts of electricity.",
      fact: "Fun Space Fact: Permanently shadowed craters at the Moon's South Pole are among the coldest places in our solar system, even colder than Pluto!"
    },
    choiceB: {
      label: "Circulate Warm Water Through Habitat Walls",
      desc: "Pump heated water through wall pipes to trap warmth while saving battery electricity.",
      costText: "-15% Water | +10 Science", power: 0, water: -15, health: -5, science: 10,
      evalTitle: "Clever Trade-Off!",
      evalMsg: "You saved battery power and tested thermal water pipes, though some water was lost and the crew still felt chilly.",
      fact: "Fun Space Fact: Spacecraft use liquid water loops to move heat around because water holds warmth much better than air."
    }
  },
  {
    sol: 3, speakerIdx: 1, mode: "storm",
    source: "DYNAMIC_DONKI", tag: "ALERT: M1.2 SOLAR FLARE",
    title: "Sol 3: Solar Storm Warning!",
    text: "\"Space weather alert! GOES-P sensors spotted an M1.2 solar flare shooting space rays at us. Slide your Roof Shield to at least 60% before choosing!\"",
    isStorm: true,
    choiceA: {
      label: "Power Down Science Lab & Take Shelter",
      desc: "Turn off all non-essential computers to save power and shelter under the water roof.",
      costText: "+10% Power | Shield Check Active", power: 10, water: 0, health: 0, science: 0,
      evalTitle: "Safety First!",
      evalMsg: "You protected the base systems and saved power during the storm, though you paused your research for this Sol.",
      fact: "Fun Space Fact: Unlike Earth, the Moon has no thick atmosphere or magnetic shield, so astronauts rely on water walls and shelters to block solar radiation."
    },
    choiceB: {
      label: "Keep Sensors On to Measure Storm Rays",
      desc: "Spend battery power to record how strong the solar radiation is for scientists on Earth.",
      costText: "-15% Power | +20 Science | Shield Check Active", power: -15, water: 0, health: 0, science: 20,
      evalTitle: "Bold Science Move!",
      evalMsg: "You captured rare solar storm readings for Earth, at the cost of draining battery power during a crisis.",
      fact: "Fun Space Fact: NASA's DONKI database tracks real solar flares in real time so mission planners can warn astronauts before radiation arrives."
    }
  },
  {
    sol: 4, speakerIdx: 2, mode: "normal",
    source: "Source: NASA OSDR (Space Plant Biology)", tag: "LAB: GREENHOUSE DOME",
    title: "Sol 4: Greenhouse Dome Experiment",
    text: "\"The crops inside our Greenhouse Dome are drooping! We grow these space plants both to research farming on the Moon and to give our crew fresh food and natural oxygen, but they need extra water and grow-lights.\"",
    isStorm: false,
    choiceA: {
      label: "Boost Greenhouse Water & LED Grow-Lights",
      desc: "Give our space plants extra purified water and bright red-blue LED light so they thrive.",
      costText: "-15% Water | -10% Power | +20 Science", power: -10, water: -15, health: 5, science: 20,
      evalTitle: "Harvest Success!",
      evalMsg: "Your lunar plants grew strong, boosting crew health and science points, though they used up precious water and power.",
      fact: "Fun Space Fact: Growing fresh plants in space gives astronauts healthy vitamins and naturally turns breathed-out carbon dioxide back into fresh oxygen!"
    },
    choiceB: {
      label: "Run Water Recycler Instead",
      desc: "Pause plant lights and run the water purifier to reclaim moisture from the cabin air.",
      costText: "+15% Water | 0 Science", power: -5, water: 15, health: 0, science: 0,
      evalTitle: "Smart Resource Recovery!",
      evalMsg: "You refilled your water tank for upcoming emergencies, though your Greenhouse Dome experiment made no progress during this Sol.",
      fact: "Fun Space Fact: On the International Space Station, NASA recycles up to 98% of all water, including astronaut sweat and breath moisture!"
    }
  },
  {
    sol: 5, speakerIdx: 1, mode: "normal",
    source: "Source: Apollo & OSDR Regolith Data", tag: "SOLAR POWER: 55% (DUST DAMAGE)",
    title: "Sol 5: Sharp Moon Dust Damages Panels",
    text: "\"Static-charged Moon dust is sticking to our solar arrays! Because lunar dust is jagged like tiny glass shards, it scratches solar cells, blocks sunlight, and causes electronics to overheat unless we brush it off outside.\"",
    isStorm: false,
    choiceA: {
      label: "Go on a Spacewalk to Brush Panels Clean",
      desc: "Put on a spacesuit, step outside into space radiation, and sweep the sharp dust off our solar arrays.",
      costText: "+25% Power | -10% Health | -10% Water", power: 25, water: -10, health: -10, science: 5,
      evalTitle: "Risky Spacewalk Completed!",
      evalMsg: "Solar power is back at full strength! However, stepping outside exposed your Engineer to space rays and used spacesuit cooling water.",
      fact: "Fun Space Fact: Spacesuits use water-cooled underwear (called a Liquid Cooling Garment) to keep astronauts from overheating during spacewalks."
    },
    choiceB: {
      label: "Stay Safely Inside & Ration Power",
      desc: "Keep everyone protected inside the habitat and accept lower solar charging for this Sol.",
      costText: "-15% Power | Crew Stays Safe", power: -15, water: 0, health: 0, science: 5,
      evalTitle: "Crew Protected, Low Power!",
      evalMsg: "Your crew avoided space radiation outside, though dusty solar panels left your batteries running low.",
      fact: "Fun Space Fact: Apollo astronauts discovered that Moon dust is electrically charged, making it cling like glue to spacesuit visors and solar panels."
    }
  },
  {
    sol: 6, speakerIdx: 1, mode: "storm",
    source: "Source: NASA DONKI X8.1 Superstorm (2026-02-01)", tag: "DANGER: X8.1 SUPERSTORM",
    title: "Sol 6: Giant X8.1 Solar Superstorm!",
    text: "\"RED ALERT! A massive X8.1 flare is slamming the Moon! Pump at least 60% of our water into the Roof Shield right now to block the radiation!\"",
    isStorm: true,
    choiceA: {
      label: "Divert Lab Power to Air & Shield Pumps",
      desc: "Shut down science computers and send all backup energy to keep air and water shields running.",
      costText: "-10 Science | Shield Check Active", power: 5, water: 0, health: 0, science: -10,
      evalTitle: "Survival Over Science!",
      evalMsg: "You sacrificed some stored research data to keep life support steady during one of the strongest solar storms of 2026.",
      fact: "Fun Space Fact: X-class flares are the most powerful explosions on the Sun, releasing as much energy as a billion hydrogen bombs."
    },
    choiceB: {
      label: "Overdrive Shield Boosters & Log Storm",
      desc: "Push the batteries to the limit to power both the radiation sensors and emergency pumps.",
      costText: "-20% Power | +15 Science | Shield Check Active", power: -20, water: 0, health: 0, science: 15,
      evalTitle: "High-Stakes Engineering!",
      evalMsg: "You recorded priceless superstorm data for Earth, though your base batteries are nearly drained.",
      fact: "Fun Space Fact: Water is packed with hydrogen atoms, which are super effective at breaking apart fast-moving cosmic radiation particles."
    }
  },
  {
    sol: 7, speakerIdx: 0, mode: "normal",
    source: "Source: NASA Deep Space Network", tag: "COMMS: HIGH-GAIN DISH READY",
    title: "Sol 7: Send Research Before Ascent",
    text: "\"Our rescue rocket is coming down to pick us up! Beaming all our Moon data to Earth's Deep Space Network takes one final burst of radio power.\"",
    isStorm: false,
    choiceA: {
      label: "Full-Power Science Upload to Earth",
      desc: "Fire up the high-gain radio dish to transmit every bit of Moon research back to scientists.",
      costText: "-20% Power | +20 Science Bonus", power: -20, water: 0, health: 0, science: 20,
      evalTitle: "Transmission Sent!",
      evalMsg: "You used your remaining battery reserves to beam a massive bonus of lunar research straight to Earth!",
      fact: "Fun Space Fact: NASA's Deep Space Network uses giant 70-meter radio dishes in California, Spain, and Australia to talk to spacecraft on the Moon."
    },
    choiceB: {
      label: "Save Battery for Rocket Liftoff",
      desc: "Keep extra power in reserve to guarantee a smooth, safe launch off the Moon.",
      costText: "+10% Power | +5 Science", power: 10, water: -5, health: 0, science: 5,
      evalTitle: "Safe Departure!",
      evalMsg: "You played it safe with plenty of battery power for liftoff, sending a smaller summary packet of data to Earth.",
      fact: "Fun Space Fact: Launching off the Moon takes much less fuel than launching from Earth because the Moon's gravity is only one-sixth as strong!"
    }
  }
];
function getAstronautSVG(styleIdx, mood, suitColor) {
  let eyes = '<circle cx="29" cy="35" r="2.5" fill="#0f172a"/><circle cx="47" cy="35" r="2.5" fill="#0f172a"/>';
  let mouth = '<path d="M30 44 Q38 51 46 44" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  let sweat = '';
  let hair = '';

  if (styleIdx === 0) hair = '<path d="M21 29 Q24 19 38 19 Q52 19 55 29 Q46 24 38 25 Q30 24 21 29" fill="#451a03"/>';
  else if (styleIdx === 1) hair = '<path d="M22 28 L27 20 L33 25 L38 19 L43 25 L49 20 L54 28 Z" fill="#1e293b"/>';
  else hair = '<circle cx="23" cy="23" r="5" fill="#7c2d12"/><circle cx="53" cy="23" r="5" fill="#7c2d12"/><path d="M22 28 Q38 20 54 28" fill="#7c2d12"/>';

  if (mood === "warn") {
    mouth = '<line x1="30" y1="45" x2="46" y2="45" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>';
    sweat = '<path d="M55 24 Q58 30 55 33 Q52 30 55 24" fill="#38bdf8"/>';
  } else if (mood === "bad") {
    eyes = '<path d="M26 32 L32 38 M32 32 L26 38 M44 32 L50 38 M50 32 L44 38" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>';
    mouth = '<path d="M30 48 Q38 41 46 48" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  }

  return '<svg viewBox="0 0 76 76"><rect x="16" y="54" width="44" height="22" rx="10" fill="#e2e8f0" stroke="' + suitColor + '" stroke-width="3"/><circle cx="38" cy="36" r="24" fill="#f8fafc" stroke="' + suitColor + '" stroke-width="3.5"/><rect x="20" y="21" width="36" height="30" rx="13" fill="#fde68a"/>' + hair + eyes + mouth + sweat + '</svg>';
}

function initAvatarPickers() {
  const colors = ["#38bdf8", "#22c55e", "#facc15"];
  for (let slot = 0; slot < 3; slot++) {
    const container = document.getElementById("picker-" + (slot + 1));
    container.innerHTML = "";
    for (let st = 0; st < 3; st++) {
      const btn = document.createElement("div");
      btn.className = "av-opt" + (state.avatarStyles.at(slot) === st ? " selected" : "");
      btn.innerHTML = getAstronautSVG(st, "good", colors.at(slot));
      btn.onclick = function() {
        state.avatarStyles[slot] = st;
        initAvatarPickers();
      };
      container.appendChild(btn);
    }
  }
}

function showStatDelta(pillId, amount, suffix) {
  if (amount === 0) return;
  const pill = document.getElementById(pillId);
  const tag = document.createElement("span");
  tag.className = "stat-delta " + (amount > 0 ? "pos" : "neg");
  tag.textContent = (amount > 0 ? "+" : "") + amount + suffix;
  pill.appendChild(tag);
  setTimeout(function() { tag.remove(); }, 1650);
}

function renderCheckpoints() {
  const track = document.getElementById("checkpoint-track");
  track.innerHTML = '<span class="sol-label">SOL ' + state.sol + '/7</span>';
  for (let i = 1; i <= state.maxSols; i++) {
    const dot = document.createElement("div");
    dot.className = "cp-dot" + (i < state.sol ? " done" : i === state.sol ? " active" : "");
    track.appendChild(dot);
    if (i < state.maxSols) {
      const line = document.createElement("div");
      line.className = "cp-line" + (i < state.sol ? " done" : "");
      track.appendChild(line);
    }
  }
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
  if (state.oxygenSplit < 40) { warn.style.color = "#f87171"; warn.textContent = "DANGER: Too little Breathable Air! Crew will suffocate."; }
  else if (shieldSplit < 40) { warn.style.color = "#f87171"; warn.textContent = "DANGER: Thin Roof Shield! Crew is unsafe in solar storms."; }
  else { warn.style.color = "#cbd5e1"; warn.textContent = "Balanced: Crew can breathe easily and Roof Shield is active."; }
});

function updateCast(isCold) {
  const hps = [
    Math.max(0, Math.min(100, Math.round((state.health + state.power) / 2))),
    Math.max(0, Math.min(100, state.health)),
    Math.max(0, Math.min(100, Math.round((state.health + state.water) / 2)))
  ];
  const suitColors = ["#38bdf8", "#22c55e", "#facc15"];

  for (let i = 0; i < 3; i++) {
    const num = i + 1;
    const hp = hps.at(i);
    const bar = document.getElementById("crew-bar-" + num);
    const avatar = document.getElementById("crew-avatar-" + num);
    const card = document.getElementById("actor-card-" + num);
    const st = state.avatarStyles.at(i);

    bar.style.width = hp + "%";
    card.className = isCold ? "actor-card shivering" : "actor-card";

    if (hp <= 35) { bar.style.background = "#ef4444"; avatar.innerHTML = getAstronautSVG(st, "bad", "#ef4444"); }
    else if (hp <= 70) { bar.style.background = "#facc15"; avatar.innerHTML = getAstronautSVG(st, "warn", "#facc15"); }
    else { bar.style.background = "#22c55e"; avatar.innerHTML = getAstronautSVG(st, "good", suitColors.at(i)); }
  }
}
function renderGame() {
  renderCheckpoints();
  document.getElementById("power-val").textContent = Math.max(0, state.power) + "%";
  document.getElementById("water-val").textContent = Math.max(0, state.water) + "%";
  document.getElementById("science-val").textContent = state.science + " pts";
  document.getElementById("best-val").textContent = state.bestScore + " pts";

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
  btnA.innerHTML = "<strong>" + ev.choiceA.label + "</strong><span class='choice-desc'>" + ev.choiceA.desc + "</span><span class='choice-cost'>" + ev.choiceA.costText + "</span>";
  btnB.innerHTML = "<strong>" + ev.choiceB.label + "</strong><span class='choice-desc'>" + ev.choiceB.desc + "</span><span class='choice-cost'>" + ev.choiceB.costText + "</span>";
  btnA.onclick = function() { handleChoice(ev.choiceA, ev.isStorm); };
  btnB.onclick = function() { handleChoice(ev.choiceB, ev.isStorm); };
}

function handleChoice(choice, isStorm) {
  const shieldSplit = 100 - state.oxygenSplit;
  const netPower = choice.power - 10;
  const netWater = choice.water - 8;
  let extraWarning = "";

  state.power += netPower;
  state.water += netWater;
  state.health += choice.health;
  state.science = Math.max(0, state.science + choice.science);

  showStatDelta("pill-power", netPower, "%");
  showStatDelta("pill-water", netWater, "%");
  showStatDelta("pill-science", choice.science, " pts");

  if (state.oxygenSplit < 40) {
    state.health -= 15;
    extraWarning += " However, because you set Breathable Air below 40%, the air grew too thin and your crew lost health!";
  }
  if (isStorm && shieldSplit < 60) {
    state.health -= 25;
    extraWarning += " Oh no! Because your Roof Shield was below 60%, solar storm radiation struck the habitat!";
  } else if (isStorm) {
    extraWarning += " Awesome job keeping your Roof Water Shield at 60% or higher! It blocked the solar storm rays.";
  }

  if (state.water <= 0) state.failReason = "your Water Tank ran completely dry, leaving no water to drink or convert into breathable air.";
  else if (state.power <= 0) state.failReason = "your Power Reserve hit 0%, shutting down the base heaters and air pumps in the freezing lunar cold.";
  else if (state.health <= 0 && state.oxygenSplit < 40) state.failReason = "the air inside the base became unbreathable because too little water was sent to the Air Maker.";
  else if (state.health <= 0) state.failReason = "dangerous solar storm radiation pierced your thin roof shield and caused radiation sickness.";

  state.pendingGameOver = (state.power <= 0 || state.water <= 0 || state.health <= 0);
  renderGame();

  const nextLabel = state.pendingGameOver ? "See Mission Report" : (state.sol >= state.maxSols ? "Finish Mission" : "Continue to Sol " + (state.sol + 1));
  document.getElementById("next-sol-btn").textContent = nextLabel;
  document.getElementById("eval-title").textContent = choice.evalTitle;
  document.getElementById("eval-text").textContent = choice.evalMsg + extraWarning;
  document.getElementById("eval-fact").textContent = choice.fact;
  document.getElementById("eval-modal").classList.remove("hidden");
}

document.getElementById("next-sol-btn").onclick = function() {
  document.getElementById("eval-modal").classList.add("hidden");
  if (state.pendingGameOver) { showDebrief(false); return; }
  if (state.sol >= state.maxSols) { showDebrief(true); return; }
  state.sol += 1;
  renderGame();
};

function showDebrief(survived) {
  const modal = document.getElementById("debrief-modal");
  const title = document.getElementById("debrief-title");
  const story = document.getElementById("debrief-story");
  modal.classList.remove("hidden");

  if (!survived) {
    title.textContent = "Oh No! Emergency Rescue Triggered!";
    title.style.color = "#ef4444";
    story.innerHTML = "Oh no! You ran out of life support on <b>Sol " + state.sol + "</b> because <b>" + state.failReason + "</b><br><br>" +
      "Because you had to evacuate early, <b>you failed to retrieve your research data from space</b>. However, at least you learned how balancing water between breathable air and roof shields keeps astronauts alive! You survived <b>" + (state.sol - 1) + " full Sols</b> on the Moon.";
  } else if (state.science >= 50) {
    if (state.science > state.bestScore) {
      state.bestScore = state.science;
      localStorage.setItem("lunarBestScore", String(state.bestScore));
    }
    title.textContent = "Mission Accomplished, Flight Director!";
    title.style.color = "#22c55e";
    story.innerHTML = "Incredible work! Your crew survived all <b>7 Sols</b> at Shackleton Crater and gathered <b>" + state.science + " Science Points</b> (Personal Best: <b>" + state.bestScore + " pts</b>)!<br><br>" +
      "Your rescue rocket has lifted off safely, and <b>you successfully retrieved valuable Moon data from space and brought it back to Earth to be researched!</b>";
  } else {
    title.textContent = "Crew Safe, Not Enough Research!";
    title.style.color = "#facc15";
    story.innerHTML = "Your crew survived all <b>7 Sols</b> on the Moon, and everyone made it onto the rescue rocket safely! However, you only collected <b>" + state.science + " out of 50 Science Points</b>.<br><br>" +
      "Because your batteries and tanks ran too low to finish your experiments, <b>you failed to retrieve enough research data from space</b> for scientists on Earth.";
  }
}

document.getElementById("to-tutorial-btn").onclick = function() {
  const n1 = document.getElementById("input-crew-1").value.trim();
  const n2 = document.getElementById("input-crew-2").value.trim();
  const n3 = document.getElementById("input-crew-3").value.trim();
  state.crewNames = [
    n1 ? "Commander " + n1 : "Commander Maya",
    n2 ? "Engineer " + n2 : "Engineer Leo",
    n3 ? "Botanist " + n3 : "Botanist Sam"
  ];
  for (let i = 0; i < 3; i++) {
    document.getElementById("crew-name-" + (i + 1)).textContent = state.crewNames.at(i);
  }
  document.getElementById("setup-modal").classList.add("hidden");
  document.getElementById("tutorial-modal").classList.remove("hidden");
  renderGame();
};

document.getElementById("start-mission-btn").onclick = function() { document.getElementById("tutorial-modal").classList.add("hidden"); };
document.getElementById("open-help-btn").onclick = function() { document.getElementById("tutorial-modal").classList.remove("hidden"); };
document.getElementById("judge-modal-btn").onclick = function() { document.getElementById("judge-modal").classList.remove("hidden"); };
document.getElementById("close-judge-btn").onclick = function() { document.getElementById("judge-modal").classList.add("hidden"); };

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

document.getElementById("restart-btn").onclick = function() {
  state = { sol: 1, maxSols: 7, power: 80, water: 80, health: 100, science: 0, oxygenSplit: 50, bestScore: state.bestScore, crewNames: state.crewNames, avatarStyles: state.avatarStyles, liveMode: state.liveMode, liveFlareLabel: state.liveFlareLabel, failReason: "", pendingGameOver: false };
  waterSlider.value = 50;
  waterSlider.dispatchEvent(new Event("input"));
  document.getElementById("debrief-modal").classList.add("hidden");
  renderGame();
};

initAvatarPickers();
renderGame();
