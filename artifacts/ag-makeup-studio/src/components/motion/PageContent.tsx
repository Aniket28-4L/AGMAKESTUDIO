import { ReactNode } from "react";

interface PageContentProps {
  isReady: boolean;
  children: ReactNode;
}

export function PageContent({ isReady, children }: PageContentProps) {
  return (
    <div
      className="motion-page-content"
      data-motion-ready={isReady ? "true" : "false"}
    >
      {children}
    </div>
  );
}
