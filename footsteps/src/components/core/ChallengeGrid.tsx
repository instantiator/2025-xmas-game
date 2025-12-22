import { Children } from "react";

export default function ChallengeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "5px", padding: "5px" }}>
      {Children.map(children, (child, index) => (
        <div
          key={`challenge-grid-child-${index}`}
          style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0, borderRadius: "5px" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
