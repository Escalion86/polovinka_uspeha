import BlockContainer from '@components/BlockContainer'
import ListItem from '@components/ListItem'
import { H4, P } from '@components/tags'
import SvgKavichki from 'svg/SvgKavichki'

const AboutBlock = () => (
  <BlockContainer id="about" title="Наши цели" className="bg-white">
    <div className="flex flex-col gap-4 tablet:gap-6">
      <ListItem>
        <P>
          Помочь найти пару человеку в возрасте от 30 до 55 лет, который уже
          твердо стоит на ногах, успешен в какой-либо деятельности и
          заинтересован в построении серьезных отношений.
        </P>
      </ListItem>
      <ListItem>
        <P>
          Также помогаем расширить свои личные и деловые связи, через разные
          интересные форматы знакомств.
        </P>
      </ListItem>
      <div className="grid grid-col-1 tablet:grid-cols-2 gap-x-4">
        <div className="flex flex-col items-center justify-center col-span-1">
          <img
            className="object-contain max-h-100"
            src={'/img/other/gubina2.png'}
            alt="polovinka_uspeha"
          />
          <H4 className="italic">
            <span className="font-normal">
              Руководитель центра знакомств –{' '}
            </span>
            <span className="whitespace-nowrap">Надежда Губина</span>
          </H4>
        </div>
        <div className="flex items-center">
          <div className="relative px-6 py-6 tablet:py-10">
            <SvgKavichki className="absolute bottom-0 left-0 w-6 h-6 tablet:w-8 tablet:h-8 laptop:w-10 laptop:h-10 fill-general" />
            <div className="italic text-center taxt-lg tablet:text-2xl">
              Я уверена, что каждый может здесь найти не только свою половинку,
              но и партнеров по бизнесу, а также близкий круг друзей и
              единомышленников по своим интересам.
            </div>
            <SvgKavichki className="absolute top-0 right-0 w-6 h-6 rotate-180 tablet:w-8 tablet:h-8 laptop:w-10 laptop:h-10 fill-general" />
          </div>
        </div>
      </div>
    </div>
  </BlockContainer>
)

export default AboutBlock
