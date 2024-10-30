import { useEffect, type FormEvent } from "preact/compat";

export interface FormOptions<F> {
  onSubmit?: (values: FormValues<F>, context: HTMLFormElement) => void;
  onError?: () => void;
  values: {
    [key in Extract<keyof F, string>]: { type?: string };
  };
  onlyKeys?: boolean;
}

export type FormValues<F> = {
  [key in Extract<keyof F, string>]: string;
};

export function useForm<F>({
  onError,
  onSubmit,
  values,
  onlyKeys,
}: FormOptions<F>) {
  const keys: any = {};
  Object.keys(values).forEach((key) => (keys[key] = key));

  const defaultOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget as HTMLFormElement);
    const data: FormValues<F> = !onlyKeys
      ? extractFields<F>(form)
      : extractFieldsByKey<F>(form, Object.keys(keys));

    if (onSubmit) {
      onSubmit(data, event.currentTarget);
    }
  };

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
  return fields as FormValues<T>;
}

function extractFieldsByKey<T>(data: FormData, keys: string[]) {
  const fields: any = {};

  keys.forEach((key) => {
    fields[key] = data.get(key) || null;
  });

  return fields as FormValues<T>;
}
