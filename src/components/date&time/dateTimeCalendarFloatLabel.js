import React, { useContext, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { Button } from '../button';
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";

const DateTimeCalendarFloatLabel = (props) => {
    const {
        parentClass,
        dateTimeFloatLabelProps = {}
    } = props;
    
    const {
        custom,
        id,
        inputId,
        name,
        onBlur,
        onChange,
        style,
        dateTimeClass,
        icon,
        iconPos,
        disabledDates,
        disabledDays,
        minDate,
        maxDate,
        selectionMode,
        readOnlyInput,
        showIcon,
        disabled,
        placeholder,
        text,
        ...restProps
    } = dateTimeFloatLabelProps;

    const [date, setDate] = useState(props.date);
    
    const { localeJson } = useContext(LayoutContext);
   
    addLocale('en', {
        firstDayOfWeek: 0,
        dayNames: [translate(localeJson, 'sunday'), translate(localeJson, 'monday'), translate(localeJson, 'tuesday'), translate(localeJson, 'wednesday'), translate(localeJson, 'thursday'), translate(localeJson, 'friday'), translate(localeJson, 'saturday')],
        dayNamesShort: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        dayNamesMin: [translate(localeJson, 'su'), translate(localeJson, 'mo'), translate(localeJson, 'tu'), translate(localeJson, 'we'), translate(localeJson, 'th'), translate(localeJson, 'fr'), translate(localeJson, 'sa')],
        monthNames: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'),translate(localeJson, 'aug'),translate(localeJson, 'sep'),translate(localeJson, 'oct'),translate(localeJson, 'nov'),translate(localeJson, 'dec')],
        monthNamesShort: [translate(localeJson, 'jan'), translate(localeJson, 'feb'), translate(localeJson, 'mar'), translate(localeJson, 'apr'), translate(localeJson, 'may'), translate(localeJson, 'jun'), translate(localeJson, 'jul'),translate(localeJson, 'aug'),translate(localeJson, 'sep'),translate(localeJson, 'oct'),translate(localeJson, 'nov'),translate(localeJson, 'dec')],
        today: translate(localeJson,'today'),
        clear: translate(localeJson,'clear')
    });

    const calendarRef = useRef(null);

    /**
     *Function to close calendar modal
     */
    const closeCalendar = () => {
        if (calendarRef.current) {
            calendarRef.current.hide();
        }
    };

    /**
     * Function to update date
     */
    const handleUpdate = () => {
        setDate(calendarRef.current.props.value);
        closeCalendar();
    };

    return (
        <div className='custom-align-label'>
            <div className={`${parentClass} ${custom || 'custom_input'} p-float-label`}>
                <Calendar className={` custom-dateCalendar ${dateTimeClass}`}
                    id={id}
                    showTime
                    ref={calendarRef}
                    inputId={inputId}
                    value={date}
                    name={name}
                    style={style}
                    onBlur={onBlur}
                    onChange={(e) => {
                        setDate(e.value);
                        if (onChange) {
                            onChange(e);
                        }
                    }
                    }
                    dateFormat={translate(localeJson,'dateFormat')}
                    disabledDates={disabledDates}
                    disabledDays={disabledDays}
                    minDate={minDate}
                    maxDate={maxDate}
                    selectionMode={selectionMode || "single"}
                    readOnlyInput={readOnlyInput}
                    icon={icon || "pi pi-calendar"}
                    iconPos={iconPos || "right"}
                    showIcon={showIcon}
                    disabled={disabled}
                    placeholder={placeholder}
                    footerTemplate={() => (
                        <>
                            <hr />
                            <div className="text-center">
                                <Button buttonProps={{
                                    buttonClass: "w-8rem",
                                    type: "submit",
                                    text: translate(localeJson, 'ok'),
                                    severity: "primary",
                                    onClick: handleUpdate
                                }} parentClass={"inline"} />
                                <Button buttonProps={{
                                    buttonClass: "text-600 w-8rem",
                                    bg: "bg-white",
                                    hoverBg: "hover:surface-500 hover:text-white",
                                    text: translate(localeJson, 'cancel'),
                                    onClick: () => {
                                        closeCalendar();
                                    }
                                }} parentClass={"inline pl-2"} />

                            </div>
                        </>
                    )}
                    {...restProps}
                />
                <label htmlFor={inputId}>{text}</label>
            </div>
        </div>
    );
}

export default DateTimeCalendarFloatLabel             