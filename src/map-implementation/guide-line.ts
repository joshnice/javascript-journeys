import type { GeoJSONSource, LineLayerSpecification } from "maplibre-gl";
import { Map } from "maplibre-gl";

export class GuideLine {
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
        const source = this.map.getSource(this.guideLineId) as GeoJSONSource;

        if (source) {
            source.setData(route);
        } else {
            this.map.addSource(this.guideLineId, { type: "geojson", data: route });
        }
    }

    private addGuideLineLayer(modelLayerId: string) {
        if (!this.map.getLayer(this.guideLineId)) {
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
}
