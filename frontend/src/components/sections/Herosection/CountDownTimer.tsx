import { useEffect, useState } from "react";
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    type TimeLeft = {
        Days: number;
        Hours: number;
        Minutes: number;
        Seconds: number;
      };
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) return null;
  
      return {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60),
      };
    };
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      return () => clearInterval(timer);
    }, [targetDate]);
    if (!timeLeft) {
      return <div className="text-2xl text-white font-bold">We are live now!</div>;
    }
  
    return (
      <div className="flex gap-6 text-black text-2xl font-mono mt-4 items-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <span className="text-4xl font-bold">{value}</span>
            <span>{unit}</span>
          </div>
        ))}
      </div>
    );
  };

  export default CountdownTimer;