import type { CustomLayerInterface, LineLayerSpecification } from "maplibre-gl";
import { Map } from "maplibre-gl";

import type { Layer } from "@deck.gl/core/typed";
import { MapboxLayer } from "@deck.gl/mapbox/typed";
import type { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";

import length from "@turf/length";

import { v4 as uuid } from "uuid";

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

        this.map.once("styledata", () => {
            this.addModelLayers();
        });

        this.routeGuideLine = new GuideLine(this.map);
        this.camera = new Camera(this.map);
    }

    private readonly map: Map;

    private readonly routeGuideLine: GuideLine;

    private readonly camera: Camera;

    private layers: MapboxLayer<Layer>[] = [];

    public startRoute(route: GeoJSON.LineString) {
        console.log(route);
        const layer = this.layers[0];
        console.log("layer", route.coordinates[0]);
        layer.setProps({ id: layer.id, data: [{ position: route.coordinates[0] }] });
        this.routeGuideLine.addGuideForRoute(route);
        this.camera.cameraFollowRoute(route);
    }

    public destory() {
        this.map.remove();
    }

    private addModelLayers(): void {
        const modelLayer = new MapboxLayer<Layer>({
            id: uuid(),
            // @ts-ignore
            type: ScenegraphLayer,
            scenegraph: "https://model-repo-488fcbb8-6cc3-4249-9acf-ea68bbdda2ee.s3.eu-west-2.amazonaws.com/car.glb",
            data: [{ position: [-122.420679, 37.772537] }],
            sizeScale: 10,
            getPosition: (d) => d.position,
            getOrientation: () => [0, 0, 90],
            _animations: {
                "*": { speed: 1 },
            },
            _lighting: "pbr",
        });
        this.layers.push(modelLayer);
        this.map.addLayer(modelLayer as unknown as CustomLayerInterface);
    }
}

class Camera {
    constructor(map: Map) {
        this.map = map;
    }

    private readonly map: Map;

    public cameraFollowRoute(route: GeoJSON.LineString) {
        const routeDistance = length(route);
        console.log("route distance", routeDistance);
    }
}

class GuideLine {
    constructor(map: Map) {
        this.map = map;
    }

    private map: Map;

    private guideLineId = "guide-line";

    public addGuideForRoute(route: GeoJSON.LineString) {
        this.addGuideLineSource(route);
        this.addGuideLineLayer();
    }

    private addGuideLineSource(route: GeoJSON.LineString) {
        this.map.addSource(this.guideLineId, { type: "geojson", data: route });
    }

    private addGuideLineLayer() {
        const layer: LineLayerSpecification = {
            id: this.guideLineId,
            type: "line",
            paint: {
                "line-color": "blue",
                "line-width": 10,
            },
            source: this.guideLineId,
        };
        this.map.addLayer(layer);
    }
}
