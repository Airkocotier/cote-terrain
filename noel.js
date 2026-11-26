/* =========================================================
   Côté Terrain — ambiance de Noël du site.
   Active du 20 novembre au 6 janvier, toute seule : le script regarde la date.
   En dehors de ces dates, il ne fait rien (pas besoin de republier le site pour l'enlever).
   Tout est dessiné en code (CSS + SVG + un petit canevas pour la neige) : aucune image à charger.
   ========================================================= */
(() => {
  const d = new Date(), m = d.getMonth(), day = d.getDate();
  if (!(m === 11 || (m === 10 && day >= 20) || (m === 0 && day < 7))) return;
  document.documentElement.classList.add("noel");
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;   // l'appareil demande moins d'animations
  const mem = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };

  // 🎅 Un bonnet sur le logo
  const marque = document.querySelector(".marque");
  if (marque) marque.insertAdjacentHTML("afterbegin", `<svg class="bonnet" viewBox="0 0 30 24" aria-hidden="true"><path d="M3 18 Q11 -2 23 6 L27 15 Z" fill="#C8352E"/><rect x="1" y="16" width="22" height="6" rx="3" fill="#fff" stroke="#E8DFCC"/><circle cx="27" cy="15" r="3" fill="#fff"/></svg>`);

  // 🎄 Message en bas de page
  const pied = document.querySelector("footer .large");
  if (pied) pied.insertAdjacentHTML("beforeend", `<span class="noel-voeux">🎄 Joyeuses fêtes et bonnes séances !</span>`);

  // ❄️ La neige : sur toute la page (derrière le texte) et, sur l'accueil, aussi sur le grand bandeau vert.
  // Un bouton pour l'arrêter (le choix est retenu pour tout le site).
  const accueil = document.querySelector(".ouverture");
  const bouton = document.createElement("button");
  bouton.type = "button"; bouton.className = "noel-neige fixe";
  document.body.appendChild(bouton);
  let couches = [];
  const couche = (zone, blanc, nb) => {                       // une « couche » de neige = un canevas + ses flocons
    const canvas = document.createElement("canvas"); canvas.className = "noel-flocons" + (zone ? "" : " page"); canvas.setAttribute("aria-hidden", "true");
    (zone || document.body).prepend(canvas);
    const x = canvas.getContext("2d");
    const W = () => zone ? zone.clientWidth : innerWidth, Hh = () => zone ? zone.clientHeight : innerHeight;
    const taille = () => { const r = devicePixelRatio || 1; canvas.width = W() * r; canvas.height = Hh() * r; x.setTransform(r, 0, 0, r, 0, 0); };
    taille(); addEventListener("resize", taille);
    const f = Array.from({length:nb}, () => ({x:Math.random() * W(), y:Math.random() * Hh(), r:1.2 + Math.random() * 2.6, v:16 + Math.random() * 30, p:Math.random() * 6.3}));
    let t0 = performance.now(), raf = 0;
    const pas = now => {
      raf = requestAnimationFrame(pas);
      const dt = Math.min(.1, (now - t0) / 1000); if (dt < 1 / 32) return; t0 = now;
      x.clearRect(0, 0, W(), Hh());
      for (const s of f) {
        s.y += s.v * dt; s.p += dt; s.x += Math.sin(s.p) * 12 * dt;
        if (s.y > Hh() + 4) { s.y = -4; s.x = Math.random() * W(); }
        x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.283);
        if (blanc) { x.fillStyle = "rgba(255,255,255,.85)"; x.fill(); }
        else { x.fillStyle = "rgba(150,180,206,.55)"; x.fill(); x.beginPath(); x.arc(s.x, s.y, s.r * .55, 0, 6.283); x.fillStyle = "#fff"; x.fill(); }   // bleu glacier : visible sur le fond crème
      }
    };
    raf = requestAnimationFrame(pas);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", taille); canvas.remove(); };
  };
  const neige = on => {
    bouton.textContent = on ? "❄ Neige : oui" : "❄ Neige : non";
    bouton.setAttribute("aria-pressed", on ? "true" : "false");
    couches.forEach(stop => stop()); couches = [];
    if (!on || calme) return;
    couches.push(couche(null, false, 45));
    if (accueil) couches.push(couche(accueil, true, 55));
  };
  let actif = mem("ctNeige") !== "non";
  neige(actif);
  bouton.addEventListener("click", () => { actif = !actif; mem("ctNeige", actif ? "oui" : "non"); neige(actif); });
  if (calme) bouton.hidden = true;

  // 🌲 Le logo et l'icône de l'onglet passent en version sapin
  const SAPIN = "data:image/png;base64,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";   // l'icône sapin (72 px), rangée ici pour n'avoir aucun fichier à ajouter
  const logo = document.querySelector(".marque img"); if (logo) logo.src = SAPIN;
  const fav = document.querySelector('link[rel="icon"]'); if (fav) fav.href = SAPIN;

  // 🦌 Sur le terrain de l'accueil, les joueurs ont des bois de renne (comme dans l'appli)
  const NS = "http://www.w3.org/2000/svg";
  document.querySelectorAll(".terrain .pion").forEach(g => {
    const c = g.querySelector("circle"); if (!c) return;
    const cx = +c.getAttribute("cx"), cy = +c.getAttribute("cy"), k = +c.getAttribute("r") / .42, fill = c.getAttribute("fill");
    const P = (a, b) => `${(cx + a * k).toFixed(1)},${(cy + b * k).toFixed(1)}`;
    let h = "";
    for (const sx of [-1, 1]) {
      const L = [[[sx * .17, -.3], [sx * .33, -.6], [sx * .44, -.86]], [[sx * .33, -.6], [sx * .6, -.68]], [[sx * .26, -.47], [sx * .1, -.7]]];
      for (const [w, col] of [[.15, "#fff"], [.085, "#7A4E2D"]]) for (const l of L) h += `<polyline points="${l.map(p => P(...p)).join(" ")}" fill="none" stroke="${col}" stroke-width="${(w * k).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round"/>`;
      h += `<polygon points="${[[sx * .27, -.25], [sx * .64, -.38], [sx * .42, -.05]].map(p => P(...p)).join(" ")}" fill="${fill}" stroke="#fff" stroke-width="${(.045 * k).toFixed(1)}"/>`;
    }
    const bois = document.createElementNS(NS, "g"); bois.setAttribute("class", "noel-bois"); bois.innerHTML = h; g.prepend(bois);
    const nez = document.createElementNS(NS, "circle"); nez.setAttribute("cx", cx); nez.setAttribute("cy", (cy + .74 * .42 * k).toFixed(1)); nez.setAttribute("r", (.085 * k).toFixed(1)); nez.setAttribute("fill", "#3B2618"); nez.setAttribute("class", "noel-nez"); g.appendChild(nez);
  });

  // 🎁 Une boule de Noël accrochée sous le titre de chaque partie (rouge, or ou vert, à tour de rôle)
  document.querySelectorAll(".bandeau").forEach((b, i) => {
    const col = ["#C8352E", "#E0A82E", "#1F6B4A"][i % 3];
    b.insertAdjacentHTML("afterbegin", `<svg class="noel-boule" viewBox="0 0 26 44" aria-hidden="true"><line x1="13" y1="0" x2="13" y2="14" stroke="#B7A98F" stroke-width="1.4"/><rect x="9" y="12" width="8" height="5" rx="1.2" fill="#C9A227"/><circle cx="13" cy="29" r="12" fill="${col}"/><path d="M2.5 27 Q13 33 23.5 27" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" fill="none"/><circle cx="9" cy="24" r="2.6" fill="#fff" fill-opacity=".6"/></svg>`);
  });

  // 🛷 Le traîneau : traverse le haut de la page une fois par visite
  let vu = null; try { vu = sessionStorage.getItem("ctTraineau"); sessionStorage.setItem("ctTraineau", "1"); } catch (e) {}
  if (!vu && !calme) setTimeout(() => {
    const renne = dx => `<g transform="translate(${dx} 0)"><path d="M6 22 L10 34 M14 22 L12 34 M26 22 L24 34 M32 22 L36 34" stroke="#5A3A22" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="20" cy="20" rx="15" ry="7" fill="#8B5A33"/><path d="M33 16 L38 8 L44 10 L40 17 Z" fill="#8B5A33"/><circle cx="43.5" cy="10.5" r="1.6" fill="#3B2618"/><path d="M37 8 L35 1 M35 4 L31 2 M39 8 L41 1 M40.5 4 L44 2" stroke="#5A3A22" stroke-width="1.6" stroke-linecap="round"/></g>`;
    const el = document.createElement("div"); el.className = "noel-traineau"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<svg width="190" height="44" viewBox="0 0 190 44"><path d="M58 22 L78 24 M60 26 L120 30" stroke="#B7A98F" stroke-width="1.2"/>${renne(64)}${renne(112)}<path d="M4 30 Q4 14 18 14 L48 14 L54 30 Z" fill="#C8352E"/><path d="M0 36 L56 36 Q62 36 62 31" stroke="#E8B730" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="14" y="4" width="14" height="11" rx="1.5" fill="#E8B730"/><rect x="20" y="4" width="2.4" height="11" fill="#C8352E"/><rect x="30" y="7" width="11" height="8" rx="1.5" fill="#fff"/><rect x="34.5" y="7" width="2" height="8" fill="#1F6B4A"/></svg>`;
    document.body.appendChild(el); setTimeout(() => el.remove(), 5000);
  }, 1200);

  // 🧝 Le lutin farceur : caché près d'un titre, à un endroit différent chaque jour (et sur chaque page)
  const cachettes = accueil ? ["#videos h2", "#telecharger h2", "#fonctions h2", "#merci h2", "#a-venir h2"].map(s => document.querySelector(s)).filter(Boolean)
    : [...document.querySelectorAll("main h2")];                                     // ailleurs : près d'un des titres de la page
  if (cachettes.length) {
    const n = [...(d.getFullYear() + "-" + m + "-" + day + location.pathname)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const ici = cachettes[n % cachettes.length];
    const phrases = ["Vous m'avez trouvé ! Les entraînements reprennent le 5 janvier.", "Chut… je surveille les réceptions.", "Bien joué ! Le Père Noël cherche un bon passeur.", "Vous m'avez trouvé ! Joyeuses fêtes, coach."];
    const l = document.createElement("button"); l.type = "button"; l.className = "noel-lutin"; l.title = "Tiens, un lutin…";
    l.innerHTML = `<svg viewBox="0 0 54 54" aria-hidden="true"><path d="M27 4 L40 22 L14 22 Z" fill="#C8352E"/><circle cx="27" cy="4" r="3.4" fill="#fff"/><path d="M12 30 L4 24 L13 27 Z M42 30 L50 24 L41 27 Z" fill="#F2C9A0"/><circle cx="27" cy="33" r="14" fill="#F6D2B0"/><rect x="11" y="19" width="32" height="6" rx="3" fill="#fff"/><circle cx="22" cy="31" r="1.8" fill="#2B1B12"/><circle cx="32" cy="31" r="1.8" fill="#2B1B12"/><path d="M22 39 Q27 43 32 39" stroke="#8A3B2A" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg><span class="noel-bulle" hidden></span>`;
    l.setAttribute("aria-label", "Un lutin caché : appuyez pour lui parler");
    ici.appendChild(l);
    l.addEventListener("click", () => { const b = l.querySelector(".noel-bulle"); b.textContent = "🧝 « " + phrases[n % phrases.length] + " »"; b.hidden = false; l.classList.add("trouve"); setTimeout(() => { b.hidden = true; }, 5000); });
  }
})();
