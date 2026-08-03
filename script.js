const header = document.querySelector("[data-header]");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const comparisonTabs = Array.from(
  document.querySelectorAll("[data-comparison-tab]"),
);
const comparisonPanels = Array.from(
  document.querySelectorAll("[data-comparison-panel]"),
);
const comparisonLive = document.querySelector("[data-comparison-live]");

const comparisonMessages = {
  access:
    "The connection works, but four other barriers still stop the person from finishing.",
  inclusion:
    "With all five parts in place, the person can finish the task with the support they need.",
};

function selectComparison(nextTab) {
  const nextView = nextTab.dataset.comparisonTab;

  comparisonTabs.forEach((tab) => {
    const isSelected = tab === nextTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  comparisonPanels.forEach((panel) => {
    const isSelected = panel.dataset.comparisonPanel === nextView;
    panel.classList.toggle("is-active", isSelected);
    panel.hidden = !isSelected;
  });

  if (comparisonLive) {
    comparisonLive.textContent = comparisonMessages[nextView];
  }
}

comparisonTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectComparison(tab));

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;

    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + comparisonTabs.length) % comparisonTabs.length;
    }

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % comparisonTabs.length;
    }

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = comparisonTabs.length - 1;

    const nextTab = comparisonTabs[nextIndex];
    selectComparison(nextTab);
    nextTab.focus();
  });
});

const pillarContent = {
  connection: {
    kicker: "Part 01",
    title: "Reliable connection",
    description:
      "People need internet service that is affordable, dependable, and strong enough for what they are trying to do.",
    present:
      "Learning, work, healthcare, and communication remain reachable.",
    missing: "People may ration data, lose work, or depend on public Wi-Fi.",
    action:
      "Offer affordable plans, stable service, and clear help with enrollment.",
  },
  device: {
    kicker: "Part 02",
    title: "Appropriate device",
    description:
      "A connection only goes so far when the available device cannot handle the task someone needs to complete.",
    present:
      "People can use software, upload files, and complete work without device limitations.",
    missing:
      "Old hardware, small screens, or shared devices turn ordinary tasks into obstacles.",
    action:
      "Support affordable ownership, repairs, and devices that match the person’s actual needs.",
  },
  skills: {
    kicker: "Part 03",
    title: "Skills and confidence",
    description:
      "Digital literacy includes learning unfamiliar tools, judging information, protecting privacy, and knowing what to try when something goes wrong.",
    present:
      "People can adapt to new systems and make informed choices online.",
    missing:
      "Confusing terms and unfamiliar screens can make people worried that one mistake will ruin the task.",
    action:
      "Offer patient, practical training that starts with the person’s goals and builds confidence over time.",
  },
  accessibility: {
    kicker: "Part 04",
    title: "Accessible design",
    description:
      "Websites, documents, apps, and kiosks need to work for people with different disabilities, devices, and ways of navigating.",
    present:
      "People can perceive information, navigate interfaces, and complete tasks independently.",
    missing:
      "A service may technically exist while remaining unusable to the people who need it.",
    action:
      "Build accessibility in from the beginning, test with real users, and write clear content.",
  },
  support: {
    kicker: "Part 05",
    title: "Human support",
    description:
      "Even confident users sometimes need help. Having a real person available can make unfamiliar technology less stressful and easier to learn.",
    present:
      "A person can ask questions, solve problems, and build independence without judgment.",
    missing:
      "One error or confusing screen can end the entire task when no help is available.",
    action:
      "Fund digital navigators, library help, community programs, and support based on real needs.",
  },
};

const pillarButtons = Array.from(document.querySelectorAll("[data-pillar]"));
const pillarDetail = document.querySelector("[data-pillar-detail]");

function renderPillar(name) {
  const content = pillarContent[name];
  if (!pillarDetail || !content) return;

  pillarButtons.forEach((button) => {
    const isSelected = button.dataset.pillar === name;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  pillarDetail.innerHTML = `
    <p class="detail-kicker">${content.kicker}</p>
    <h3>${content.title}</h3>
    <p class="detail-description">${content.description}</p>
    <div class="detail-grid">
      <div>
        <span class="detail-label">When it is present</span>
        <p>${content.present}</p>
      </div>
      <div>
        <span class="detail-label detail-label-warning">When it is missing</span>
        <p>${content.missing}</p>
      </div>
    </div>
    <p class="detail-action">
      <span>Program response</span>
      ${content.action}
    </p>
  `;
}

pillarButtons.forEach((button) => {
  button.addEventListener("click", () => renderPillar(button.dataset.pillar));
});

const supportButtons = Array.from(
  document.querySelectorAll("[data-support]:not([disabled])"),
);
const allSupportButtons = Array.from(
  document.querySelectorAll("[data-support]"),
);
const scenarioOutcome = document.querySelector("[data-scenario-outcome]");
const scenarioReset = document.querySelector("[data-scenario-reset]");
const scenarioAll = document.querySelector("[data-scenario-all]");

function updateScenario() {
  const activeCount = allSupportButtons.filter(
    (button) => button.getAttribute("aria-pressed") === "true",
  ).length;
  const isComplete = activeCount === allSupportButtons.length;
  const remaining = allSupportButtons.length - activeCount;
  const percentage = (activeCount / allSupportButtons.length) * 100;

  if (!scenarioOutcome) return;

  scenarioOutcome.classList.toggle("is-complete", isComplete);
  scenarioOutcome.classList.toggle("is-blocked", !isComplete);

  const progress = scenarioOutcome.querySelector(".outcome-progress span");
  const icon = scenarioOutcome.querySelector(".outcome-icon");
  const kicker = scenarioOutcome.querySelector(".context-label");
  const title = scenarioOutcome.querySelector("h3");
  const description = scenarioOutcome.querySelector("p:last-child");

  if (progress) {
    progress.style.setProperty("--progress", `${percentage}%`);
  }

  if (icon) icon.textContent = isComplete ? "✓" : "!";

  if (kicker) {
    kicker.textContent = `Program outcome · ${activeCount} of ${allSupportButtons.length} parts`;
  }

  if (title) {
    title.textContent = isComplete
      ? "Included and able to finish."
      : "Connected, but still stuck.";
  }

  if (description) {
    description.textContent = isComplete
      ? "With every part of the program in place, John can complete and submit the application with the support available."
      : `The connection works, but ${remaining} other ${
          remaining === 1 ? "barrier still keeps" : "barriers still keep"
        } John from finishing.`;
  }

  if (scenarioAll) {
    scenarioAll.hidden = isComplete;
  }
}

supportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const willBeOn = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(willBeOn));
    button.classList.toggle("is-on", willBeOn);
    updateScenario();
  });
});

scenarioReset?.addEventListener("click", () => {
  supportButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("is-on");
  });
  updateScenario();
  supportButtons[0]?.focus();
});

scenarioAll?.addEventListener("click", () => {
  supportButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "true");
    button.classList.add("is-on");
  });
  updateScenario();
  scenarioOutcome?.scrollIntoView({ behavior: "smooth", block: "center" });
});

updateScenario();

const statGrid = document.querySelector(".stat-grid");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (statGrid && "IntersectionObserver" in window && !reduceMotion) {
  const statObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25 },
  );

  statObserver.observe(statGrid);
} else {
  statGrid?.classList.add("is-visible");
}

const programChecklist = document.querySelector("[data-program-checklist]");
const programCheckResult = document.querySelector("[data-program-check-result]");
const programChecks = Array.from(
  programChecklist?.querySelectorAll('input[type="checkbox"]') ?? [],
);

function updateProgramCheck() {
  const selected = programChecks.filter((input) => input.checked).length;
  if (!programCheckResult) return;

  if (selected === programChecks.length && programChecks.length > 0) {
    programCheckResult.textContent =
      "5 of 5 commitments selected. This program plans for participation, not connection alone.";
    programCheckResult.classList.add("is-complete");
    return;
  }

  programCheckResult.textContent = `${selected} of ${programChecks.length} commitments selected. ${
    selected === 0
      ? "A connection alone is only the first step."
      : "There are still parts of the support system to build."
  }`;
  programCheckResult.classList.remove("is-complete");
}

programChecks.forEach((input) => {
  input.addEventListener("change", updateProgramCheck);
});

document.querySelector("[data-print-checklist]")?.addEventListener("click", () => {
  window.print();
});

updateProgramCheck();
