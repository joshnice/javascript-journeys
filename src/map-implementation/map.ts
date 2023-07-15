import { Map } from "maplibre-gl";
import { GuideLine } from "./route";
import { Camera } from "./camera";
import { Model } from "./model";

export class MapLibreImplementation {
    constructor(mapElement: HTMLElement) {
        this.map = new Map({
            container: mapElement,
            center: [-122.420679, 37.772537],
            zoom: 20,
            style: "https://api.maptiler.com/maps/streets/style.json?key=IHriHQgQWN2WA4EHxu0r",
            attributionControl: false,
            hash: true,
        });

        this.routeGuideLine = new GuideLine(this.map);

        this.camera = new Camera(this.map);

        this.model = new Model(this.map, this.camera);
    }

    private readonly map: Map;

    private readonly routeGuideLine: GuideLine;

    private readonly camera: Camera;

    private readonly model: Model;

    public startRoute(route: GeoJSON.LineString) {
        const layer = this.model.getLayer();
        this.routeGuideLine.addGuideForRoute(route, layer.id);
        this.model.modelFollowRoute(route);
    }

    public destroy() {
        this.map.remove();
    }
}
