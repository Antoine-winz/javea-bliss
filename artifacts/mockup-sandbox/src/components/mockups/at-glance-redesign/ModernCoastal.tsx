import {
  Armchair,
  BedDouble,
  Bath,
  Waves,
  Snowflake,
  Wifi,
  CarFront,
  Sun,
} from 'lucide-react';
import './_group.css';

const features = [
  { label: 'Sleeps 4 guests', icon: Armchair },
  { label: '2 double bedrooms', icon: BedDouble },
  { label: '1 modern bathroom', icon: Bath },
  { label: '250 m to Arenal Beach', icon: Waves },
  { label: 'Air conditioning', icon: Snowflake },
  { label: 'Fast fibre Wi-Fi', icon: Wifi },
  { label: 'Free street parking', icon: CarFront },
  { label: 'Private terrace', icon: Sun },
];

export function ModernCoastal() {
  return (
    <section
      className="javea-glance"
      style={{
        background: 'var(--sand)',
        borderBottom: '1px solid rgb(20 32 46 / 0.1)',
        padding: '30px 0 34px',
        overflow: 'hidden',
      }}
    >
      <div className="javea-shell">
        <div className="refined-header">
          <span className="refined-rule" aria-hidden="true" />
          <p
            style={{
              color: 'var(--stone)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.22em',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            At a glance
          </p>
          <span className="refined-rule" aria-hidden="true" />
        </div>

        <div
          className="refined-feature-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            marginTop: 24,
          }}
        >
          {features.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="refined-feature"
              style={{
                alignItems: 'center',
                borderLeft: '1px solid rgb(20 32 46 / 0.16)',
                display: 'flex',
                gap: 10,
                minHeight: 46,
                padding: '7px 16px',
              }}
            >
              <Icon aria-hidden="true" size={16} strokeWidth={1.4} style={{ color: 'var(--brass)', flexShrink: 0 }} />
              <span
                style={{
                  color: 'var(--ink-soft)',
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.095em',
                  lineHeight: 1.35,
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .refined-header {
          align-items: center;
          display: flex;
          gap: 14px;
          justify-content: center;
        }
        .refined-rule {
          background: var(--brass);
          height: 1px;
          opacity: 0.8;
          width: 28px;
        }
        @media (max-width: 820px) {
          .javea-glance .refined-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .javea-glance .refined-feature {
            min-height: 43px !important;
            padding-left: 10px !important;
            padding-right: 8px !important;
          }
        }
        @media (max-width: 430px) {
          .javea-glance .refined-feature-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}