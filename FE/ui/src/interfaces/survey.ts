import type { BaseEntity } from "./base.entity";
import type { IVariant } from "./variant";

export interface ISurvey extends BaseEntity {
  name: string;
  content: string;
  state: string;
  slug: string;
  variants: IVariant[];
}
