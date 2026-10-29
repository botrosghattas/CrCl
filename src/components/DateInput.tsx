import { Calendar, DateField, DatePicker, Label } from "@heroui/react";
import { parseDate } from "@internationalized/date";

interface dateOfBirth {
    label: string;
    value?: string | null;
    onChange?: (value: string) => void;
    error?: string;
    name?: string;
    onBlur?: () => void;
}

export default function DateInput({
    value,
    name,
    error,
    onChange,
    onBlur,
    label,
}: dateOfBirth) {
    return (
        <div>
            <DatePicker
                className="w-full"
                name={name}
                value={value ? parseDate(value) : null}
                onChange={(date) => onChange?.(date ? date.toString() : "")}
                onBlur={onBlur}
            >
                <Label>{label}</Label>
                <DateField.Group
                    fullWidth
                    className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:ring-1 focus:outline-none h-auto! p-0.5 "
                >
                    <DateField.Input>
                        {(segment) => (
                            <DateField.Segment
                                className="dark:text-white text-gray-900 data-[placeholder=true]:text-gray-400 data-[focused=true]:bg-gray-400/20 "
                                segment={segment}
                            />
                        )}
                    </DateField.Input>
                    <DateField.Suffix>
                        <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator className="text-gray-400" />
                        </DatePicker.Trigger>
                    </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                    <Calendar aria-label="Event date">
                        <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                                <Calendar.YearPickerTriggerHeading />
                                <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                            <Calendar.GridHeader>
                                {(day) => (
                                    <Calendar.HeaderCell className="text-gray-400">
                                        {day}
                                    </Calendar.HeaderCell>
                                )}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                                {(date) => (
                                    <Calendar.Cell
                                        date={date}
                                        className="data-[selected=true]:bg-brand-500 data-[hovered=true]:bg-brand-500/50 data-[selected=true]:text-white data-[disabled=true]:text-gray-700 data-[today=true]:text-gray-500 data-[today=true]:bg-gray-600/40"
                                    />
                                )}
                            </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                                {({ year }) => (
                                    <Calendar.YearPickerCell year={year} />
                                )}
                            </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                    </Calendar>
                </DatePicker.Popover>
            </DatePicker>
            {error && <p className="mt-1 text-sm text-brand-500">{error}</p>}
        </div>
    );
}
