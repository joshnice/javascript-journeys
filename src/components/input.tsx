import { Combobox } from "@headlessui/react";

interface InputProps<TValue extends { id: string; name: string }> {
    setSearchString: (searchString: string) => void;
    searchResults: TValue[];
    selectedValue: TValue | {};
    setSelectedValue: (value: TValue) => void;
}

export const InputComponent = <TValue extends { id: string; name: string }>({
    setSearchString,
    searchResults,
    selectedValue,
    setSelectedValue,
}: InputProps<TValue>) => (
    <div className="relative">
        <Combobox value={selectedValue} onChange={setSelectedValue}>
            <Combobox.Input
                className="border-2 border-black p-2 rounded-lg w-full"
                onChange={(event) => setSearchString(event.target.value)}
                displayValue={(result: TValue) => result?.name ?? ""}
            />
            <Combobox.Options className={`border-2 border-black p-2 rounded-lg w-full absolute bg-white z-10`}>
                {searchResults?.map((result) => (
                    <Combobox.Option key={result.id} value={result}>
                        <button className="text-left hover:bg-slate-100 w-full">{result.name}</button>
                    </Combobox.Option>
                ))}
            </Combobox.Options>
        </Combobox>
    </div>
);
