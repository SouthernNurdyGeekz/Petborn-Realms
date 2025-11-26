
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const realmCards = document.querySelectorAll(".realm-card");
  const realmDetail = document.getElementById("realm-detail");

  realmCards.forEach((card) => {
    card.addEventListener("click", () => {
      realmCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      const name = card.dataset.realm || "Unknown Realm";
      const description =
        card.dataset.description ||
        "This realm's story has not yet been written.";

      if (realmDetail) {
        const titleEl = realmDetail.querySelector("h3");
        const bodyEl = realmDetail.querySelector("p");

        if (titleEl) titleEl.textContent = `${name} Realm`;
        if (bodyEl) bodyEl.textContent = description;
      }
    });
  });
});
