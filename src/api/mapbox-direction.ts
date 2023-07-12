import { v4 as uuid } from "uuid";

// const forwardGeocodingApiRoute = "https://api.mapbox.com/geocoding/v5/{endpoint}/{search_text}.json";
// https://api.mapbox.com/geocoding/v5/mapbox.places/cen.json?proximity=ip&access_token=

const geocodingApiKey =
    "pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export type LocationList = {
    id: string;
    bbox: [number, number, number, number];
    center: [number, number];
    name: string;
};

type LocationListResult = Omit<LocationList, "name"> & { place_name: string };

export async function getLocationList(
    searchPhrase: string
): Promise<LocationList[]> {
    const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchPhrase}.json?proximity=ip&access_token=${geocodingApiKey}`
    );
    const locations = await response.json();

    return locations.features.map((location: LocationListResult) => ({
        id: uuid(),
        bbox: location.bbox,
        center: location.center,
        name: location.place_name,
    }));
}
