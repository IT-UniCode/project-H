import type { ISurvey } from "@interfaces/survey";
import surveyService from "@service/survey.service";
import { useEffect, useState } from "preact/hooks";

export interface SurveyListProps {}

function SurveyList() {
  const [surveys, setSurveys] = useState<ISurvey[]>([]);

  async function getSurvey() {
    const res = await surveyService.getAll({ pageSize: -1 });
    setSurveys(res.data);
  }

  useEffect(() => {
    getSurvey();
  }, []);

  return (
    <section>
      {surveys.map((v) => (
        <section>{v.publishedAt}</section>
      ))}
    </section>
  );
}

export default SurveyList;
