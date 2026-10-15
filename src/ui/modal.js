export function openModal(scene, type) {
  scene.isModalOpen = true;

  const modal = document.getElementById("portfolio-modal");
  const aboutView = document.getElementById("about-view");
  const projectsView = document.getElementById("projects-view");
  const contactView = document.getElementById("contact-view");

  if (!modal || !aboutView || !projectsView || !contactView) return;

  aboutView.classList.add("hidden");
  projectsView.classList.add("hidden");
  contactView.classList.add("hidden");

  if (type === "about") {
    aboutView.classList.remove("hidden");
  } else if (type === "projects") {
    projectsView.classList.remove("hidden");
  } else if (type === "contact") {
    contactView.classList.remove("hidden");
  }

  modal.classList.remove("hidden");
}

export function closeModal(scene) {
  scene.isModalOpen = false;

  const modal = document.getElementById("portfolio-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

export function setupModalEvents(scene) {
  const closeBtn = document.getElementById("close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal(scene);
    });
  }

  const modal = document.getElementById("portfolio-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(scene);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc") closeModal(scene);
  });
}
