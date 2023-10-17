import React, { useState ,useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

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

    useEffect(()=> {
        setDate(props.date)
       },[props.date])

    addLocale('en', {
        firstDayOfWeek: 0,
        dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
        dayNamesMin: ['日', '月', '火', '水', '木', '金', '土'],
        monthNames: [
            '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        monthNamesShort: [
            '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
        ],
        today: '今日',
        clear: 'クリア'
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
