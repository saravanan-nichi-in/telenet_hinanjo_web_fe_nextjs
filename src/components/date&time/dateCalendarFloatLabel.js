import React, { useEffect, useState, useContext } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

const DateCalendarFloatLabel = (props) => {
    const {
        parentClass,
        dateFloatLabelProps = {}
    } = props;

    const {
        custom,
        id,
        name,
        onBlur,
        dateClass,
        disabledDates,
        disabledDays,
        minDate,
        maxDate,
        selectionMode,
        onChange,
        showIcon,
        disabled,
        readOnlyInput,
        placeholder,
        text,
        spanClass,
        spanText,
        ...restProps
    } = dateFloatLabelProps;

    const [date, setDate] = useState(props.date);

    const { localeJson } = useContext(LayoutContext);

    useEffect(() => {
        setDate(props.date)
    }, [props.date])

    addLocale('en', {
        firstDayOfWeek: 0,
        dayNames: [translate(localeJson, 'sunday'), translate(localeJson, 'monday'), translate(localeJson, 'tuesday'), translate(localeJson, 'wednesday'), translate(localeJson, 'thursday'), translate(localeJson, 'friday'), translate(localeJson, 'saturday')],
        dayNamesShort: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        dayNamesMin: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        monthNames: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'), translate(localeJson, 'aug'), translate(localeJson, 'sep'), translate(localeJson, 'oct'), translate(localeJson, 'nov'), translate(localeJson, 'dec')],
        monthNamesShort: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'), translate(localeJson, 'aug'), translate(localeJson, 'sep'), translate(localeJson, 'oct'), translate(localeJson, 'nov'), translate(localeJson, 'dec')],
        today: translate(localeJson, 'today'),
        clear: translate(localeJson, 'clear')
    });

    return (
        <div className='custom-align-label'>
            <div className={`${parentClass} ${custom || 'custom_input'} p-float-label`}>
                <Calendar className={` custom-dateCalendar ${dateClass}`}
                    id={id}
                    name={name}
                    value={date}
                    onBlur={onBlur}
                    onChange={(e) => {
                        setDate(e.value);
                        if (onChange) {
                            onChange(e);
                        }
                    }}
                    dateFormat={translate(localeJson, 'dateFormat')}
                    disabledDates={disabledDates}
                    disabledDays={disabledDays}
                    minDate={minDate}
                    maxDate={maxDate}
                    selectionMode={selectionMode || "single"}
                    readOnlyInput={readOnlyInput}
                    showIcon={showIcon}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...restProps}
                />
                <label htmlFor={id}>{text}<span className={spanClass}>{spanText}</span></label>
            </div>
        </div>
    );
}

export default DateCalendarFloatLabel;