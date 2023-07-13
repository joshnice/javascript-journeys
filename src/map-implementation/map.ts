import { CustomLayerInterface, Map } from "maplibre-gl";

import type { Layer } from "@deck.gl/core/typed";
import { MapboxLayer } from "@deck.gl/mapbox/typed";
import { ScenegraphLayer } from "@deck.gl/mesh-layers/typed";

import { v4 as uuid } from "uuid";

export class MapLibreImplementation {
    constructor(mapElement: HTMLElement) {
        this.map = new Map({
            container: mapElement,
            center: [-122.420679, 37.772537],
            zoom: 20,
            style: "https://api.maptiler.com/maps/streets/style.json?key=IHriHQgQWN2WA4EHxu0r",
            attributionControl: false,
        });

        this.map.once("styledata", () => {
            this.addModelLayers();
        });
    }

    private map: Map;

    private layers: MapboxLayer<Layer>[] = [];

    public startRoute(route: GeoJSON.LineString) {
        console.log(route);
        const layer = this.layers[0];
        console.log("layer", layer);
        // layer.setProps({ id: layer.id, data: [ {position: [-122.420679, 37.772537]} ] });
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
            sizeScale: 3,
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
