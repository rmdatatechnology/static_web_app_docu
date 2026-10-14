import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import { useLocale } from '../../hooks/locale';
import "../../styles/styles.scss";

const LABELS = { de: `Inhalt`, en: `Contents`, fr: `Sommaire`, it: `Indice` };

// The sidebar (table of contents). On small screens it is hidden and slides in
// from the left with the "Inhalt" button (see .sidebar-toggle in styles.scss).
const SidebarDrawer = ({ pageId }) => {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);

  // Close the drawer after navigating to another page.
  useEffect(() => {
    setOpen(false);
  }, [pageId]);

  // Close with the Escape key.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === `Escape`) setOpen(false);
    };
    window.addEventListener(`keydown`, onKey);
    return () => window.removeEventListener(`keydown`, onKey);
  }, [open]);

  const label = LABELS[locale] || LABELS.de;

  return (
    <>
      <div className={open ? `sidebar is-open` : `sidebar`} id="sidemenu">
        <Sidebar />
      </div>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} role="presentation" />}
      <button
        type="button"
        className="sidebar-toggle"
        aria-controls="sidemenu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <i className={open ? `fa-solid fa-xmark` : `fa-solid fa-bars`} aria-hidden="true" />
        <span>{label}</span>
      </button>
    </>
  );
};

export default SidebarDrawer;
