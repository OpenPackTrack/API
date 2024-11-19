// import "../instrument.js";
import { api } from "encore.dev/api";
import { fpx } from "../carriers/4px";
import { timeStamp } from "console";


export const get = api(
  { expose: true, method: "GET", path: "/track/:id/:carrier" },
  async ({ id, carrier  }: { id: string, carrier: string }): Promise<Response> => {
    try {
    if(carrier === "4px") {
    console.log("trackingID:", id);
    const response = await fpx({ id });
    const data = response.message;
    //console.log("Response Data:", data);
    return data;
    } else {
      return {
        echo: {
          trackingID: id
        },
        data: {
          currentStatus: "Error",
          currentStatusDescription: "Carrier not supported",
          origin: {name: "Antartica", code: "AQ"},
          destination: {name: "Antartica", code: "AQ"},
          transitEvents: [
            {
              date: "0",
              location: "",
              description: "This Tracking ID is not supported by the carrier: 4PX (we're currently in the process of adding more carriers, check back soon!)"
            }
          ]
        }
      }
    }
  } catch (error) {
    return {
      echo: {
        trackingID: id
      },
      data: {
        currentStatus: "Exception",
        currentStatusDescription: "TrackingID not supported",
        origin: {name: "Antartica", code: "AQ"},
        destination: {name: "Antartica", code: "AQ"},
        transitEvents: [
          {
            //current timestamp 
            timestamp: 1693965300000,
            location: 'Unknown',
            description: "This Tracking ID is not supported by the carrier: 4PX (we're currently in the process of adding more carriers, check back soon!)"
          }
        ]
      }
    }
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
    origin: { name: string, code: string };
    destination: { name: string, code: string };
    transitEvents: any;
  }
}
