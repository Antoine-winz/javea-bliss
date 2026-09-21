import './_group.css';

const specs = [
  'Sleeps 4 guests',
  '2 double bedrooms',
  '1 modern bathroom',
  '250 m to Arenal Beach',
  'Air conditioning',
  'Fast fibre Wi-Fi',
  'Free street parking',
  'Private terrace',
];

export function Current() {
  return (
    <section className="javea-glance" style={{ background: 'var(--sand)', borderBottom: '1px solid rgb(20 32 46 / 0.1)' }}>
      <div className="javea-shell">
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '40px',
            rowGap: '12px',
            padding: '28px 0 32px',
            margin: 0,
            listStyle: 'none',
          }}
        >
          {specs.map((spec) => (
            <li
              key={spec}
              style={{
                color: 'var(--ink-soft)',
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.14em',
                lineHeight: 1.5,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {spec}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}