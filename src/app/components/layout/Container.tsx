import type { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
    return (
        <div className={`mx-auto w-full max-w-md px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl ${className}`}>
            {children}
        </div>
    );
}