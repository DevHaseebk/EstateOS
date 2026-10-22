import { SiteIconGlyph } from './icons';
import { formatPrice, INTENT_LABELS, PROPERTY_TYPE_LABELS, propertyFacts } from './property';
import type { OptionalBlock, SiteModel } from './types';

const NAV_LABELS: Record<OptionalBlock['key'], string> = { about: 'About', services: 'Services', whyChooseUs: 'Why us', team: 'Team', properties: 'Properties' };

/** D-080: enquiries go to the agency's public WhatsApp (with a short message) or phone. No inquiry form in the pilot. */
function enquiryLink(title: string, location: string, contacts: SiteModel['contacts']): { href: string; external: boolean } | null {
  if (contacts.whatsapp) {
    const text = `Hi, I am interested in "${title}" (${location}).`;
    return { href: `${whatsappHref(contacts.whatsapp)}?text=${encodeURIComponent(text)}`, external: true };
  }
  return contacts.phone ? { href: phoneHref(contacts.phone), external: false } : null;
}
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join('');

/** Phase 3c optional sections (D-032). Only blocks that are shown and have content ever reach here. */
function OptionalSectionView({ block, contacts }: { block: OptionalBlock; contacts: SiteModel['contacts'] }) {
  const titleId = `est-${block.key}-title`;
  return <section className={`est-section est-optional est-${block.key}`} id={block.key} aria-labelledby={titleId}>
    <div className="est-container">
      <h2 id={titleId} className="est-h2">{block.heading}</h2>
      {block.key === 'about' && <div className={block.photo ? 'est-about-body est-about-with-photo' : 'est-about-body'}>
        {block.photo && <img className="est-about-photo" src={block.photo.url} srcSet={block.photo.srcSet} sizes="(min-width: 768px) 40vw, 100vw" alt={block.photo.alt} loading="lazy" decoding="async" />}
        <p className="est-about-story">{block.story}</p>
      </div>}
      {block.key === 'properties' && <ul className="est-card-grid">
        {block.items.map((property) => {
          const location = `${property.area}, ${property.city}`;
          const enquiry = enquiryLink(property.title, location, contacts);
          const facts = propertyFacts(property);
          return <li key={property.key} className="est-card est-property">
            {property.coverUrl
              ? <img className="est-property-photo" src={property.coverUrl} srcSet={property.coverSrcSet} sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw" alt={property.title} loading="lazy" decoding="async" />
              : <div className="est-property-visual" aria-hidden="true"><SiteIconGlyph icon={property.type === 'PLOT' ? 'map-pin' : property.type === 'SHOP' || property.type === 'OFFICE' ? 'building' : 'home'} /></div>}
            <div className="est-property-body">
              <p className="est-property-meta"><span className="est-pill">{INTENT_LABELS[property.intent]}</span> {PROPERTY_TYPE_LABELS[property.type]}</p>
              <h3 className="est-h3">{property.title}</h3>
              <p className="est-muted">{location}</p>
              {facts && <p className="est-muted">{facts}</p>}
              <p className="est-price">{formatPrice(property.pricePkr, property.intent)}</p>
              {enquiry && <a className="est-button est-button-small" href={enquiry.href} {...(enquiry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                Enquire<span className="est-visually-hidden"> about {property.title}</span></a>}
            </div>
          </li>;
        })}
      </ul>}
      {(block.key === 'services' || block.key === 'whyChooseUs') && <ul className="est-card-grid">
        {block.cards.map((card, index) => <li key={`${card.title}-${index}`} className="est-card est-feature">
          <span className="est-icon"><SiteIconGlyph icon={card.icon} /></span>
          <h3 className="est-h3">{card.title}</h3>
          {card.text && <p className="est-muted">{card.text}</p>}
        </li>)}
      </ul>}
      {block.key === 'team' && <ul className="est-card-grid">
        {block.members.map((member, index) => <li key={`${member.name}-${index}`} className="est-card est-member">
          {member.photoUrl
            ? <img className="est-member-photo" src={member.photoUrl} alt={member.name} width={56} height={56} loading="lazy" decoding="async" />
            : <span className="est-initials" aria-hidden="true">{initials(member.name)}</span>}
          <div>
            <h3 className="est-h3">{member.name}</h3>
            {member.role && <p className="est-muted">{member.role}</p>}
            {(member.phone || member.whatsapp) && <p className="est-member-contacts">
              {member.whatsapp && <a href={whatsappHref(member.whatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp {displayNumber(member.whatsapp)}</a>}
              {member.phone && <a href={phoneHref(member.phone)}>Call {displayNumber(member.phone)}</a>}
            </p>}
          </div>
        </li>)}
      </ul>}
    </div>
  </section>;
}

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
 * The ONE shared agency website template (D-030): Header, Hero, the optional sections (3c), Contact and Footer (D-031/D-032).
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
          {model.header.logoUrl
            ? <img className="est-logo" src={model.header.logoUrl} alt={model.agencyName} />
            : <span className="est-brand">{model.agencyName}</span>}
          {model.optional.length > 0 && <nav className="est-nav" aria-label="Sections">
            {model.optional.map((block) => <a key={block.key} href={`#${block.key}`}>{NAV_LABELS[block.key]}</a>)}
            <a href="#contact">Contact</a>
          </nav>}
          {contact && <a className="est-button est-button-small" href={contact.href} {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {model.header.contactButtonLabel}
          </a>}
        </div>
      </header>

      <section className={`est-hero${model.hero.imageUrl ? '' : ' est-hero-no-image'}`} aria-labelledby="est-hero-title">
        {model.hero.imageUrl && <img className="est-hero-img" src={model.hero.imageUrl} srcSet={model.hero.imageSrcSet} sizes="100vw" alt="" fetchPriority="high" decoding="async" />}
        <div className="est-hero-overlay" />
        <div className="est-container est-hero-content">
          {model.hero.heading && <h1 id="est-hero-title" className="est-hero-title">{model.hero.heading}</h1>}
          {model.hero.subtitle && <p className="est-hero-subtitle">{model.hero.subtitle}</p>}
          {contact && <a className="est-button est-button-on-image" href="#contact">{model.hero.ctaLabel}</a>}
        </div>
      </section>

      {model.optional.map((block) => <OptionalSectionView key={block.key} block={block} contacts={model.contacts} />)}

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
