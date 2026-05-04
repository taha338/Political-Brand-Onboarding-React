/**
 * SubjectTypeToggle
 * Lets the user pick whether this brand discovery is for a candidate
 * (an individual running for office) or a party / movement /
 * organization. Sits at the top of Stage 1.
 */
import { useBrand } from '../context/BrandContext';
import { User, Flag } from 'lucide-react';

const accent = '#8B1A2B';
const navy = '#1C2E5B';
const cardBorder = '#E5E7EB';

export default function SubjectTypeToggle() {
  const { state, dispatch } = useBrand();
  const subjectType = state.subjectType || 'candidate';

  const setType = (type) => dispatch({ type: 'SET_SUBJECT_TYPE', payload: type });

  const options = [
    {
      id: 'candidate',
      label: 'Candidate',
      desc: 'An individual running for office',
      icon: <User size={22} />,
    },
    {
      id: 'party',
      label: 'Party / Movement',
      desc: 'A party, coalition, or political organization',
      icon: <Flag size={22} />,
    },
  ];

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <p style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '0.75rem',
      }}>Who is this brand for?</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {options.map((opt) => {
          const selected = subjectType === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setType(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                borderRadius: 12,
                background: selected ? accent : '#FFFFFF',
                border: `1px solid ${selected ? accent : cardBorder}`,
                color: selected ? '#FFFFFF' : navy,
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: selected ? '0 4px 18px rgba(139,26,43,0.22)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 10,
                background: selected ? 'rgba(255,255,255,0.18)' : '#F3F4F6',
                color: selected ? '#FFFFFF' : accent,
                flexShrink: 0,
              }}>
                {opt.icon}
              </span>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>{opt.label}</div>
                <div style={{
                  fontSize: '0.8rem',
                  marginTop: 4,
                  color: selected ? 'rgba(255,255,255,0.85)' : '#6B7280',
                  lineHeight: 1.35,
                }}>{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
