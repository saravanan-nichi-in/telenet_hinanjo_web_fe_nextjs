import React, { useState, useEffect, useContext } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

const TimeCalendarFloatLabel = (props) => {
    const {
        parentClass,
        parentStyle,
        timeFloatLabelProps = {}
    } = props;

    const {
        custom,
        timeClass,
        id,
        style,
        icon,
        showIcon,
        iconPos,
        name,
        onBlur,
        onChange,
        readOnlyInput,
        disabled,
        placeholder,
        text,
        ...restProps
    } = timeFloatLabelProps;

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
            <div className={`${parentClass} ${custom || 'custom_input'} p-float-label`} style={parentStyle}>
                <Calendar className={` ${timeClass}`}
                    id={id}
                    style={style}
                    value={date}
                    icon={icon || "pi pi-clock"}
                    showIcon={showIcon}
                    iconPos={iconPos || "right"}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => {
                        setDate(e.value);
                        if (onChange) {
                            onChange(e);
                        }
                    }}
                    timeOnly
                    readOnlyInput={readOnlyInput}
                    showSeconds={false}
                    disabled={disabled}
                    placeholder={placeholder}
                    hourFormat="24"
                    {...restProps}
                />
                <label htmlFor={id}>{text}</label>
            </div>
        </div>
    );
}

export default TimeCalendarFloatLabel;