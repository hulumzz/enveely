// Enveely — Builder styles (exported as a JS string so the builder page can
// inject them scoped with the page; keeps Product UI CSS out of the main
// bundle for visitors who never open the editor).

export const builderCss = `
.builder {
  display: grid;
  grid-template-columns: 240px 1fr 340px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "top top top"
    "nav canvas props";
  height: calc(100vh - var(--navbar-h));
  background: linear-gradient(180deg, var(--surface) 0%, var(--surface-soft) 100%);
}

/* ---------- Top bar ---------- */
.builder__top {
  grid-area: top;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-3) var(--sp-5);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 5;
}
.builder__logo {
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  text-decoration: none;
  color: var(--text);
  font-size: 1.15rem;
}
.builder__title {
  font-size: var(--fs-body-s);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}
.builder__save {
  font-size: var(--fs-caption);
  color: var(--success);
  min-width: 110px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.builder__save::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 22%, transparent);
}
.builder__top-actions {
  margin-inline-start: auto;
  display: flex;
  gap: var(--sp-2);
}
.btn--ai { background: #2d2520; color: #f8efe7; border-color: #2d2520; }
.btn--ai:hover { background: #4a392f; border-color: #4a392f; }

/* ---------- Section navigator (kiri) ---------- */
.builder__nav {
  grid-area: nav;
  overflow-y: auto;
  padding: var(--sp-5) var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid var(--border);
  background: var(--surface);
}
.builder__nav-head {
  font-family: var(--font-sans);
  font-size: var(--fs-caption);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: var(--sp-3);
  padding-inline: var(--sp-2);
}
.bnav__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-3);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  font-size: var(--fs-body-s);
  color: var(--text-soft);
  cursor: pointer;
  text-align: left;
  font-weight: 500;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease;
}
.bnav__item:hover { background: var(--surface-soft); color: var(--text); transform: translateX(2px); }
.bnav__item.is-active {
  background: linear-gradient(95deg, var(--accent-soft) 0%, transparent 100%);
  color: var(--accent);
  font-weight: 700;
  border-color: color-mix(in srgb, var(--accent) 30%, transparent);
  padding-inline-start: var(--sp-4);
}
.bnav__item.is-active::before {
  content: '';
  width: 4px;
  height: 18px;
  border-radius: 2px;
  background: var(--accent);
  margin-inline-start: -10px;
}
.bnav__item.is-off { opacity: 0.45; text-decoration: line-through; }
.bnav__eye {
  font-size: 0.85rem;
  opacity: 0.7;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  transition: background 160ms ease;
}
.bnav__eye:hover { background: var(--surface); opacity: 1; }

/* ---------- Canvas ---------- */
.builder__canvas-wrap {
  grid-area: canvas;
  overflow: auto;
  padding: var(--sp-6);
  display: grid;
  align-content: start;
  background:
    radial-gradient(60% 40% at 50% 0%, rgba(193, 163, 122, 0.12), transparent),
    repeating-linear-gradient(45deg, transparent 0 12px, rgba(0,0,0,0.012) 12px 24px);
}
.builder__canvas {
  margin-inline: auto;
  width: 100%;
  max-width: 440px;
}
.builder__frame {
  border-radius: var(--radius-xl);
  box-shadow: 0 28px 80px rgba(39, 35, 33, 0.16);
  overflow: hidden;
  background: #fff;
  position: relative;
}
.builder__frame::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-xl);
  background: linear-gradient(180deg, transparent, rgba(193, 163, 122, 0.18));
  z-index: -1;
  filter: blur(20px);
}

/* Selected section highlight inside the live invitation */
.builder__device .sec {
  cursor: pointer;
  transition: box-shadow 160ms ease, outline 160ms ease;
  outline: 0 dashed transparent;
  outline-offset: -6px;
}
.builder__device .sec:hover {
  box-shadow: inset 0 0 0 2px rgba(139, 111, 90, 0.32);
}

/* ---------- Property panel (kanan) ---------- */
.builder__props {
  grid-area: props;
  overflow-y: auto;
  padding: var(--sp-5);
  border-left: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.builder__props-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: var(--sp-3);
  border-bottom: 1px solid var(--border);
}
.builder__props-head-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
}
.builder__props-head-text {
  display: grid;
  gap: 2px;
}
.builder__props-head-text strong {
  font-size: var(--fs-body-s);
  color: var(--text);
  font-weight: 700;
  letter-spacing: 0.02em;
}
.builder__props-head-text small {
  font-size: var(--fs-caption);
  color: var(--muted);
}
.builder__props-ai { margin-left: auto; color: var(--accent); font-size: .68rem; text-align: right; max-width: 110px; line-height: 1.35; }

.bprops__group {
  display: grid;
  gap: var(--sp-3);
  padding: var(--sp-4);
  background: var(--surface-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}
.bprops__group + .bprops__group { margin-top: 0; }

.bprops__title {
  font-family: var(--font-sans);
  font-size: var(--fs-body-s);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.bprops__title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: var(--accent);
  border-radius: 2px;
}
.bprops__hint {
  font-size: var(--fs-caption);
  color: var(--muted);
  background: var(--surface);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px dashed var(--border);
  line-height: 1.55;
}
.bprops__sep { border: 0; border-top: 1px dashed var(--border); margin-block: var(--sp-2); }

/* Fields */
.fld-ui { display: grid; gap: 6px; font-size: var(--fs-body-s); }
.fld-ui > span {
  color: var(--text-soft);
  font-weight: 600;
  font-size: var(--fs-body-s);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.fld-ui input,
.fld-ui textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  background: var(--surface);
  font: inherit;
  color: var(--text);
  transition: border-color 180ms ease, box-shadow 180ms ease;
}
.field-suggest { justify-self: start; padding: 0; border: 0; background: transparent; color: var(--accent); font: inherit; font-size: .72rem; cursor: pointer; }
.field-suggest:hover { text-decoration: underline; text-underline-offset: 3px; }
.field-suggest:disabled { color: var(--muted); cursor: wait; text-decoration: none; }
.fld-ui input:hover,
.fld-ui textarea:hover {
  border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
}
.fld-ui input:focus-visible,
.fld-ui textarea:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
}
.fld-ui--sm input { padding: 8px 10px; }
.form-row { display: grid; gap: var(--sp-3); }
.form-row--2 { grid-template-columns: 1fr 1fr; }
.text-link {
  background: none;
  border: 0;
  padding: 0;
  color: var(--accent);
  font-size: var(--fs-caption);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Photo slot control — lebih besar dan intuitif */
.photo-slot {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3);
  background: var(--surface);
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-md);
  transition: border-color 180ms ease, background 180ms ease;
}
.photo-slot:hover {
  border-color: var(--accent);
  background: var(--surface);
}
.photo-slot__thumb {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--surface-soft);
  border: 1px solid var(--border);
  font-size: 0.7rem;
  color: var(--muted);
  flex: none;
}
.photo-slot__thumb img { width: 100%; height: 100%; object-fit: cover; }
.photo-slot__actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: var(--fs-caption);
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
  width: 100%;
}
.upload-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.upload-btn--primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.upload-btn--primary:hover { filter: brightness(1.05); color: #fff; }
.upload-btn.is-busy { opacity: 0.6; pointer-events: none; }

/* Events editor */
.bevents {
  display: grid;
  gap: var(--sp-4);
}
.bevent {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  display: grid;
  gap: var(--sp-3);
  background: var(--surface);
  position: relative;
}
.bevent::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 50%);
  pointer-events: none;
}
.bevent > * { position: relative; }
.bevent__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed var(--border);
}
.bevent__head strong {
  font-family: var(--font-display);
  font-size: 1.05rem;
}
.icon-btn {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--muted);
  font-size: 0.85rem;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: background 160ms ease, color 160ms ease;
}
.icon-btn:hover {
  background: color-mix(in srgb, var(--error) 12%, transparent);
  color: var(--error);
}
.bevent-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--sp-3);
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-soft);
  font-weight: 600;
  cursor: pointer;
  transition: all 160ms ease;
  width: 100%;
}
.bevent-add:hover {
  border-color: var(--accent);
  border-style: solid;
  background: var(--accent-soft);
  color: var(--accent);
}

/* Gallery manager */
.bgallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
}
.bgallery__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-size: var(--fs-caption);
  color: var(--muted);
}
.bgallery__meta strong { color: var(--accent); letter-spacing: .03em; }
.bgallery__item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
}
.bgallery__item img { width: 100%; height: 100%; object-fit: cover; }
.bgallery .icon-btn--danger {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--error);
  border-radius: var(--radius-pill);
  font-size: 0.7rem;
  padding: 4px 8px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.upload-drop {
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  gap: 6px;
  padding: var(--sp-6);
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-md);
  color: var(--text-soft);
  font-size: var(--fs-body-s);
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  background: var(--surface);
}
.upload-drop:hover {
  border-color: var(--accent);
  border-style: solid;
  background: var(--accent-soft);
  color: var(--accent);
  transform: translateY(-2px);
}
.upload-drop strong {
  display: block;
  font-size: var(--fs-body-s);
}
.upload-drop small {
  font-weight: 400;
  font-size: var(--fs-caption);
  color: var(--muted);
}
.upload-drop.is-busy {
  opacity: 0.6;
  pointer-events: none;
}

/* Story items (list editor) */
.bstory { display: grid; gap: var(--sp-3); }
.bstory__item {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  display: grid;
  gap: var(--sp-3);
  background: var(--surface);
}
.bstory__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed var(--border);
}
.bstory__head strong {
  font-family: var(--font-display);
  font-size: 1.05rem;
}

/* Gift accounts (list editor) */
.bgift-accounts { display: grid; gap: var(--sp-3); }
.bgift-account {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  display: grid;
  gap: var(--sp-2);
  background: var(--surface);
}
.bgift-account__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed var(--border);
}
.bgift-account__head strong {
  font-family: var(--font-display);
  font-size: 1rem;
}

/* Textarea inputs (welcome/closing/story) */
.fld-ui textarea {
  resize: vertical;
  min-height: 76px;
  line-height: 1.5;
}

/* Local-preview badge in builder (status panel / canvas) */
.bgallery__item { position: relative; }
.bgallery__item .bgallery__uploading {
  position: absolute;
  inset: auto 4px 4px auto;
  background: rgba(39, 35, 33, 0.78);
  color: #fff;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.bgallery__item .bgallery__uploading::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--warning, #f0a500);
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Toggle row for checkboxes */
.fld-ui--check {
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--surface);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 160ms ease;
}
.fld-ui--check:hover { border-color: var(--accent); }
.fld-ui--check input {
  width: 36px;
  height: 20px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--border);
  border-radius: var(--radius-pill);
  position: relative;
  cursor: pointer;
  transition: background 200ms ease;
}
.fld-ui--check input::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 200ms var(--ease-out);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.fld-ui--check input:checked {
  background: var(--accent);
}
.fld-ui--check input:checked::before {
  transform: translateX(16px);
}
.fld-ui--check > span {
  font-weight: 600;
  color: var(--text);
}

/* Publish checklist + share modal extras */
.publish-checks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.publish-checks li {
  font-size: var(--fs-body-s);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  border: 1px solid var(--border);
}
.publish-checks li.ok { border-color: color-mix(in srgb, var(--success) 40%, var(--border)); color: var(--success); }
.publish-checks li.warn { border-color: color-mix(in srgb, var(--warning) 40%, var(--border)); color: var(--warning); }
.publish-checks li.bad { border-color: color-mix(in srgb, var(--error) 40%, var(--border)); color: var(--error); }
.publish-checks li.ok::before,
.publish-checks li.warn::before,
.publish-checks li.bad::before {
  content: '';
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
}
.publish-checks li.ok::before { content: '✓'; }
.publish-checks li.warn::before { content: '!'; }
.publish-checks li.bad::before { content: '✕'; }

.share-actions { display: flex; flex-wrap: wrap; gap: var(--sp-2); }

/* ---------- Responsive builder ---------- */
@media (max-width: 1200px) {
  .builder {
    grid-template-columns: 200px 1fr 320px;
  }
}
@media (max-width: 1024px) {
  .builder {
    grid-template-columns: 56px 1fr 300px;
  }
  .builder__nav { padding: var(--sp-4) var(--sp-2); }
  .bnav__item { padding-inline: var(--sp-2); justify-content: center; }
  .bnav__item span:first-child { display: none; }
  .bnav__item.is-active::before { display: none; }
  .builder__nav-head { text-align: center; font-size: 0.65rem; }
}
@media (max-width: 820px) {
  .builder {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(380px, 56vh) auto;
    grid-template-areas: "top" "canvas" "props";
    height: auto;
  }
  .builder__nav {
    position: sticky;
    top: var(--navbar-h);
    z-index: 60;
    flex-direction: row;
    overflow-x: auto;
    border-right: 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: var(--sp-2) var(--sp-3);
    gap: var(--sp-2);
  }
  .builder__nav-head { display: none; }
  .bnav__item { flex: none; padding: var(--sp-2) var(--sp-3); }
  .bnav__item span:first-child { display: inline; }
  .builder__canvas-wrap { padding: var(--sp-3); }
  .builder__props { border-left: 0; border-top: 1px solid var(--border); }
}
`;
