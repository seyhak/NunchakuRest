
import { CircularProgress, CircularProgressProps, Typography } from "@mui/material"
import "./ProgressWithCounter.sass"

export type ProgressWithCounterProps = {
  counter: number
  progress: CircularProgressProps['value']
}
export const ProgressWithCounter = ({
  counter,
  progress
}: ProgressWithCounterProps) => {
  return (
    <div className="progress-with-counter">
    <div>
      <CircularProgress size={50} className="progress" variant="determinate" value={progress} />
      <Typography className="number" variant="body1">{counter}</Typography>
    </div>
  </div>
  )
}
