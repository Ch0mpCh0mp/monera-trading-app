import type { ReactNode } from "react";
import Container from "./Container";
import BottomNav from "../BottomNav";

type AppShellProps = {
  children: ReactNode;
  className?: string;          // optional: fürs Page-Spacing
  containerClassName?: string; // optional: fürs Container-Layout (z.B. flex)
  showBottomNav?: boolean;     // optional
};

export default function AppShell({
  children,
  className = "",
  containerClassName = "",
  showBottomNav = true,
}: AppShellProps) {
  return (
    <main className={`h-screen overflow-hidden bg-black pt-6 pb-24 ${className}`}>
      <Container className={`mt-4 ${containerClassName}`}>
        {children}
      </Container>

      {showBottomNav ? <BottomNav /> : null}
    </main>
  );
}
