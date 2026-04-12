export default function SectionHeading({ eyebrow, title, description, center = false }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold leading-tight text-black md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-7 text-neutral-600 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
