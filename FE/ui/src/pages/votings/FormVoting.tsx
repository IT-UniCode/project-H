import { useToast } from "@components/Toast/index";
import { useAuth } from "@hooks/useAuth";
import { useForm } from "@hooks/useForm";
import votingService from "@service/voting.service";
import clsx from "clsx";
import { nanoid } from "nanoid";
import type { ReactNode } from "preact/compat";

export interface FormVotingProps {
  children?: ReactNode;
  class?: string;
  votingId: string;
}

interface FormType {
  voting: string;
}

function FormVoting({ children, class: style, votingId }: FormVotingProps) {
  const { isAuth } = useAuth();
  const { addToast } = useToast();
  const { onSubmit } = useForm<FormType>({
    onlyKeys: true,
    values: {
      voting: {},
    },
    async onSubmit(values, context) {
      if (!isAuth) return;

      try {
        await votingService.vote({
          answer: values.voting,
          votingId,
        });
      } catch (err) {
        addToast({
          message: "Fail to vote. You alredy have vote!",
          id: nanoid(),
          type: "error",
        });
      }

      const formElements = Array.from(context.elements) as HTMLInputElement[];
      formElements.forEach((element) => {
        element.disabled = true;
      });
    },
  });

  return (
    <form onSubmit={onSubmit} class={clsx("flex flex-col gap-y-2", style)}>
      {children}
    </form>
  );
}

export default FormVoting;
