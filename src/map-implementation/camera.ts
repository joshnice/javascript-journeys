import { Map } from "maplibre-gl";

export class Camera {
    constructor(map: Map) {
        this.map = map;
    }

    private readonly map: Map;

    private readonly refreshRate = 16;

    public syncCameraToModel(modelPosition: [number, number], bearing: number) {
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
