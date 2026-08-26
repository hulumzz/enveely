// Enveely — Builder styles (exported as a JS string so the builder page can
// inject them scoped with the page; keeps Product UI CSS out of the main
// bundle for visitors who never open the editor).

export const builderCss = `
.builder {
  display: grid;
  grid-template-columns: 220px 1fr 300px;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "top top top"
    "nav canvas props";
  height: calc(100vh - var(--navbar-h));
  background: var(--surface-soft);
}

/* ---------- Top bar ---------- */
.builder__top {
  grid-area: top;
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-3) var(--sp-5);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.builder__logo {
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  text-decoration: none;
  color: var(--text);
}
.builder__title {
  font-size: var(--fs-body-s);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.builder__save {
  font-size: var(--fs-caption);
  color: var(--success);
  min-width: 110px;
}
.builder__top-actions {
  margin-inline-start: auto;
  display: flex;
  gap: var(--sp-2);
}

/* ---------- Section navigator ---------- */
.builder__nav {
  grid-area: nav;
  overflow-y: auto;
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  border-right: 1px solid var(--border);
  background: var(--surface);
}
.bnav__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: var(--sp-2) var(--sp-3);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: var(--fs-body-s);
  color: var(--text-soft);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--dur-fast) ease, color var(--dur-fast) ease;
}
.bnav__item:hover { background: var(--surface-soft); color: var(--text); }
.bnav__item.is-active { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
.bnav__item.is-off { opacity: 0.45; }
.bnav__eye { font-size: 0.7rem; opacity: 0.8; }

/* ---------- Canvas ---------- */
.builder__canvas-wrap {
  grid-area: canvas;
  overflow: auto;
  padding: var(--sp-6);
  display: grid;
}
.builder__canvas { margin-inline: auto; width: 100%; max-width: 430px; }
.builder__frame {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-floating);
  overflow: hidden;
  background: #fff;
}

/* Selected section highlight inside the live invitation */
.builder__device .sec { cursor: pointer; transition: outline-color 120ms ease; outline: 0 solid transparent; }
.builder__device .sec:hover { box-shadow: inset 0 0 0 2px rgba(139, 111, 90, 0.25); }

/* ---------- Property panel ---------- */
.builder__props {
  grid-area: props;
  overflow-y: auto;
  padding: var(--sp-5);
  border-left: 1px solid var(--border);
  background: var(--surface);
}
.bprops__group { display: grid; gap: var(--sp-3); }
.bprops__title {
  font-family: var(--font-sans);
  font-size: var(--fs-body-s);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.bprops__hint { font-size: var(--fs-caption); color: var(--muted); }
.bprops__sep { border: 0; border-top: 1px dashed var(--border); margin-block: var(--sp-2); }

/* Fields (shared with create page) */
.fld-ui { display: grid; gap: 6px; font-size: var(--fs-body-s); }
.fld-ui > span { color: var(--text-soft); font-weight: 500; }
.fld-ui input, .fld-ui textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: #fff;
  font: inherit;
  color: var(--text);
}
.fld-ui input:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.fld-ui--sm input { padding: 8px 10px; }
.form-row { display: grid; gap: var(--sp-3); }
.form-row--2 { grid-template-columns: 1fr 1fr; }
.text-link { background: none; border: 0; padding: 0; color: var(--accent); font-size: var(--fs-caption); cursor: pointer; text-decoration: underline; }

/* Photo slot control */
.photo-slot { display: flex; align-items: center; gap: var(--sp-3); }
.photo-slot__thumb {
  width: 44px; height: 44px; border-radius: var(--radius-sm);
  overflow: hidden; display: grid; place-items: center;
  background: var(--surface-soft); border: 1px dashed var(--border);
  font-size: 0.65rem; color: var(--muted);
}
.photo-slot__thumb img { width: 100%; height: 100%; object-fit: cover; }
.upload-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: var(--radius-pill);
  border: 1px solid var(--border); background: #fff;
  font-size: var(--fs-caption); font-weight: 600; cursor: pointer;
}
.upload-btn--primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.upload-btn.is-busy { opacity: 0.6; pointer-events: none; }

/* Events editor */
.bevents { display: grid; gap: var(--sp-4); }
.bevent {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--sp-3);
  display: grid;
  gap: var(--sp-2);
}
.bevent__head { display: flex; align-items: center; justify-content: space-between; }
.icon-btn {
  border: 0; background: transparent; cursor: pointer;
  color: var(--muted); font-size: 0.85rem; padding: 4px 8px;
  border-radius: var(--radius-xs);
}
.icon-btn:hover { background: var(--surface-soft); color: var(--error); }

/* Gallery manager */
.bgallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sp-2); }
.bgallery__item { position: relative; aspect-ratio: 1; border-radius: var(--radius-sm); overflow: hidden; }
.bgallery__item img { width: 100%; height: 100%; object-fit: cover; }
.bgallery .icon-btn--danger {
  position: absolute; top: 4px; right: 4px;
  background: rgba(255,255,255,0.9); color: var(--error);
  border-radius: var(--radius-pill); font-size: 0.7rem; padding: 2px 7px;
}
.upload-drop {
  grid-column: 1 / -1;
  display: grid; place-items: center;
  padding: var(--sp-4);
  border: 1.5px dashed var(--border);
  border-radius: var(--radius-md);
  color: var(--text-soft);
  font-size: var(--fs-body-s);
  cursor: pointer;
  transition: border-color var(--dur-fast) ease, color var(--dur-fast) ease;
}
.upload-drop:hover { border-color: var(--accent); color: var(--accent); }
.upload-drop.is-busy { opacity: 0.6; pointer-events: none; }

/* Publish checklist + share modal extras */
.publish-checks { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.publish-checks li { font-size: var(--fs-body-s); }
.publish-checks li.ok { color: var(--success); }
.publish-checks li.warn { color: var(--warning); }
.publish-checks li.bad { color: var(--error); }
.share-actions { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
.fld-ui--check { grid-template-columns: auto 1fr; align-items: center; }
.fld-ui--check input { width: auto; accent-color: var(--accent); }

/* ---------- Responsive builder ---------- */
@media (max-width: 1024px) {
  .builder {
    grid-template-columns: 64px 1fr 280px;
  }
}
@media (max-width: 820px) {
  .builder {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(200px, 46vh) auto;
    grid-template-areas: "top" "canvas" "props";
    height: auto;
  }
  .builder__nav {
    position: fixed; z-index: 60; bottom: 0; left: 0; right: 0;
    flex-direction: row; overflow-x: auto;
    border-right: 0; border-top: 1px solid var(--border);
    padding: var(--sp-2) var(--sp-3);
  }
  .bnav__item { flex: none; }
  .builder__canvas-wrap { padding: var(--sp-3); }
  .builder__props { border-left: 0; border-top: 1px solid var(--border); }
}
`;
