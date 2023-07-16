import { useRef, useState } from "react";
import { InputLocationComponent } from "../components/location-input";
import { MapComponent, MapRef } from "../components/map";
import { ToggleComponent } from "../components/toggle";
import { ButtonComponent } from "../components/button";
import { LocationListItem } from "../api/mapbox-direction";

type RoutePosition = "start" | "finish";

type RouteLocation = { start: LocationListItem | null; finish: LocationListItem | null };

export const MapPage = () => {
    const mapRef = useRef<MapRef>();

    const [followModel, setFollowModel] = useState(false);
    const handleSetFollowModel = (value: boolean) => {
        mapRef.current?.setFollowModel(value);
        setFollowModel(value);
    };

    const [routeLocations, setRouteLocations] = useState<RouteLocation>({
        start: null,
        finish: null,
    });

    const handleLocationChange = (location: LocationListItem, position: RoutePosition) => {
        setRouteLocations({ ...routeLocations, [position]: location });
    };

    console.log("routeLocations", routeLocations);

    const handleStartJourney = () => {
        const { start, finish } = routeLocations;
        if (start != null && finish != null) {
            mapRef.current?.startRoute(start.center, finish.center);
        }
    };

    return (
        <div className="flex w-full h-full">
            <div className="w-4/5 h-full">
                <MapComponent ref={mapRef} />
            </div>
            <div className="flex flex-grow flex-col p-4 gap-4">
                <div className="flex flex-col gap-2 w-full">
                    Starting Destination
                    <InputLocationComponent
                        selectedLocation={routeLocations.start}
                        onLocationSelected={(location) => handleLocationChange(location, "start")}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    Final Destination
                    <InputLocationComponent
                        selectedLocation={routeLocations.finish}
                        onLocationSelected={(location) => handleLocationChange(location, "finish")}
                    />
                </div>
                <div>
                    <ButtonComponent onClick={handleStartJourney} disabled={false}>
                        <span>Start Journey</span>
                    </ButtonComponent>
                </div>
                <div>
                    <ToggleComponent value={followModel} setValue={handleSetFollowModel}>
                        <span>Camera follow Model</span>
                    </ToggleComponent>
                </div>
            </div>
        </div>
    );
};
