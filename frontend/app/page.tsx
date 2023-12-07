import { Icon, Typography } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import "./page.sass"
import Script from "next/script"
import { IntroSection } from "./(components)/IntroSection/IntroSection"
import { ContactSection } from "./(components)/ContactSection/ContactSection"

function reveal() {
  const ELEMENT_VISIBLE_THRESHOLD = 200
  const ANIMATED_SELECTOR = ".revealed"
  const ANIMATED_ACTIVE_CLASSNAME = "active"
  let reveals = document.querySelectorAll(ANIMATED_SELECTOR)

  reveals.forEach((item) => {
    const windowHeight = window.innerHeight
    const elementTop = item.getBoundingClientRect().top
    const elementBottom = item.getBoundingClientRect().bottom

    const isElementTopVisibleOnBottom =
      elementTop < windowHeight - ELEMENT_VISIBLE_THRESHOLD
    const isElementBottomVisible = elementBottom - ELEMENT_VISIBLE_THRESHOLD > 0
    const shouldBeActive = isElementTopVisibleOnBottom && isElementBottomVisible

    if (shouldBeActive) {
      item.classList.add(ANIMATED_ACTIVE_CLASSNAME)
    } else {
      item.classList.remove(ANIMATED_ACTIVE_CLASSNAME)
    }
  })
}
function handleArrowDisappearIfOnBottom() {
  const ELEMENT_VISIBLE_THRESHOLD = 200
  const ANIMATED_SELECTOR = ".arrow"
  const ANIMATED_ACTIVE_CLASSNAME = "active"
  let reveals = document.querySelectorAll(ANIMATED_SELECTOR)

  reveals.forEach((item, idx) => {
    const windowHeight = window.innerHeight

    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const allContentHeight = document.documentElement.scrollHeight

    const shouldDisappear = scrollTop + windowHeight >= allContentHeight - ELEMENT_VISIBLE_THRESHOLD
    if (shouldDisappear) {
      item.classList.remove(ANIMATED_ACTIVE_CLASSNAME)
    } else {
      item.classList.add(ANIMATED_ACTIVE_CLASSNAME)
    }
  })
}

export default function Home() {
  const str = `${reveal.toString()} ${handleArrowDisappearIfOnBottom.toString()}
  reveal()
  if (typeof window !== 'undefined') {
    window.addEventListener("scroll", reveal)
    window.addEventListener("scroll", handleArrowDisappearIfOnBottom)
    }
  `

  return (
    <>
    <main className="main">
      <Script id="show-banner">{str}</Script>
      <IntroSection className="revealed"/>
      <section className=" revealed ">
        <Typography variant="h2" gutterBottom>
          Manage your business easily
        </Typography>
        <Typography variant="body2">
          Instrument cultivated alteration any favourable expression law far nor. Both new like tore but year. An from mean on with when sing pain. Oh to as principles devonshire companions unsatiable an delightful. The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.
          In no impression assistance contrasted. Manners she wishing justice hastily new anxious. At discovery discourse departure objection we. Few extensive add delighted tolerably sincerity her. Law ought him least enjoy decay one quick court. Expect warmly its tended garden him esteem had remove off. Effects dearest staying now sixteen nor improve.
          Yourself off its pleasant ecstatic now law. Ye their mirth seems of songs. Prospect out bed contempt separate. Her inquietude our shy yet sentiments collecting. Cottage fat beloved himself arrived old. Grave widow hours among him ﻿no you led. Power had these met least nor young. Yet match drift wrong his our.
          Drawings me opinions returned absolute in. Otherwise therefore sex did are unfeeling something. Certain be ye amiable by exposed so. To celebrated estimating excellence do. Coming either suffer living her gay theirs. Furnished do otherwise daughters contented conveying attempted no. Was yet general visitor present hundred too brother fat arrival. Friend are day own either lively new.
        </Typography>
      </section>
      <section className="revealed fade-left ">
        <Typography variant="h2" gutterBottom>
          Reliability
        </Typography>
        <Typography variant="body2">
          Instrument cultivated alteration any favourable expression law far nor. Both new like tore but year. An from mean on with when sing pain. Oh to as principles devonshire companions unsatiable an delightful. The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.
          In no impression assistance contrasted. Manners she wishing justice hastily new anxious. At discovery discourse departure objection we. Few extensive add delighted tolerably sincerity her. Law ought him least enjoy decay one quick court. Expect warmly its tended garden him esteem had remove off. Effects dearest staying now sixteen nor improve.
          Yourself off its pleasant ecstatic now law. Ye their mirth seems of songs. Prospect out bed contempt separate. Her inquietude our shy yet sentiments collecting. Cottage fat beloved himself arrived old. Grave widow hours among him ﻿no you led. Power had these met least nor young. Yet match drift wrong his our.
          Drawings me opinions returned absolute in. Otherwise therefore sex did are unfeeling something. Certain be ye amiable by exposed so. To celebrated estimating excellence do. Coming either suffer living her gay theirs. Furnished do otherwise daughters contented conveying attempted no. Was yet general visitor present hundred too brother fat arrival. Friend are day own either lively new.
        </Typography>
      </section>
      <section className='revealed fade-right '>
        <Typography variant="h2" gutterBottom>
          Performance
        </Typography>
        <Typography variant="body2">
          Instrument cultivated alteration any favourable expression law far nor. Both new like tore but year. An from mean on with when sing pain. Oh to as principles devonshire companions unsatiable an delightful. The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.
          In no impression assistance contrasted. Manners she wishing justice hastily new anxious. At discovery discourse departure objection we. Few extensive add delighted tolerably sincerity her. Law ought him least enjoy decay one quick court. Expect warmly its tended garden him esteem had remove off. Effects dearest staying now sixteen nor improve.
          Yourself off its pleasant ecstatic now law. Ye their mirth seems of songs. Prospect out bed contempt separate. Her inquietude our shy yet sentiments collecting. Cottage fat beloved himself arrived old. Grave widow hours among him ﻿no you led. Power had these met least nor young. Yet match drift wrong his our.
          Drawings me opinions returned absolute in. Otherwise therefore sex did are unfeeling something. Certain be ye amiable by exposed so. To celebrated estimating excellence do. Coming either suffer living her gay theirs. Furnished do otherwise daughters contented conveying attempted no. Was yet general visitor present hundred too brother fat arrival. Friend are day own either lively new.
        </Typography>
      </section>
      <section className='section  revealed'>
        <Typography variant="h2" gutterBottom>
          Style
        </Typography>
        <Typography variant="body2">
          Instrument cultivated alteration any favourable expression law far nor. Both new like tore but year. An from mean on with when sing pain. Oh to as principles devonshire companions unsatiable an delightful. The ourselves suffering the sincerity. Inhabit her manners adapted age certain. Debating offended at branched striking be subjects.
          In no impression assistance contrasted. Manners she wishing justice hastily new anxious. At discovery discourse departure objection we. Few extensive add delighted tolerably sincerity her. Law ought him least enjoy decay one quick court. Expect warmly its tended garden him esteem had remove off. Effects dearest staying now sixteen nor improve.
          Yourself off its pleasant ecstatic now law. Ye their mirth seems of songs. Prospect out bed contempt separate. Her inquietude our shy yet sentiments collecting. Cottage fat beloved himself arrived old. Grave widow hours among him ﻿no you led. Power had these met least nor young. Yet match drift wrong his our.
          Drawings me opinions returned absolute in. Otherwise therefore sex did are unfeeling something. Certain be ye amiable by exposed so. To celebrated estimating excellence do. Coming either suffer living her gay theirs. Furnished do otherwise daughters contented conveying attempted no. Was yet general visitor present hundred too brother fat arrival. Friend are day own either lively new.
        </Typography>
      </section>
      <ContactSection className='section revealed'/>
      <Icon className='arrow'>
        <KeyboardArrowDownIcon />
      </Icon>
    </main>
    <footer>
          Nunchakurest® Seyhak Ly ©
    </footer>
    </>
  )
}
