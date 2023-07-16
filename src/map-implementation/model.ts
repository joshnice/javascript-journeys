import type { CustomLayerInterface } from "maplibre-gl";
import { Map } from "maplibre-gl";
import type { Layer } from "@deck.gl/core/typed";
import { MapboxLayer } from "@deck.gl/mapbox/typed";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";
import { length, lineChunk, rhumbBearing } from "@turf/turf";
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

    private speedsMetersPerSecond = {
        slow: 13, // Roughly 30 Mph
        medium: 18, // Roughly 40 Mph
        high: 22, // Roughly 50 Mph
        veryHigh: 31, // Roughly 70 Mph
    };

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
        const timeInSeconds = distanceMeters / this.speedsMetersPerSecond.veryHigh;
        const iterations = (timeInSeconds * 1000) / refreshRate;
        const section = distanceMeters / iterations;

        const chunks: GeoJSON.FeatureCollection<GeoJSON.Point> = lineChunk(route, section, { units: "meters" });
        const positions = chunks.features.map((feature) => {
            const point = feature.geometry.coordinates[0];
            const bearing = rhumbBearing(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
            return { coords: point, bearing };
        });

        const layer = this.getLayer();

        for (const position of positions) {
            layer.setProps({
                id: layer.id,
                data: [{ coords: position.coords, follow: true, bearing: 360 - position.bearing, cameraBearing: position.bearing }],
            });
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
            scenegraph: "https://model-repo-488fcbb8-6cc3-4249-9acf-ea68bbdda2ee.s3.eu-west-2.amazonaws.com/animated-car.glb",
            data: [{ coords: [-122.420679, 37.772537], follow: true, bearing: 0, cameraBearing: 0 }],
            sizeScale: 10,
            getPosition: (d: ModelData) => {
                if (d.follow) {
                    this.camera.syncCameraToModel(d.coords, d.cameraBearing);
                }
                return d.coords;
            },
            getOrientation: (d: ModelData) => {
                return [0, d.bearing, 90];
            },
            _animations: {
                "*": { speed: 1 },
            },
            _lighting: "pbr",
        });
        this.layer = modelLayer;
        this.map.addLayer(modelLayer as unknown as CustomLayerInterface);
    }
}
