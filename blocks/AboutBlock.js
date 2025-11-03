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
  <BlockContainer id="about" title="О клубе «Половинка успеха»" className="bg-white">
    <div className="flex flex-col gap-5 tablet:gap-8">
      <ul>
        <Item>
          Мы объединяем людей, которые ценят живое общение и стремятся наполнять
          свои вечера вдохновляющими встречами. Каждое мероприятие — возможность
          познакомиться с интересными собеседниками, найти партнёра для отношений
          или открыть новые общие увлечения.
        </Item>
        <Item>
          Команда организаторов тщательно продумывает формат встреч, атмосферу и
          состав участников, чтобы каждому было комфортно раскрыться, проявить
          себя и уходить домой с ощущением, что время прошло с пользой и в
          компании близких по духу людей.
        </Item>
      </ul>
      <BlockTitle title="Что вас ждёт на наших событиях" />
      <ul>
        <Item>
          Регулярные форматы для досуга: игровые вечера, гастровстречи,
          выездные экскурсии, совместные походы в театр и кино.
        </Item>
        <Item>
          Тёплая модерация и профессиональные ведущие, которые помогают быстро
          познакомиться, почувствовать себя частью сообщества и создать искренние
          связи.
        </Item>
        <Item>
          Поддержка после мероприятий — продолжайте общение в клубных чатах,
          договаривайтесь о совместных активностях и находите свою пару.
        </Item>
      </ul>
      <BlockTitle title="Наши цели" />
      <ul>
        <Item>
          Увеличение количества успешных знакомств: Повысить процент пар,
          образовавшихся через центр, и обеспечить их долгосрочное счастье и
          стабильность.
        </Item>
        <Item>
          Качество услуг и удовлетворенность клиентов: Постоянно улучшать
          качество предоставляемых услуг и стремиться к максимальной
          удовлетворенности клиентов.
        </Item>
        <Item>
          Расширение сети и охвата: Расширить географическое присутствие и
          количество мероприятий, привлекая больше участников и создавая новые
          возможности для знакомств.
        </Item>
      </ul>
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 tablet:grid-cols-2">
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
              Руководитель центра знакомств –{' '}
            </span>
            <span className="whitespace-nowrap">Надежда Губина</span>
          </H4>
        </div>
        <div className="flex items-center">
          <div className="relative rounded-3xl bg-general/5 px-6 py-6 tablet:px-10 tablet:py-10">
            <SvgKavichki className="absolute bottom-4 left-4 h-6 w-6 fill-general tablet:bottom-6 tablet:left-6 tablet:h-8 tablet:w-8 laptop:h-10 laptop:w-10" />
            <div className="italic text-center text-lg text-general tablet:text-2xl">
              Я уверена, что каждый может здесь найти не только свою половинку,
              но и близкий круг друзей, с которыми интересно проводить свободное
              время и воплощать общие идеи.
            </div>
            <SvgKavichki className="absolute top-4 right-4 h-6 w-6 rotate-180 fill-general tablet:top-6 tablet:right-6 tablet:h-8 tablet:w-8 laptop:h-10 laptop:w-10" />
          </div>
        </div>
      </div>
    </div>
  </BlockContainer>
)

export default AboutBlock
