import { useToast } from "@components/Toast/index";
import { useAuth } from "@hooks/useAuth";
import { disableInput, useForm } from "@hooks/useForm";
import votingService from "@service/voting.service";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useEffect, useRef, type ReactNode } from "preact/compat";

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
  const formRef = useRef<HTMLFormElement>(null);
  const { onSubmit } = useForm<FormType>({
    onlyKeys: true,
    values: {
      voting: {},
    },
    async onSubmit(values, context) {
      if (!isAuth || !values.voting) return;

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

      disableInput(context);
    },
  });

  async function getAnswer() {
    const res = await votingService.getAnswer([votingId]);
    if (res[votingId] && formRef.current) {
      disableInput(formRef.current);
    }
  }

  useEffect(() => {
    if (!isAuth) {
      return;
    }

    getAnswer();
  }, [isAuth]);

  return (
    <form
      onSubmit={onSubmit}
      ref={formRef}
      class={clsx("flex flex-col gap-y-2", style)}
    >
      {children}
    </form>
  );
}

export default FormVoting;
