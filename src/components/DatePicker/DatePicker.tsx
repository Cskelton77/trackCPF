import moment, { Moment } from 'moment';
import ChevronLeft from '../Icons/Chevron-Left';
import ChevronRight from '../Icons/Chevron-Right';
import { DatePickerWrapper, DateSelector, Day, YearWrapper } from './DatePicker.style';

interface DatePicker {
  date: Moment;
  setDisplayDate: (date: Moment) => void;
}

const DatePicker = ({ date, setDisplayDate }: DatePicker) => {
  console.log(date);
  const handleDateChange = (dir: string) => {
    if (dir == 'back') {
      const yesterday = date.clone().subtract(1, 'day');
      setDisplayDate(yesterday);
    } else {
      const tomorrow = date.clone().add(1, 'day');
      // Removing this logic for now, maybe we wanto to go into the future for reasons.
      //   const isTomorrowTheFuture = moment(tomorrow).isAfter(moment(), 'day');
      //   if (!isTomorrowTheFuture) {
      setDisplayDate(tomorrow);
      //   }
    }
  };

  const formatDate = (date: Moment) => moment(date).format('MMM Do');
  const getDay = (date: Moment) => moment(date).format('dddd');
  return (
    <DatePickerWrapper>
      <Day>{getDay(date)}</Day>
      <DateSelector>
        <ChevronLeft size={48} onClick={() => handleDateChange('back')} label="Previous Day" />
        {formatDate(date)}
        <ChevronRight size={48} onClick={() => handleDateChange('fwd')} label="Next Day" />
      </DateSelector>
      <YearWrapper>{moment(date).format('yyyy')}</YearWrapper>
    </DatePickerWrapper>
  );
};

export default DatePicker;
