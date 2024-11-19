

interface Location {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
  }
  //currently not used
  async function fetchLocation(query: string): Promise<Location[]> {
    const url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(query)}&polygon_geojson=0&format=jsonv2`;
    const response = await fetch(url);
    const data: Location[] = await response.json() as Location[];
    return data;
  }
  
  export async function getLatLon(queries: string[]): Promise<Location[][]> {
    const promises = queries.map(query => fetchLocation(query));
    const results = await Promise.all(promises);
    return results;
  }