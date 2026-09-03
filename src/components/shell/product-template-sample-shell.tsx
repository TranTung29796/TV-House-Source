import type { ReactNode } from "react";

type SampleShellProps = {
  children: ReactNode;
};

export function ProductTemplateSampleShell({ children }: SampleShellProps) {
  return <>{children}</>;
}
