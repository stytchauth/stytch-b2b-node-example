import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const CodeSpan = ({ className, children }: Props): JSX.Element => {
  return (
    <span className={className} style={styles.root}>
      {children}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    backgroundColor: "#EEECFF",
    borderRadius: 5,
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "28px",
  },
};

export default CodeSpan;
