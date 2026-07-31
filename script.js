const views = {
  access: {
    label: "Connected",
    title: "Online, but still blocked",
    description:
      "The person can open an online job application, but several barriers still prevent them from submitting it.",
    statuses: [
      ["Yes", "Reliable internet"],
      ["No", "Appropriate device"],
      ["No", "Digital confidence"],
      ["No", "Accessible website"],
      ["No", "Technical support"],
    ],
    result: "Result: The task is not completed.",
    resultClass: "result-blocked",
  },
  included: {
    label: "Included",
    title: "Supported and able to participate",
    description:
      "The person has the connection, tools, skills, accessible design, and support needed to complete the same task.",
    statuses: [
      ["Yes", "Reliable internet"],
      ["Yes", "Appropriate device"],
      ["Yes", "Digital confidence"],
      ["Yes", "Accessible website"],
      ["Yes", "Technical support"],
    ],
    result: "Result: The task can be completed independently.",
    resultClass: "result-complete",
  },
};

const buttons = document.querySelectorAll("[data-view]");
const panelLabel = document.querySelector("[data-panel-label]");
const panelTitle = document.querySelector("[data-panel-title]");
const panelDescription = document.querySelector("[data-panel-description]");
const statusList = document.querySelector("[data-status-list]");
const result = document.querySelector("[data-result]");

function showView(viewName) {
  const view = views[viewName];

  buttons.forEach((button) => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  panelLabel.textContent = view.label;
  panelTitle.textContent = view.title;
  panelDescription.textContent = view.description;

  statusList.innerHTML = view.statuses
    .map(([state, label]) => {
      const stateClass = state === "Yes" ? "yes" : "no";
      return `<li><span class="status ${stateClass}">${state}</span>${label}</li>`;
    })
    .join("");

  result.className = `result ${view.resultClass}`;
  result.textContent = view.result;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});
