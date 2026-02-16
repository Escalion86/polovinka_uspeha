import BlockContainer from '@components/BlockContainer'
import BlockTitle from '@components/BlockTitle'
import ListItem from '@components/ListItem'
import { H4, P } from '@components/tags'
import SvgKavichki from '@svg/SvgKavichki'
import Image from 'next/image'

const Item = ({ children }) => (
  <ListItem className="not-first:mt-3">
    <P className="leading-5">{children}</P>
  </ListItem>
)

const AboutBlock = () => (
  <BlockContainer id="about" title="Наша миссия" className="bg-white">
    <div className="flex flex-col gap-4 tablet:gap-6">
      <ul>
        <Item>
          Создавать пространство лёгкости и живого общения, где можно быть
          собой, отдыхать от суеты и естественно знакомиться с новыми людьми.
        </Item>
        <Item>
          Мы объединяем людей через офлайн-мероприятия разных форматов:
          дружеские, деловые, социальные и романтические знакомства, где
          романтический сценарий важен, но не является единственным.
        </Item>
      </ul>
      <BlockTitle title="Наши цели" />
      <ul>
        <Item>
          Рост целевой аудитории 30-50: привлекать активных людей, которым
          важно качественное окружение, безопасная атмосфера и живой контакт.
        </Item>
        <Item>
          Повторные посещения и качество среды: улучшать форматы мероприятий,
          модерацию и клиентский опыт, чтобы люди возвращались снова.
        </Item>
        <Item>
          Устойчивый рост проекта: развивать географию, увеличивать количество
          участников и повышать среднюю прибыль мероприятий.
        </Item>
      </ul>
      <div className="grid grid-col-1 tablet:grid-cols-2 gap-x-4">
        <div className="flex flex-col items-center justify-center col-span-1">
          <Image
            className="object-contain w-full h-auto max-h-100"
            src="/img/other/gubina2.png"
            alt="Надежда Губина"
            width={497}
            height={449}
            sizes="(min-width: 768px) 320px, 70vw"
          />
          <H4 className="italic">
            <span className="font-normal">
              Руководитель пространства живых встреч –{' '}
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
