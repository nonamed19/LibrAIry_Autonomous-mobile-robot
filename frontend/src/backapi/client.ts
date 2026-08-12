import { Api } from "./Api";

// All services share one transport so token refreshes are coordinated application-wide.
export const api = new Api();
