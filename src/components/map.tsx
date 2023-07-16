import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { MapLibreImplementation } from "../map-implementation/map";
import { getRoute } from "../api/mapbox-direction";

export type MapRef = {
    startRoute: (start: [number, number], finish: [number, number]) => void;
    setFollowModel: (value: boolean) => void;
};

export const MapComponent = forwardRef((_, mapRef) => {
    const mapElementRef = useRef<HTMLDivElement>(null);
    const mapLibreImplementationRef = useRef<MapLibreImplementation>();

    useImperativeHandle(
        mapRef,
        () => ({
            startRoute: async (start: [number, number], finish: [number, number]) => {
                const route = await getRoute(start, finish);
                mapLibreImplementationRef.current?.startRoute(route);
            },
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
