import { useTimer } from "react-timer-hook";

type Props = {
  date: Date;
  onComplete?: () => void;
};

export default function Countdown({ onComplete, date }: Props) {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: date,
    onExpire: onComplete,
  });

  const daysFormatted = days < 10 ? "0" + days : days;
  const hoursFormatted = hours < 10 ? "0" + hours : hours;
  const minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
  const secondsFormatted = seconds < 10 ? "0" + seconds : seconds;

  const blocks = [
    {
      value: daysFormatted,
      label: "days",
    },
    {
      value: hoursFormatted,
      label: "hours",
    },
    {
      value: minutesFormatted,
      label: "minutes",
    },
    {
      value: secondsFormatted,
      label: "seconds",
    },
  ];

  return (
    <div className="flex w-full justify-center relative grid-cols-4 gap-1 mt-5 mb-5">
      {blocks.map((block) => (
        <div key={block.label} className="w-full">
          <div className="w-full flex items-center flex-col justify-center p-5">
            <span className="text-3xl leading-normal font-bold animate-move-txt-bg gradient-txt">{block.value}</span>
            <div className="text-lg uppercase leading-normal font-normal animate-move-txt-bg gradient-txt">
              {block.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
