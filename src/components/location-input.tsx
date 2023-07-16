import { useQuery } from "@tanstack/react-query";
import { LocationListItem, getLocationList } from "../api/mapbox-direction";
import { useState } from "react";
import { InputComponent } from "./input";

type InputLocationProps = {
    selectedLocation: LocationListItem | {};
    onLocationSelected: (location: LocationListItem) => void;
};

export const InputLocationComponent = ({ selectedLocation, onLocationSelected }: InputLocationProps) => {
    const [searchString, setSearchString] = useState("");

    const { data: locations } = useQuery([`location-${searchString}`], () => getLocationList(searchString));

    return (
        <InputComponent
            setSearchString={setSearchString}
            searchResults={locations ?? []}
            selectedValue={selectedLocation}
            setSelectedValue={(location) => onLocationSelected(location)}
        />
    );
};
