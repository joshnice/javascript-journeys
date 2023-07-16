import { Map } from "maplibre-gl";

export class Camera {
    constructor(map: Map) {
        this.map = map;
    }

    private readonly map: Map;

    private readonly refreshRate = 16;

    private followModel = false;

    public syncCameraToModel(modelPosition: [number, number], bearing: number) {
        const additionalOptions = this.additionalCameraOptions({ bearing, followModel: this.followModel });
        this.map.flyTo({
            center: modelPosition,
            maxDuration: this.refreshRate,
            ...additionalOptions,
        });
    }

    public setFollowModel(value: boolean) {
        this.followModel = value;
    }

    private additionalCameraOptions(options: { bearing: number; followModel: boolean }) {
        const cameraOptions = {};
        if (options.followModel) {
            cameraOptions["bearing"] = options.bearing;
        }
        return cameraOptions;
    }

    public getRefreshRate() {
        return this.refreshRate;
    }
}
