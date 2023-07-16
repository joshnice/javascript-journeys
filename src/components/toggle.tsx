import { Switch } from "@headlessui/react";
import { PropsWithChildren } from "react";

type ToggleProps = {
    value: boolean;
    setValue: (value: boolean) => void;
};

export const ToggleComponent = ({ value, setValue, children }: PropsWithChildren<ToggleProps>) => {
    return (
        <div className="flex justify-start gap-2 items-center">
            <Switch
                checked={value}
                onChange={setValue}
                className={`${value ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
                <span className={`${value ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
            </Switch>
            {children}
        </div>
    );
};
