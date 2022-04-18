import BlockContainer from '@components/BlockContainer'
import ListItem from '@components/ListItem'
import { H3, H4 } from '@components/tags'

const AboutBlock = () => (
  <BlockContainer id="about" className="bg-white">
    <div className="flex flex-col-reverse gap-4 tablet:gap-6 laptop:flex-row">
      <div className="flex flex-col items-center justify-center flex-1 gap-y-4 tablet:gap-y-6">
        <H3>Надежда Губина</H3>
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
        </div>
      </div>
      <div className="flex justify-center flex-1">
        <img
          className="object-contain w-1/2 min-w-84 laptop:w-auto"
          src={'/img/other/gubina.webp'}
          alt="polovinka_uspeha"
          // width={48}
          // height={48}
        />
      </div>
    </div>
  </BlockContainer>
)

export default AboutBlock
