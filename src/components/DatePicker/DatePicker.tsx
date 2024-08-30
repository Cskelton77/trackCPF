import moment, { Moment } from 'moment'
import ChevronLeft from '../Icons/Chevron-Left'
import ChevronRight from '../Icons/Chevron-Right'
import { DatePickerWrapper, DateSelector, YearWrapper } from './DatePicker.style'

interface DatePicker {
    date: Moment
}

const DatePicker = ({date}: DatePicker) => {

    const handleDateChange = () => {
        // console.log('date', date)
    }

    
    const formatDate = (date: Moment) => moment(date).format('MMM Do');

    return (
        <DatePickerWrapper>  
            <DateSelector>
                <ChevronLeft size={48} onClick={handleDateChange} />
                {formatDate(date)}
                <ChevronRight size={48} onClick={handleDateChange} />
            </DateSelector>
            <YearWrapper>
                {moment(date).format('yyyy')}
            </YearWrapper>
        </DatePickerWrapper>
    )
}

export default DatePicker