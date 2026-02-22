import { handlers as designersHandlers } from "./designersHandler";
import { handlers as objectsHandlers } from "./objectsHandler";

export const handlers = [...designersHandlers, ...objectsHandlers];
