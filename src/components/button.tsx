import { PropsWithChildren } from "react";

type ButtonProps = {
    onClick: () => void;
    disabled: boolean;
};

export const ButtonComponent = ({ onClick, disabled, children }: PropsWithChildren<ButtonProps>) => (
    <button
        className="p-2 border-2 border-black rounded-md hover:bg-slate-200 disabled:bg-slate-300 disabled:opacity-50"
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);
