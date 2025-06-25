declare module "@vercel/analytics/react" {
  import { FC } from "react";

  export const Analytics: FC;
  export const inject: () => void;
  export default Analytics;
}