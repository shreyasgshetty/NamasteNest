import './GokulamSection.css';

const points = [
  {
    heading: 'Quiet residential streets',
    body: 'Away from the main traffic corridors, Gokulam has a calm neighbourhood character.',
  },
  {
    heading: 'Yoga & wellness community',
    body: 'Gokulam has a well-established yoga community with several well-known shalas and studios.',
  },
  {
    heading: 'Cafés & everyday essentials',
    body: 'Local cafés, provisions stores and restaurants are all within easy walking distance.',
  },
  {
    heading: 'Convenient access around Mysuru',
    body: 'The neighbourhood is well-connected to Mysuru city centre, the palace, and the railway station.',
  },
];

export default function GokulamSection() {
  return (
    <section className="gokulam" aria-labelledby="gokulam-heading">
      <div className="gokulam__inner container">
        {/* Header */}
        <div className="gokulam__header">
          <span className="section-label">THE NEIGHBOURHOOD</span>
          <h2 id="gokulam-heading" className="gokulam__heading">
            The neighbourhood matters.
          </h2>
          <div className="gold-divider" />
          <p className="gokulam__intro">
            Gokulam is known for its calm residential streets, yoga community,
            cafés and convenient access to the rest of Mysuru.
          </p>
        </div>

        {/* Points grid */}
        <ul className="gokulam__points" aria-label="About Gokulam">
          {points.map((p) => (
            <li key={p.heading} className="gokulam__point">
              <div className="gokulam__point-line" aria-hidden="true" />
              <h3 className="gokulam__point-heading">{p.heading}</h3>
              <p className="gokulam__point-body">{p.body}</p>
            </li>
          ))}
        </ul>

        {/* Decorative location label */}
        <div className="gokulam__location-tag" aria-hidden="true">
          <span>Gokulam 3rd Stage</span>
          <span>·</span>
          <span>Mysuru, Karnataka</span>
        </div>
      </div>
    </section>
  );
}
