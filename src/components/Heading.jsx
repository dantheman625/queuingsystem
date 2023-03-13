export default function Heading({ level, children, allignment }) {
  const allignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const levels = {
    h1: (
      <h1 className={"font-extrabold text-5xl " + allignments[allignment]}>
        {children}
      </h1>
    ),
    h2: (
      <h2 className={"font-bold text-4xl " + allignments[allignment]}>
        {children}
      </h2>
    ),
    h3: (
      <h3 className={"font-bold text-3l " + allignments[allignment]}>
        {children}
      </h3>
    ),
  };

  return levels[level];
}
