import type { SiteModel } from './types';

const whatsappHref = (e164: string) => `https://wa.me/${e164.replace(/\D/g, '')}`;
const phoneHref = (e164: string) => `tel:${e164}`;

/** Pakistani numbers read better as 0300 1234567; others keep their international form. */
function displayNumber(e164: string): string {
  const match = /^\+92(\d{3})(\d{7})$/.exec(e164);
  return match ? `0${match[1]} ${match[2]}` : e164;
}

function primaryContact(model: SiteModel): { href: string; external: boolean } | null {
  const { phone, whatsapp } = model.contacts;
  const prefer = model.header.preferredContact;
  if (whatsapp && (prefer === 'WHATSAPP' || !phone)) return { href: whatsappHref(whatsapp), external: true };
  if (phone) return { href: phoneHref(phone), external: false };
  return null;
}

/**
 * The ONE shared agency website template (D-030): Header, Hero, Contact and Footer in 3b (D-031/D-032).
 * Layout responds to its own width (container queries), so previews at phone width match a real phone.
 * Empty optional parts render nothing — no placeholders, no broken links (D-033).
 */
export function SiteTemplate({ model }: { model: SiteModel }) {
  const contact = primaryContact(model);
  const { contacts } = model;
  const location = [contacts.officeAddress, contacts.city].filter(Boolean).join(', ');
  const year = new Date().getFullYear();
  return <div className="est-site" data-theme={model.theme}>
    <div className="est-page">
      <header className="est-header">
        <div className="est-container est-header-inner">
          <span className="est-brand">{model.agencyName}</span>
          {contact && <a className="est-button est-button-small" href={contact.href} {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {model.header.contactButtonLabel}
          </a>}
        </div>
      </header>

      <section className={`est-hero${model.hero.imageUrl ? '' : ' est-hero-no-image'}`} aria-labelledby="est-hero-title"
        style={model.hero.imageUrl ? { backgroundImage: `url("${model.hero.imageUrl}")` } : undefined}>
        <div className="est-hero-overlay" />
        <div className="est-container est-hero-content">
          {model.hero.heading && <h1 id="est-hero-title" className="est-hero-title">{model.hero.heading}</h1>}
          {model.hero.subtitle && <p className="est-hero-subtitle">{model.hero.subtitle}</p>}
          {contact && <a className="est-button est-button-on-image" href="#contact">{model.hero.ctaLabel}</a>}
        </div>
      </section>

      <section className="est-section" id="contact" aria-labelledby="est-contact-title">
        <div className="est-container">
          <div className="est-card est-contact">
            <h2 id="est-contact-title" className="est-h2">{model.contact.heading}</h2>
            {model.contact.message && <p className="est-muted est-contact-message">{model.contact.message}</p>}
            <ul className="est-contact-list">
              {contacts.whatsapp && <li><span className="est-label">WhatsApp</span>
                <a href={whatsappHref(contacts.whatsapp)} target="_blank" rel="noopener noreferrer">{displayNumber(contacts.whatsapp)}</a></li>}
              {contacts.phone && <li><span className="est-label">Phone</span><a href={phoneHref(contacts.phone)}>{displayNumber(contacts.phone)}</a></li>}
              {contacts.publicEmail && <li><span className="est-label">Email</span><a href={`mailto:${contacts.publicEmail}`}>{contacts.publicEmail}</a></li>}
              {location && <li><span className="est-label">Office</span><span>{location}</span></li>}
            </ul>
          </div>
        </div>
      </section>

      <footer className="est-footer">
        <div className="est-container est-footer-inner">
          <div>
            <p className="est-brand">{model.agencyName}</p>
            {location && <p className="est-muted">{location}</p>}
          </div>
          <div className="est-footer-contacts">
            {contacts.phone && <a href={phoneHref(contacts.phone)}>{displayNumber(contacts.phone)}</a>}
            {contacts.whatsapp && <a href={whatsappHref(contacts.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            {contacts.publicEmail && <a href={`mailto:${contacts.publicEmail}`}>{contacts.publicEmail}</a>}
          </div>
          <p className="est-muted est-copyright">© {year} {model.agencyName}</p>
        </div>
      </footer>
    </div>
  </div>;
}
