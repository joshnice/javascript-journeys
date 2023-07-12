import { useEffect, useRef } from "react";
import { MapLibreImplementation } from "../map-implementation/map";

export const MapComponent = () => {
    const mapElementRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreImplementation>();

    useEffect(() => {
        if (mapElementRef.current != null) {
            mapRef.current = new MapLibreImplementation(mapElementRef.current);
        }

        return () => {
            mapRef.current?.destory();
        };
    }, []);

    return <div className="w-full h-full" ref={mapElementRef} />;
};
