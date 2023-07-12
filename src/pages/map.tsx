import { InputLocationComponent } from "../components/input";
import { MapComponent } from "../components/map";

export const MapPage = () => {
    return (
        <div className="flex w-full h-full">
            <div className="w-4/5 h-full">
                <MapComponent />
            </div>
            <div className="flex flex-grow flex-col p-4 gap-4">
                <div className="flex flex-col gap-2 w-full">
                    Starting Destination
                    <InputLocationComponent />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    Final Destination
                    <InputLocationComponent />
                </div>
            </div>
        </div>
    );
};
