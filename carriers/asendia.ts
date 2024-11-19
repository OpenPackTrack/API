import { api } from "encore.dev/api";

// Define the types and interfaces
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
  origin: { name: string; code: string };
  destination: { name: string; code: string };
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

interface AsendiaApiResponse {
  trackingBrandedSummary: {
    destinationCountry: string;
    destinationCountryIso2: string;
    lastMileMessage: string;
    finalMileTrackingLink: string;
    trackingNumberVendor: string;
    trackingNumberCustomer: string;
    trackingNumberCustomerCarrierOriginal: string;
    service: string;
    weight: string;
    trackingProgress: {
      total: number;
      completed: number;
    };
    consolidatedPackages: any;
  };
  trackingBrandedDetail: {
    eventCode: string;
    eventDescription: string;
    eventLocationDetails: {
      addressLine1: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      countryIso2: string | null;
      countryName: string | null;
    };
    eventOn: string;
    eventSource: string;
  }[];
  trackingServiceMessage: string;
  transitTimesMessage: string;
  footerText: string | null;
  responseStatus: {
    responseStatusCode: number;
    responseStatusMessage: string;
  };
}

interface RefData {
  id: string;
}

interface Response {
  message: any;
}

function mapToNewSchema(apiResponse: AsendiaApiResponse): NewSchema {
  const summary = apiResponse.trackingBrandedSummary;
  const latestEvent = apiResponse.trackingBrandedDetail[0];
  let currentStatus: string;
  let currentStatusDescription: string | undefined;

  if (latestEvent.eventDescription.includes("Delivered")) {
    currentStatus = "Delivered";
  } else if (latestEvent.eventDescription.includes("Delayed")) {
    currentStatus = "In Transit - Delayed";
  } else if (latestEvent.eventDescription.includes("Exception")) {
    currentStatus = "Exception";
  } else {
    currentStatus = "In Transit";
  }

  currentStatusDescription = latestEvent.eventDescription;

  const origin = { name: "United States", code: "US" };
  const destination = { name: summary.destinationCountry, code: summary.destinationCountryIso2 };
  const daysInTransit = summary.trackingProgress.completed;

  const transitEvents: TransitEvent[] = apiResponse.trackingBrandedDetail.map(event => ({
    description: event.eventDescription,
    location: event.eventLocationDetails.countryName || 'Unknown',
    timestamp: new Date(event.eventOn).getTime(),
    latlng: [0, 0] 
  }));

  const newSchema: NewSchema = {
    echo: {
      trackingID: summary.trackingNumberCustomerCarrierOriginal
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

export const asendia = api(
  { expose: false },
  async (p: RefData): Promise<Response> => {
    try {
      const traceid = p.id;
      const url = `https://a1reportapi.asendiaprod.com/api/A1/TrackingBranded/Tracking?trackingKey=AE654169-0B14-45F9-8498-A8E464E13D26&trackingNumber=${traceid}`;

      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'accept-language': 'en-IN,en;q=0.9',
          'authorization': 'Basic Q3VzdEJyYW5kLlRyYWNraW5nQGFzZW5kaWEuY29tOjJ3cmZzelk4cXBBQW5UVkI=',
          'content-type': 'application/json',
          'x-asendiaone-apikey': '32337AB0-45DD-44A2-8601-547439EF9B55'
        }
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AsendiaApiResponse = await response.json() as AsendiaApiResponse;
      if (data.responseStatus.responseStatusCode !== 200) {
        throw new Error(`Asendia API error!`);
      }

      const newSchema = mapToNewSchema(data);

      return { message: newSchema };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
);
