import { useRef } from "react";

const MapComponent = () => {
    const mapRef = useRef(null);

    return <div ref={mapRef} />;
};
