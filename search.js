(() => {
  const input = document.getElementById("search");
  const cardsContainer = document.getElementById("cards");
  const empty = document.getElementById("empty");
  const status = document.getElementById("search-status");
  const articles = Array.isArray(window.ARCHIVE_ARTICLES) ? window.ARCHIVE_ARTICLES : [];

  if (!input || !cardsContainer) return;

  const normalize = value => String(value || "")
    .toLocaleLowerCase("ru")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ё/g, "е")
    .trim();

  function createCard(article) {
    const card = document.createElement("article");
    card.className = "card";

    const art = document.createElement("div");
    art.className = "art";
    art.setAttribute("aria-hidden", "true");
    art.textContent = "✦";

    const body = document.createElement("div");
    body.className = "card-body";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = article.category || "Без категории";

    const title = document.createElement("h3");
    title.textContent = article.title || "Без названия";

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = [article.date, article.newspaper].filter(Boolean).join(" · ");

    const summary = document.createElement("p");
    summary.textContent = article.summary || "";

    const link = document.createElement("a");
    link.className = "read";
    link.href = article.url || "#about";
    link.textContent = "Открыть материал →";

    body.append(category, title, meta, summary, link);
    card.append(art, body);
    return card;
  }

  function render() {
    const query = normalize(input.value);
    const terms = query.split(/\s+/).filter(Boolean);

    const results = articles.filter(article => {
      const haystack = normalize([
        article.title, article.category, article.newspaper, article.date,
        article.summary, article.keywords, article.fullText
      ].join(" "));
      return terms.every(term => haystack.includes(term));
    });

    cardsContainer.replaceChildren(...results.map(createCard));
    empty.hidden = results.length !== 0;
    if (!query) {
      status.textContent = `В архиве материалов: ${articles.length}. Показаны все материалы.`;
    } else {
      status.textContent = `Найдено материалов: ${results.length}.`;
    }
  }

  input.addEventListener("input", render);
  render();
})();