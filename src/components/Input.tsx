import { Description, Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";
import { FC } from "react";

interface InputProps {
    className?: string;
    label?: string;
    description?: string;
    onChange?: (e: any) => void;
    placeholder?: string;
}

const InputField: FC<InputProps> = ({
    className = "",
    label,
    description,
    onChange,
    placeholder
}) => {
    return (
        <div className={clsx("w-full max-w-md px-4", className)}>
            <Field>
                <Label className="text-sm/6 font-medium">{label}</Label>
                <Description className="text-sm/6 text-secondary/50">{description}</Description>
                <Input
                    onChange={onChange}
                    placeholder={placeholder}
                    className={clsx(
                        "mt-3 block w-full rounded-lg border-none bg-secondary/5 py-1.5 px-3 text-sm/6 ",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    )}
                />
            </Field>
        </div>
    );
};

export default InputField;
export { InputField };
