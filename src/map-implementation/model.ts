import type { CustomLayerInterface } from "maplibre-gl";
import { Map } from "maplibre-gl";
import type { Layer } from "@deck.gl/core/typed";
import { MapboxLayer } from "@deck.gl/mapbox/typed";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";
import { length, lineChunk } from "@turf/turf";
import { v4 as uuid } from "uuid";
import { Camera } from "./camera";
import { ModelData } from "./types";

export class Model {
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

        // Breaks up the route into many sections
        const distanceMeters = length(route, { units: "meters" });
        const timeInSeconds = distanceMeters / this.speedSlow;
        const iterations = (timeInSeconds * 1000) / refreshRate;
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
