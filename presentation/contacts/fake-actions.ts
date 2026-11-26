// Pour les tests uniquement : des actions de carte qui ne font rien.
import type { CardActions } from "./card-actions";

const noop = async () => ({ error: null });

export const fakeActions: CardActions = {
  setFollowUp: noop,
  advanceStage: noop,
  changeStage: noop,
};
