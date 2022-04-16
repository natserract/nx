import format from 'date-fns/format'

type DateFormat = 'MMMM dd, yyyy' | 'dd MMM yyyy' | string

/**
 * @see https://date-fns.org/docs/format
 */
export const parseDate = (
  date: number | Date,
  dateFormat: DateFormat = 'dd MMM yyyy'
) => {
  if (date) {
    const newDate = new Date(date).toDateString()

    return format(new Date(newDate), dateFormat)
  }
}
