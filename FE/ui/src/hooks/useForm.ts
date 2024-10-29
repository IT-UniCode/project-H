import { useEffect, type FormEvent } from "preact/compat";

export interface FormOptions<F> {
  onSubmit?: (values: FormValues<F>, context: HTMLFormElement) => void;
  onError?: () => void;
  values: {
    [key in Extract<keyof F, string>]: { type?: string };
  };
}

export type FormValues<F> = {
  [key in Extract<keyof F, string>]: string;
};

export function useForm<F>({ onError, onSubmit, values }: FormOptions<F>) {
  const defaultOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget as HTMLFormElement);
    const values: FormValues<F> = extractFields<F>(form);

    if (onSubmit) {
      onSubmit(values, event.currentTarget);
    }
  };

  const keys: any = {};
  Object.keys(values).forEach((key) => (keys[key] = key));

  return {
    onSubmit: defaultOnSubmit,
    keys: keys as { [key in Extract<keyof F, string>]: string },
  };
}

function extractFields<T>(data: FormData) {
  const fields: any = {};
  Array.from(data.keys()).forEach((key) => {
    fields[key] = data.get(key);
  });
  return fields;
}
