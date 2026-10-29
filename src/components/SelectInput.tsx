import { Label, ListBox, Select } from "@heroui/react";

interface SelectProps {
    label: string;
    error?: string;
    options: {
        value: string;
        label: string;
    }[];
    placeholder?: string;
    value?: string | null;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    name?: string;
}

export default function SelectInput({label,error,options,placeholder,value,onChange,onBlur,name}: SelectProps) {
    return (
        <div>
            <Select
                fullWidth
                name={name}
                onChange={(key)=> onChange?.(String(key))}
                onBlur={onBlur}
                value={value || null}
                placeholder={placeholder}
                className="text-gray-400 group"
            >
                <Label className="mb-1">{label}</Label>
                <Select.Trigger className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg group-data-[open=true]:ring-brand-500 group-data-[open=true]:border-brand-500!  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white group-data-[open=true]:ring-1 focus:outline-none">
                    <Select.Value className="data-[placeholder=true]:text-gray-400" />
                    <Select.Indicator className="text-gray-400" />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox>
                        {options.map((option) => (
                            <ListBox.Item
                                key={option.value}
                                id={option.value}
                                textValue={option.label}
                            >
                                {option.label}
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>
            {error && (
                <p className="mt-1 text-sm text-brand-500">{error}</p>
            )}
        </div>
    );
}


