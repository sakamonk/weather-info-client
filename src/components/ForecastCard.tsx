import { ForecastCardProps } from "../types/ForecastCardProps";

const ForecastCard: React.FC<ForecastCardProps> = ({
  children,
  onDragStart,
  onDrop,
  onDragOver,
  bgImageUrl,
}) => {
  return (
    <div
      className="bg-cyan-800 dark:bg-darkblue py-1 px-1 flex flex-col justify-between rounded bg-contain bg-no-repeat"
      draggable="true"
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: '10%',
        backgroundPosition: '50% 5%'
      }}
    >
      {children}
    </div>
  )
}

export { ForecastCard };
