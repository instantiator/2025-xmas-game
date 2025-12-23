import { Children } from "react";

export default function GameChallengeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "stretch",
        alignItems: "stretch",
      }}
    >
      {Children.map(children, (child, index) => (
        <div key={`challenge-grid-child-${index}`} style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
          {child}
        </div>
      ))}
    </div>
  );
}
