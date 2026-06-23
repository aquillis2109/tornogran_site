export function Section({ eyebrow, title, text, children, className = '' }) {
  return (
    <section className={`section ${className}`}>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {(eyebrow || title || text) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {text && <p className="section-text">{text}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, text, backgroundImage, imageAlt = '' }) {
  return (
    <section className="relative overflow-hidden border-b border-[#d8e1e5] bg-[#e9eef1] pt-32 text-[#172529] lg:pt-56">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
      )}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#eef3f5]/95 via-[#eef3f5]/78 to-[#eef3f5]/24" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#eef3f5]/90 via-transparent to-[#eef3f5]/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(15,59,70,0.14),transparent_38%)]" />
      )}
      <div className="relative mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#62747b]">{text}</p>
      </div>
    </section>
  );
}
