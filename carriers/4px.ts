import { api } from "encore.dev/api";
import { getLatLon } from "./utils/geocode";
import { tracking_codes, in_transit_codes, delayed_transit_codes, delivered_codes, exception_codes } from "./utils/FPX_trackingcodes";
import { track } from "~encore/clients";

function mapToNewSchema(apiResponse: External4PXApiResponse): NewSchema {
  const dataItem = apiResponse.data[0];
  //to get current status, read tkCode of latest track
  //possible values: "In Transit", "In Transit - Delayed" , "Delivered", "Exception"
  //check the tkCode is in which array
  let currentStatus: string, currentStatusDescription: string | undefined;
  const tkCode = dataItem.tracks[0].tkCode;
  if (tkCode && in_transit_codes.includes(tkCode)) {
    currentStatus = "In Transit";
  } else if (tkCode && delayed_transit_codes.includes(tkCode)) {
    currentStatus = "In Transit - Delayed";
  } else if (tkCode && delivered_codes.includes(tkCode)) {
    currentStatus = "Delivered";
  } else if (tkCode && exception_codes.includes(tkCode)) {
    currentStatus = "Exception";
  } else {
    currentStatus = "Unknown";
  }
  //console.log(dataItem.tracks[0].tkCode)

  //to get current status description, read tkDesc of latest track
  currentStatusDescription = tracking_codes[dataItem.tracks[0].tkCode as keyof typeof tracking_codes];

  const origin = {name: dataItem.ctStartName, code: dataItem.ctStartCode};
  const destination = {name: dataItem.ctEndName, code: dataItem.ctEndCode};
  const daysInTransit = dataItem.duration;

  const transitEvents: TransitEvent[] = dataItem.tracks.map(track => ({
    description: track.tkDesc,
    location: track.tkLocation || 'Unknown',
    timestamp: new Date(track.tkDate).getTime(),
    latlng: [0, 0] // Replace with actual latitude and longitude if available
  }));

  const newSchema: NewSchema = {
    echo: {
      trackingID: dataItem.queryCode
    },
    data: {
      currentStatus,
      currentStatusDescription: currentStatusDescription || 'Unknown',
      origin,
      destination,
      daysInTransit,
      transitEvents
    }
  };

  return newSchema;
}

export const fpx = api(
  { method: "POST", path: "/hello" },
  async (p: RefData): Promise<Response> => {
    try{
    const traceid = p.id;
    const url = 'https://track.4px.com/track/v2/front/listTrackV2';

    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'PackTrackAPI Bot',
      },
      body: JSON.stringify({
        queryCodes: [traceid],
        language: "en-us",
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: External4PXApiResponse = await response.json() as External4PXApiResponse;
      if(data.result !== 1){
        throw new Error(`4px API error!`);
      }
    
      const newSchema = mapToNewSchema(data);

      
      //console.log("Response Data:", data.data[0].tracks);
      //console.log("Response Data (Parsed):", JSON.stringify(newSchema));

      return { message: newSchema };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  } catch (error) {
    //send error back to the track service
    throw error;
  }
  },

);

interface LatLng {
  lat: number;
  lng: number;
}

interface TransitEvent {
  description: string;
  location: string;
  timestamp: number;
  latlng: [number, number];
}

interface Data {
  currentStatus: string;
  currentStatusDescription: string;
  origin: {name: string, code: string};
  destination: {name: string, code: string};
  daysInTransit: number;
 transitEvents: TransitEvent[];
}

interface Echo {
  trackingID: string;
}

interface NewSchema {
  echo: Echo;
  data: Data;
}

interface External4PXApiResponse {
  data: {
    channelContact: string | null;
    channelTrackCode: string | null;
    consigneePostcode: string;
    ctEndCode: string;
    ctEndName: string;
    ctStartCode: string;
    ctStartName: string;
    duration: number;
    hawbCodeSet: string[];
    masterOrderNum: string | null;
    mutiPackage: boolean;
    queryCode: string;
    returnStatusFlag: string | null;
    serverCode: string;
    shipperCode: string;
    status: number;
    tracks: {
      isSigPic: string | null;
      sigPicUrl: string | null;
      spTkSummary: string | null;
      spTkZipCode: string | null;
      tkCategoryCode: string | null;
      tkCategoryName: string | null;
      tkCode: string | null;
      tkDate: string;
      tkDateStr: string;
      tkDesc: string;
      tkLocation: string | null;
      tkTimezone: string;
    }[];
  }[];
  message: string;
  result: number;
  tag: string;
}


interface RefData {
  id: string;
}

interface TrackObject {
  // Define the structure of TrackObject if known
}

interface Response {
  message: any;
}
