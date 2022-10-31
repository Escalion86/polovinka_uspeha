import BlockContainer from '@components/BlockContainer'
import ListItem from '@components/ListItem'
import { H2, H3, H4, P } from '@components/tags'
import SvgKavichki from 'svg/SvgKavichki'

const AboutBlock = () => (
  <BlockContainer id="about" title="Наши цели" className="bg-white">
    <div className="flex flex-col gap-4 tablet:gap-6">
      {/* <H2 className="sticky top-[6.5rem]">Наши цели</H2> */}
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
            // width={48}
            // height={48}
          />
          <H4 className="italic">
            Руководитель центра знакомств – Надежда Губина
          </H4>
        </div>
        <div className="flex items-center">
          <div className="relative px-6 py-6 tablet:py-10">
            {/* <div className="absolute bottom-0 left-0 object-contain w-10 h-10 text-general"> */}
            {/* <Image
                src="/img/other/kavichki.svg"
                layout="fill"
                className="fill-general"
              /> */}
            <SvgKavichki className="absolute bottom-0 left-0 w-6 h-6 tablet:w-8 tablet:h-8 laptop:w-10 laptop:h-10 fill-general" />
            {/* </div> */}

            {/* <img
            className="absolute top-0 left-0 object-contain"
            src={'/img/other/kavichki.png'}
            alt="kavichki"
          /> */}
            <div className="italic text-center taxt-lg tablet:text-2xl">
              Я уверена, что каждый может здесь найти не только свою половинку,
              но и партнеров по бизнесу, а также близкий круг друзей и
              единомышленников по своим интересам.
            </div>
            {/* <img
            className="absolute bottom-0 right-0 object-contain rotate-180"
            src={'/img/other/kavichki.png'}
            alt="kavichki"
          /> */}
            {/* <div className="absolute top-0 right-0 object-contain rotate-180"> */}
            {/* <Image src="/img/other/kavichki.svg" width="30" height="24" /> */}
            <SvgKavichki className="absolute top-0 right-0 w-6 h-6 rotate-180 tablet:w-8 tablet:h-8 laptop:w-10 laptop:h-10 fill-general" />
            {/* </div> */}
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col items-center justify-center flex-1 gap-y-4 tablet:gap-y-6"> */}
      {/* Руководитель центра знакомств – Надежда Губина .
«Мой центр помог мне найти свою вторую половинку, и я верю, что каждый может здесь найти не только свою половинку, но и партнеров по бизнесу, а также близкий круг друзей и единомышленников по своим интересам».
        
        <H2>Надежда Губина</H2>
        <H4>Руководитель центра осознанных знакомств "Половинка Успеха"</H4>
        <div className="text-lg laptop:text-xl">
          <ul className="flex flex-col gap-y-3">
            <ListItem>Помогаем успешным людям найти свою половинку</ListItem>
            <ListItem>
              Организовываем формат "Быстрые свидания" 1 раз в месяц
            </ListItem>
            <ListItem>
              Организовываем новые форматы знакомств 1 раз в месяц
            </ListItem>
            <ListItem>
              Подбираем пару для индивидуального свидания, учитывая
              психологическую совместимость партнёров
            </ListItem>
            <ListItem>
              Проводим диагностику и консультации по проблеме создания и
              выстраивания отношений
            </ListItem>
          </ul>
        </div> */}
      {/* </div> */}
      {/* <div className="flex justify-center flex-1">
        <img
          className="object-contain w-1/2 min-w-84 laptop:w-auto"
          src={'/img/other/gubina.webp'}
          alt="polovinka_uspeha"
          // width={48}
          // height={48}
        />
      </div> */}
    </div>
  </BlockContainer>
)

export default AboutBlock
