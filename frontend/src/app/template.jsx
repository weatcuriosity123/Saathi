// This root template is kept for potential future cross-group transitions
// if any state needs to be reset between (main) and (tutor) groups.
// Currently it just passes through children.
export default function RootTemplate({ children }) {
  return <>{children}</>;
}
