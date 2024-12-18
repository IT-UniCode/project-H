import { Accordion } from "@components/Accordion";
import type { ISurvey } from "@interfaces/survey";
import surveyService from "@service/survey.service";
import { useEffect, useState } from "preact/hooks";
import Survey from "./Survey";
import { useAuth } from "@hooks/useAuth";

export interface SurveyListProps {}

function SurveyList() {
  const [surveys, setSurveys] = useState<ISurvey[]>([]);
  const { isAuth } = useAuth();

  async function getSurvey() {
    const res = await surveyService.getAll({
      pageSize: -1,
      includeVariants: true,
    });

    if (!isAuth) {
      setSurveys(res.data);
      return;
    }

    const ids = res.data.map((v) => v.documentId);

    if (ids.length === 0) return;

    const surveyAnswers = await surveyService.getAnswer(ids);
    const serveys: ISurvey[] = [];

    res.data.forEach((survey) => {
      const answers = surveyAnswers[survey.documentId];
      if (!answers) {
        serveys.push(survey);
      }
    });

    setSurveys(serveys);
  }

  useEffect(() => {
    getSurvey();
  }, [isAuth]);

  return (
    <section>
      {surveys.map((v) => (
        <Accordion title={v.name}>
          <Survey survey={v} />
        </Accordion>
      ))}
    </section>
  );
}

export default SurveyList;
