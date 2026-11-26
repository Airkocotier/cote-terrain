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

  const accueil = document.querySelector(".ouverture");
  if (!accueil) return;                       // neige, traîneau et lutin : seulement sur la page d'accueil

  // ❄️ La neige, sur le grand bandeau seulement, avec un bouton pour l'arrêter
  const bouton = document.createElement("button");
  bouton.type = "button"; bouton.className = "noel-neige";
  accueil.appendChild(bouton);
  let canvas = null, raf = 0;
  const neige = on => {
    bouton.textContent = on ? "❄ Neige : oui" : "❄ Neige : non";
    bouton.setAttribute("aria-pressed", on ? "true" : "false");
    cancelAnimationFrame(raf); if (canvas) { canvas.remove(); canvas = null; }
    if (!on || calme) return;
    canvas = document.createElement("canvas"); canvas.className = "noel-flocons"; canvas.setAttribute("aria-hidden", "true");
    accueil.prepend(canvas);
    const x = canvas.getContext("2d");
    const taille = () => { const r = devicePixelRatio || 1; canvas.width = accueil.clientWidth * r; canvas.height = accueil.clientHeight * r; x.setTransform(r, 0, 0, r, 0, 0); };
    taille(); addEventListener("resize", taille);
    const W = () => accueil.clientWidth, Hh = () => accueil.clientHeight;
    const f = Array.from({length:55}, () => ({x:Math.random() * W(), y:Math.random() * Hh(), r:1.2 + Math.random() * 2.6, v:16 + Math.random() * 30, p:Math.random() * 6.3}));
    let t0 = performance.now();
    const pas = now => {
      raf = requestAnimationFrame(pas);
      const dt = Math.min(.1, (now - t0) / 1000); if (dt < 1 / 32) return; t0 = now;
      x.clearRect(0, 0, W(), Hh()); x.fillStyle = "rgba(255,255,255,.85)";
      for (const s of f) {
        s.y += s.v * dt; s.p += dt; s.x += Math.sin(s.p) * 12 * dt;
        if (s.y > Hh() + 4) { s.y = -4; s.x = Math.random() * W(); }
        x.beginPath(); x.arc(s.x, s.y, s.r, 0, 6.283); x.fill();
      }
    };
    raf = requestAnimationFrame(pas);
  };
  let actif = mem("ctNeige") !== "non";
  neige(actif);
  bouton.addEventListener("click", () => { actif = !actif; mem("ctNeige", actif ? "oui" : "non"); neige(actif); });
  if (calme) bouton.hidden = true;

  // 🛷 Le traîneau : traverse le haut de la page une fois par visite
  let vu = null; try { vu = sessionStorage.getItem("ctTraineau"); sessionStorage.setItem("ctTraineau", "1"); } catch (e) {}
  if (!vu && !calme) setTimeout(() => {
    const renne = dx => `<g transform="translate(${dx} 0)"><path d="M6 22 L10 34 M14 22 L12 34 M26 22 L24 34 M32 22 L36 34" stroke="#5A3A22" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="20" cy="20" rx="15" ry="7" fill="#8B5A33"/><path d="M33 16 L38 8 L44 10 L40 17 Z" fill="#8B5A33"/><circle cx="43.5" cy="10.5" r="1.6" fill="#3B2618"/><path d="M37 8 L35 1 M35 4 L31 2 M39 8 L41 1 M40.5 4 L44 2" stroke="#5A3A22" stroke-width="1.6" stroke-linecap="round"/></g>`;
    const el = document.createElement("div"); el.className = "noel-traineau"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = `<svg width="190" height="44" viewBox="0 0 190 44"><path d="M58 22 L78 24 M60 26 L120 30" stroke="#B7A98F" stroke-width="1.2"/>${renne(64)}${renne(112)}<path d="M4 30 Q4 14 18 14 L48 14 L54 30 Z" fill="#C8352E"/><path d="M0 36 L56 36 Q62 36 62 31" stroke="#E8B730" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="14" y="4" width="14" height="11" rx="1.5" fill="#E8B730"/><rect x="20" y="4" width="2.4" height="11" fill="#C8352E"/><rect x="30" y="7" width="11" height="8" rx="1.5" fill="#fff"/><rect x="34.5" y="7" width="2" height="8" fill="#1F6B4A"/></svg>`;
    document.body.appendChild(el); setTimeout(() => el.remove(), 5000);
  }, 1200);

  // 🧝 Le lutin farceur : caché près d'un titre de la page, différent chaque jour
  const cachettes = ["#videos h2", "#telecharger h2", "#fonctions h2", "#merci h2", "#a-venir h2"].map(s => document.querySelector(s)).filter(Boolean);
  if (cachettes.length) {
    const n = [...(d.getFullYear() + "-" + m + "-" + day)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const ici = cachettes[n % cachettes.length];
    const phrases = ["Vous m'avez trouvé ! Les entraînements reprennent le 5 janvier.", "Chut… je surveille les réceptions.", "Bien joué ! Le Père Noël cherche un bon passeur.", "Vous m'avez trouvé ! Joyeuses fêtes, coach."];
    const l = document.createElement("button"); l.type = "button"; l.className = "noel-lutin"; l.title = "Tiens, un lutin…";
    l.innerHTML = `<svg viewBox="0 0 54 54" aria-hidden="true"><path d="M27 4 L40 22 L14 22 Z" fill="#C8352E"/><circle cx="27" cy="4" r="3.4" fill="#fff"/><path d="M12 30 L4 24 L13 27 Z M42 30 L50 24 L41 27 Z" fill="#F2C9A0"/><circle cx="27" cy="33" r="14" fill="#F6D2B0"/><rect x="11" y="19" width="32" height="6" rx="3" fill="#fff"/><circle cx="22" cy="31" r="1.8" fill="#2B1B12"/><circle cx="32" cy="31" r="1.8" fill="#2B1B12"/><path d="M22 39 Q27 43 32 39" stroke="#8A3B2A" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg><span class="noel-bulle" hidden></span>`;
    l.setAttribute("aria-label", "Un lutin caché : appuyez pour lui parler");
    ici.appendChild(l);
    l.addEventListener("click", () => { const b = l.querySelector(".noel-bulle"); b.textContent = "🧝 « " + phrases[n % phrases.length] + " »"; b.hidden = false; l.classList.add("trouve"); setTimeout(() => { b.hidden = true; }, 5000); });
  }
})();
