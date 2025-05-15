document.addEventListener("DOMContentLoaded", () => {
  const filtersContainer = document.getElementById("filters-scroll");
  const scrollLeftBtn = document.getElementById("scroll-left");
  const scrollRightBtn = document.getElementById("scroll-right");

  function checkScrollButtons() {
    const maxScrollLeft = filtersContainer.scrollWidth - filtersContainer.clientWidth;
    scrollLeftBtn.disabled = filtersContainer.scrollLeft <= 0;
    scrollRightBtn.disabled = filtersContainer.scrollLeft >= maxScrollLeft - 1;
  }

  function scrollFilters(direction) {
    const scrollAmount = filtersContainer.clientWidth / 2;
    filtersContainer.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  }

  scrollLeftBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollFilters(-1);
  });

  scrollRightBtn.addEventListener("click", (e) => {
    e.preventDefault();
    scrollFilters(1);
  });

  filtersContainer.addEventListener("scroll", checkScrollButtons);
  window.addEventListener("resize", checkScrollButtons);

  checkScrollButtons();
});
