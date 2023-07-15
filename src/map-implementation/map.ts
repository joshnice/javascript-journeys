import type { CustomLayerInterface, LineLayerSpecification } from "maplibre-gl";
import { Map } from "maplibre-gl";

import type { Layer } from "@deck.gl/core/typed";
import { MapboxLayer } from "@deck.gl/mapbox/typed";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";

import { length, lineChunk } from "@turf/turf";

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

type ModelData = {
    follow: boolean;
    position: [number, number];
};

class Model {
    constructor(map: Map, camera: Camera) {
        this.map = map;
        this.camera = camera;

        this.map.once("styledata", () => {
            this.addModelLayers();
        });
    }

    private readonly map: Map;

    private readonly camera: Camera;

    private layer: MapboxLayer<Layer> | undefined;

    private speedSlow = 20; // In meters per second roughly 20 Mph

    public getLayer() {
        if (this.layer == null) {
            throw Error();
        }
        return this.layer;
    }

    public async modelFollowRoute(route: GeoJSON.LineString) {
        const refreshRate = this.camera.getRefreshRate();
        const distanceMeters = length(route, { units: "meters" });
        const timeInSeconds = distanceMeters / this.speedSlow;
        const iterations = (timeInSeconds * 1000) / refreshRate;
        console.log("iterations", iterations);
        const section = distanceMeters / iterations;
        const coords: [number, number][] = lineChunk(route, section, { units: "meters" }).features.map((feature) => feature.geometry.coordinates[0]);
        const layer = this.getLayer();
        for (const coord of coords) {
            layer.setProps({ id: layer.id, data: [{ position: coord, follow: true }] });
            await new Promise<void>((res) => {
                setTimeout(() => {
                    res();
                }, refreshRate);
            });
        }
    }

    private addModelLayers(): void {
        const modelLayer = new MapboxLayer<Layer>({
            id: uuid(),
            // @ts-ignore
            type: ScenegraphLayer,
            scenegraph: "https://model-repo-488fcbb8-6cc3-4249-9acf-ea68bbdda2ee.s3.eu-west-2.amazonaws.com/car.glb",
            data: [{ position: [-122.420679, 37.772537], follow: true }],
            sizeScale: 10,
            getPosition: (d: ModelData) => {
                if (d.follow) {
                    this.camera.syncCameraToModel(d.position, 10);
                }
                console.log("model pos", d.position);
                return d.position;
            },
            getOrientation: () => [0, 0, 90],
            _animations: {
                "*": { speed: 1 },
            },
            _lighting: "pbr",
        });
        this.layer = modelLayer;
        this.map.addLayer(modelLayer as unknown as CustomLayerInterface);
    }
}

class Camera {
    constructor(map: Map) {
        this.map = map;
    }

    private readonly map: Map;

    private readonly refreshRate = 16;

    public syncCameraToModel(modelPosition: [number, number], bearing: number) {
        console.log("model", modelPosition);
        this.map.flyTo({
            center: modelPosition,
            bearing,
            maxDuration: this.refreshRate,
        });
    }

    public getRefreshRate() {
        return this.refreshRate;
    }
}

class GuideLine {
    constructor(map: Map) {
        this.map = map;
    }

    private map: Map;

    private guideLineId = "guide-line";

    public addGuideForRoute(route: GeoJSON.LineString, modelLayerId: string) {
        this.addGuideLineSource(route);
        this.addGuideLineLayer(modelLayerId);
    }

    private addGuideLineSource(route: GeoJSON.LineString) {
        this.map.addSource(this.guideLineId, { type: "geojson", data: route });
    }

    private addGuideLineLayer(modelLayerId: string) {
        const layer: LineLayerSpecification = {
            id: this.guideLineId,
            type: "line",
            paint: {
                "line-color": "blue",
                "line-width": 10,
            },
            source: this.guideLineId,
        };
        this.map.addLayer(layer, modelLayerId);
    }
}
