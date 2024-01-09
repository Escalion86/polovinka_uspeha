import BlockContainer from '@components/BlockContainer'
// import ListItem from '@components/ListItem'
import { H4, P } from '@components/tags'
import upperCaseFirst from '@helpers/upperCaseFirst'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { useRecoilValue } from 'recoil'
import SvgKavichki from 'svg/SvgKavichki'

const SupervisorBlock = () => {
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const { roditPadeg } = useRecoilValue(locationPropsSelector)
  const showOnSite = siteSettings?.supervisor?.showOnSite
  if (!showOnSite) return null

  return (
    <BlockContainer className="pt-0 -mt-8 bg-white">
      <div className="flex flex-col gap-4 tablet:gap-6">
        {/* <ListItem>
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
      </ListItem> */}
        <div className="flex flex-col-reverse items-center tablet:grid tablet:grid-col-1 tablet:grid-cols-2 gap-x-4">
          <div className="flex items-center">
            <div className="relative px-6 py-6 tablet:py-10">
              <SvgKavichki className="absolute bottom-0 left-0 w-6 h-6 tablet:w-8 tablet:h-8 laptop:w-10 laptop:h-10 fill-general" />
              <div className="italic text-center taxt-lg tablet:text-2xl">
                {siteSettings?.supervisor?.quote}
              </div>
              <SvgKavichki className="absolute top-0 right-0 w-6 h-6 rotate-180 tablet:w-8 tablet:h-8 laptop:w-10 laptop:h-10 fill-general" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center col-span-1">
            <img
              className="object-contain max-h-100"
              src={siteSettings?.supervisor?.photo}
              alt="supervisor"
              // width={48}
              // height={48}
            />
            <H4 className="italic">
              <span className="font-normal">
                Руководитель {upperCaseFirst(roditPadeg)} филиала –{' '}
              </span>
              <span className="whitespace-nowrap">
                {siteSettings?.supervisor?.name}
              </span>
            </H4>
          </div>
        </div>
      </div>
    </BlockContainer>
  )
}

export default SupervisorBlock
