import { Accordion } from "@components/Accordion";
import type { ISurvey } from "@interfaces/survey";
import surveyService from "@service/survey.service";
import { useEffect, useState } from "preact/hooks";
import Survey from "./Survey";

export interface SurveyListProps {}

function SurveyList() {
  const [surveys, setSurveys] = useState<ISurvey[]>([]);

  async function getSurvey() {
    const res = await surveyService.getAll({
      pageSize: -1,
      includeVariants: true,
    });
    setSurveys(res.data);
  }

  useEffect(() => {
    getSurvey();
  }, []);

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
