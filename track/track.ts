import "../instrument.js";
import { api } from "encore.dev/api";
import { fpx } from "../carriers/4px";


export const get = api(
  { expose: true, method: "GET", path: "/track/:id/:carrier" },
  async ({ id, carrier  }: { id: string, carrier: string }): Promise<Response> => {
    if(carrier === "4px") {
    console.log("trackingID:", id);
    const response = await fpx({ id });
    const data = response.message;
    //console.log("Response Data:", data);
    return data;
    } else {
      throw new Error(`Carrier ${carrier} not supported`);
    }
  }
);

interface Response {
  echo: {
    trackingID: string;
  },
  data: {
    currentStatus: string;
    currentStatusDescription: string;
    origin: string;
    destination: string;
    transitEvents: any;
  }
}
