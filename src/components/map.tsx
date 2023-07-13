import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapLibreImplementation } from "../map-implementation/map";
import { getRoute } from "../api/mapbox-direction";

export const MapComponent = () => {
    const mapElementRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreImplementation>();

    const { data: route } = useQuery(["route"], () => getRoute([-74.166105, 40.679633], [-74.157753, 40.677373]));

    useEffect(() => {
        if (mapElementRef.current != null) {
            mapRef.current = new MapLibreImplementation(mapElementRef.current);
        }

        return () => {
            mapRef.current?.destory();
        };
    }, []);

    useEffect(() => {
        mapRef.current?.startRoute(route);
    }, [route]);

    return <div className="w-full h-full" ref={mapElementRef} />;
};
