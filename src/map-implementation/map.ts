import { Map } from "maplibre-gl";

export class MapLibreImplementation {
    private map: Map;

    constructor(mapElement: HTMLElement) {
        this.map = new Map({
            container: mapElement,
            center: [-122.420679, 37.772537],
            zoom: 13,
            style: "https://api.maptiler.com/maps/uk-openzoomstack-night/style.json?key=1CFMJSzLRLMXnvHliWMw",
        });
    }
}
