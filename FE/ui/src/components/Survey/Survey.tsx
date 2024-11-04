import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { disableInput, useForm } from "@hooks/useForm";
import type { ISurvey } from "@interfaces/survey";
import surveyService from "@service/survey.service";
import { marked } from "marked";

export interface SurveyProps {
  survey: ISurvey;
}

interface FormType {
  voting: string;
}

function Survey({ survey }: SurveyProps) {
  const { isAuth } = useAuth();
  const { onSubmit } = useForm<FormType>({
    values: { voting: {} },
    async onSubmit(values, context) {
      if (!isAuth) {
        return;
      }

      await surveyService.vote({
        surveyId: survey.documentId,
        answers: values.voting as string[],
      });

      disableInput(context);
    },
  });

  return (
    <form class="pb-3" onSubmit={onSubmit}>
      <article
        dangerouslySetInnerHTML={{
          __html: marked.parse(survey.content, { async: false }),
        }}
      />

      <fieldset id="survey">
        {survey.variants.map((v) => (
          <div>
            <input
              id={v.uniqueId + survey.documentId}
              type="checkbox"
              name="voting"
              value={v.uniqueId}
            />
            <label class="ml-2" for={v.uniqueId + survey.documentId}>
              {v.content}
            </label>
          </div>
        ))}
      </fieldset>

      <Button>Vote</Button>
    </form>
  );
}

export default Survey;
