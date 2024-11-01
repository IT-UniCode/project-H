import type { ReactNode } from "preact/compat";

export interface FormLoginProps {
  children: ReactNode;
}

function FormLogin({ children }: FormLoginProps) {
  return (
    <form class="max-w-lg mx-auto py-4 flex flex-col gap-y-3">{children}</form>
  );
}

export default FormLogin;
