import { Combobox } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { getLocationList } from "../api/mapbox-direction";
import { useState } from "react";

export const InputLocationComponent = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

    const { isLoading, data: locations } = useQuery(
        [`location-${searchValue}`],
        () => getLocationList(searchValue)
    );

    const handleSelectedLocation = (id: string) => {
        const selected = locations?.find((location) => location.id === id);
        if (selected != null) {
            setSelectedValue(selected.name);
        }
    };

    return (
        <div className="relative">
            <Combobox value={selectedValue} onChange={handleSelectedLocation}>
                <Combobox.Input
                    className="border-2 border-black p-2 rounded-lg w-full"
                    onChange={(event) => setSearchValue(event.target.value)}
                />
                <Combobox.Options
                    className={`border-2 border-black p-2 rounded-lg w-full absolute bg-white z-10 ${
                        locations?.length === 0 || isLoading ? "hidden" : ""
                    }`}
                >
                    {locations?.map((location) => (
                        <Combobox.Option key={location.id} value={location.id}>
                            <button className="text-left hover:bg-slate-100 w-full">
                                {location.name}
                            </button>
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox>
        </div>
    );
};
