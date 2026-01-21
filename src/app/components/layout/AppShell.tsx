import type { ReactNode } from "react";
import Container from "./Container";
import BottomNav from "../BottomNav";
import { createContext, useState, useContext } from "react";

// ======== Balance Context ========
interface BalanceContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) throw new Error("useBalance must be used within AppShell");
  return context;
};

// ======== AppShell ========
type AppShellProps = {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  showBottomNav?: boolean;
};

export default function AppShell({
  children,
  className = "",
  containerClassName = "",
  showBottomNav = true,
}: AppShellProps) {
  const [balance, setBalance] = useState(12543.21); // Startwert

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      <main className={`h-screen overflow-hidden bg-black pt-6 pb-24 ${className}`}>
        <Container className={`mt-4 ${containerClassName}`}>
          {children}
        </Container>

        {showBottomNav ? <BottomNav /> : null}
      </main>
    </BalanceContext.Provider>
  );
}
