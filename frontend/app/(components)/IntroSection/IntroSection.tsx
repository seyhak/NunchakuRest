import { Typography } from "@mui/material"
import classNames from "classnames"
import "./IntroSection.sass"

export type IntroSectionProps = {
  className?: string
}
export const IntroSection = ({
  className
}: IntroSectionProps) => {
  return(
    <section className={classNames("intro", className)}>
      <div className="description-wrapper">
        <Typography variant="h2" gutterBottom>
          NunchakuRest
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
      </div>
    </section>
  )
}