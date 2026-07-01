export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        padding: "2.5rem 2rem",
        textAlign: "center",
        borderTop: "1px solid rgba(58,117,100,0.1)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: ".75rem",
          color: "var(--ct-text-3)",
          letterSpacing: ".08em",
        }}
      >
        CarbonTrust Protocol · Decentralized Environmental Intelligence · Built on GenLayer
        Intelligent Contracts · StudioNet
      </p>
    </footer>
  );
}
