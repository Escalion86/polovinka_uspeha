import PulseButton from '@components/PulseButton'
import { H1, H3 } from '@components/tags'
import upperCaseFirst from '@helpers/upperCaseFirst'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import Link from 'next/link'
import Image from 'next/image'
import useRouter from '@utils/useRouter'
import { useAtomValue } from 'jotai'
import Svg30Plus from '@svg/Svg30Plus'
import CountDown from './components/CountDown'
import locationAtom from '@state/atoms/locationAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'

const TitleBlock = () => {
  const siteSettings = useAtomValue(siteSettingsAtom)
  const userIsLogged = !!useAtomValue(loggedUserAtom)
  const location = useAtomValue(locationAtom)
  const locationProps = useAtomValue(locationPropsSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const router = useRouter()
  const query = { ...router.query }
  delete query.location

  const townRu = locationProps?.townRu

  return (
    <section className="relative h-[calc(100vh-70px)] overflow-hidden text-white">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/img/bg.webp)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gray-900/75" />
      </div>

      <div className="relative flex items-center justify-center h-full px-6 py-12 tablet:px-12 laptop:px-20">
        <Svg30Plus className="absolute w-12 h-12 right-6 top-6 fill-general tablet:right-12 tablet:top-12 tablet:h-16 tablet:w-16 laptop:right-20 laptop:top-16 laptop:h-20 laptop:w-20" />

        <div className="flex justify-center flex-1 max-h-[350px] h-[20%]">
          <Image
            src="/img/logo.webp"
            alt="polovinka_uspeha"
            width={290}
            height={294}
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 280px, 60vw"
            priority
            className="object-contain max-w-[90%] laptop:max-w-[100%] h-full w-auto"
          />
        </div>

        <CountDown
          Wrapper={({ children }) => (
            <div className="flex flex-col items-center px-6 py-2 bg-white/20 tablet:px-10 gap-y-1 rounded-2xl">
              <div
                className="text-xl uppercase tablet:text-2xl"
                style={{ textShadow: '1px 1px 2px black' }}
              >
                Старт проекта через
              </div>
              {children}
            </div>
          )}
        />
        <div className="flex flex-col justify-between gap-y-2">
          <H1 style={{ textShadow: '1px 1px 2px black' }}>
            {townRu ? siteSettings.title : 'Центр серьёзных знакомств'}
          </H1>

              {townRu && (
                <div className="text-left">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1 text-lg font-semibold text-white transition border rounded-xl border-white/30 bg-white/15 hover:border-general hover:bg-general/20"
                    onClick={() => modalsFunc.browseLocation()}
                  >
                    {`г.${upperCaseFirst(townRu)}`}
                  </button>
                  <p className="mt-2 font-sans text-xs text-white/80">
                    Нажмите, чтобы выбрать другой город
                  </p>
                </div>
              )}

              <H3 className="flex flex-col text-left text-white/90 drop-shadow-lg">
                {townRu ? (
                  siteSettings.subtitle?.split('\n').map((str, index) => (
                    <span key={'subtitle' + index}>{str}</span>
                  ))
                ) : (
                  <>
                    Организуем мероприятия, где легко найти близких по духу людей
                    и построить серьёзные отношения
                  </>
                )}
              </H3>

              <p className="text-base text-white/80 tablet:text-lg">
                {townRu
                  ? `Встретимся в компании интересных людей ${upperCaseFirst(
                      townRu
                    )}, чтобы вместе ходить на мероприятия, учиться новому и начинать отношения, которые действительно важны.`
                  : 'Мы создаём тёплую атмосферу, объединяем единомышленников и регулярно проводим события, которые помогают раскрыться, расслабиться и встретить свою вторую половинку.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm tablet:text-base">
              {['Кино и театральные вечера', 'Настольные игры и квизы', 'Гастровстречи и путешествия', 'Психологические и творческие мастерские'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 border rounded-full border-white/30 bg-white/10 text-white/90 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-start gap-4 tablet:flex-row tablet:items-center tablet:gap-6">
              {townRu ? (
                <Link
                  prefetch={false}
                  href={{
                    pathname: userIsLogged
                      ? `/${location}/cabinet/events`
                      : `/${location}/login`,
                    query: !userIsLogged && {
                      ...query,
                      registration: true,
                    },
                  }}
                  shallow
                >
                  <PulseButton
                    className="min-w-[220px]"
                    title={userIsLogged ? 'Перейти в кабинет' : 'Присоединиться к событиям'}
                    noPulse={userIsLogged}
                  />
                </Link>
              ) : (
                <>
                  <PulseButton
                    className="min-w-[220px]"
                    title="Выбрать город и зарегистрироваться"
                    onClick={() => modalsFunc.browseLocation({ isRegister: true })}
                  />
                  <PulseButton
                    className="min-w-[220px]"
                    title="Уже с нами — войти"
                    onClick={() => modalsFunc.browseLocation({ isRegister: false })}
                  />
                </>
              )}

              <div className="text-sm text-white/70 tablet:text-base">
                Живые эмоции, новые друзья и встречи офлайн каждую неделю
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative flex items-center justify-center w-full h-full max-w-sm p-6 overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm tablet:p-8">
              <Image
                src="/img/logo.webp"
                alt="polovinka_uspeha"
                width={320}
                height={320}
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 70vw"
                priority
                className="h-auto w-full max-w-[260px] object-contain tablet:max-w-[300px]"
              />
            </div>

            <CountDown
              Wrapper={({ children }) => (
                <div className="flex flex-col items-center w-full max-w-sm px-6 py-4 text-center gap-y-2 rounded-2xl bg-white/10 backdrop-blur">
                  <div className="text-lg font-semibold tracking-wide uppercase text-white/80 tablet:text-xl">
                    До ближайшего события осталось
                  </div>
                  {children}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TitleBlock
