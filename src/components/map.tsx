import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapLibreImplementation } from "../map-implementation/map";
import { getRoute } from "../api/mapbox-direction";

export type MapRef = {
    startRoute: () => void;
    setFollowModel: (value: boolean) => void;
};

export const MapComponent = forwardRef((_, mapRef) => {
    const mapElementRef = useRef<HTMLDivElement>(null);
    const mapLibreImplementationRef = useRef<MapLibreImplementation>();

    const { data: route } = useQuery(["route"], () => getRoute([-74.166105, 40.679633], [-74.157753, 40.677373]));

    useImperativeHandle(
        mapRef,
        () => ({
            startRoute: () => mapLibreImplementationRef.current?.startRoute(route),
            setFollowModel: (value: boolean) => mapLibreImplementationRef.current?.setCameraFollowModel(value),
        }),
        [mapLibreImplementationRef.current]
    );

    useEffect(() => {
        if (mapElementRef.current != null) {
            mapLibreImplementationRef.current = new MapLibreImplementation(mapElementRef.current);
        }

        return () => {
            mapLibreImplementationRef.current?.destroy();
        };
    }, []);

    return <div className="w-full h-full" ref={mapElementRef} />;
});
