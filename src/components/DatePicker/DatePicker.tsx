import moment, { Moment } from 'moment';
import { ChevronLeft, ChevronRight } from '@/Icons';
import { DatePickerWrapper, DateSelector, Day, YearWrapper } from './DatePicker.style';

interface DatePickerInterface {
  date: Moment;
  setDisplayDate: (date: Moment) => void;
  compact?: boolean;
}

const DatePicker = ({ date, setDisplayDate, compact = false }: DatePickerInterface) => {
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

  const iconSize = compact ? 36 : 48;
  return (
    <DatePickerWrapper>
      {!compact && <Day>{getDay(date)}</Day>}
      <DateSelector $compact={compact}>
        <ChevronLeft
          size={iconSize}
          onClick={() => handleDateChange('back')}
          label="Previous Day"
        />
        {formatDate(date)}
        <ChevronRight size={iconSize} onClick={() => handleDateChange('fwd')} label="Next Day" />
      </DateSelector>
      {!compact && <YearWrapper>{moment(date).format('yyyy')}</YearWrapper>}
    </DatePickerWrapper>
  );
};

export default DatePicker;
