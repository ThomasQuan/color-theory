import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { FC } from "react";

export interface DropdownOption {
    value: string;
    label: string;
}

interface DropdownProps {
    label?: string;
    value: string;
    options: DropdownOption[];
    onChange: (value: string | null) => void;
}
const Dropdown: FC<DropdownProps> = ({ value, options, onChange, label }) => {
    return (
        <div className=" h-fit w-52 ">
            {label && <p className="block text-sm/6">{label}</p>}
            <Combobox value={value} onChange={(value) => onChange(value)}>
                <div className="relative">
                    <ComboboxInput
                        aria-label="Assignee"
                        className={clsx(
                            "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 ",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                        )}
                        displayValue={(options: string) => {
                            return options;
                        }}
                        onChange={(event) => onChange(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        "w-[var(--input-width)] rounded-xl border border-white/5 bg-black  p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                        "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
                    )}
                >
                    {options.map((option) => (
                        <ComboboxOption
                            key={option.value}
                            value={option.value}
                            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-400"
                        >
                            <CheckIcon className="invisible size-4 fill-green-600 group-data-[selected]:visible" />
                            <div className="text-sm/6 ">{option.label}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
};

export default Dropdown;
export { Dropdown };
