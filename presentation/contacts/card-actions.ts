// Les actions serveur dont une carte de contact a besoin, regroupées pour ne pas
// multiplier les props entre la page, les sections, la liste et la carte.
import type { FollowUpAction } from "./follow-up-form";
import type { RecordFollowUpAction } from "./record-follow-up";
import type { StageAction } from "./stage-controls";

export type CardActions = {
  setFollowUp: FollowUpAction;
  advanceStage: StageAction;
  changeStage: StageAction;
  recordFollowUp: RecordFollowUpAction;
};
