import { ReactNode } from "react";

type MultiStepFormWrapperProps = {
  title?: string;
  children: ReactNode;
};

export function MultiStepFormWrapper({ title, children }: MultiStepFormWrapperProps) {
  return (
    <>
      {title ? <h2 className="text-center m-0 mb-3">{title}</h2> : null}
      <div>{children}</div>
    </>
  );
}
