import moment, { Moment } from 'moment';
import ChevronLeft from '../Icons/Chevron-Left';
import ChevronRight from '../Icons/Chevron-Right';
import { DatePickerWrapper, DateSelector, Day, YearWrapper } from './DatePicker.style';

interface DatePicker {
  date: Moment;
  setDisplayDate: (date: Moment) => void;
}

const DatePicker = ({ date, setDisplayDate }: DatePicker) => {
  const handleDateChange = (dir: string) => {
    if (dir == 'back') {
      const yesterday = date.clone().subtract(1, 'day');
      setDisplayDate(yesterday);
    } else {
      const tomorrow = date.clone().add(1, 'day');
      const isTomorrowTheFuture = moment(tomorrow).isAfter(moment(), 'day');
      if (!isTomorrowTheFuture) {
        setDisplayDate(tomorrow);
      }
    }
  };

  const formatDate = (date: Moment) => moment(date).format('MMM Do');
  const getDay = (date: Moment) => moment(date).format('dddd');
  return (
    <DatePickerWrapper>
      <Day>{getDay(date)}</Day>
      <DateSelector>
        <ChevronLeft size={48} onClick={() => handleDateChange('back')} />
        {formatDate(date)}
        <ChevronRight size={48} onClick={() => handleDateChange('fwd')} />
      </DateSelector>
      <YearWrapper>{moment(date).format('yyyy')}</YearWrapper>
    </DatePickerWrapper>
  );
};

export default DatePicker;
