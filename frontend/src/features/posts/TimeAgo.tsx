import { formatDistanceToNow, parseISO } from "date-fns";

const TimeAgo = ({ timeStamp }: {timeStamp: string}) => {
    let timeAgo = "";

    if (timeStamp) {
        const date = parseISO(timeStamp)
        const timePeriod = formatDistanceToNow(date)
        timeAgo = `${timePeriod} ago`
    }

  return (
    <span title={timeStamp}>
        {timeAgo}
    </span>
  )
}

export default TimeAgo