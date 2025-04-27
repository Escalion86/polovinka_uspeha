import CRUD from '@server/CRUD'

const collectionCheck = (collection) => {
  if (!collection) return false
  const lowercaseCollection = collection.toLowerCase()
  switch (lowercaseCollection) {
    case 'users':
      return 'Users'
    case 'events':
      return 'Events'
    case 'histories':
      return 'Histories'
    case 'additionalblocks':
      return 'AdditionalBlocks'
    case 'directions':
      return 'Directions'
    case 'eventsusers':
      return 'EventsUsers'
    case 'loginhistory':
      return 'LoginHistory'
    case 'payments':
      return 'Payments'
    case 'phoneconfirms':
      return 'PhoneConfirms'
    case 'products':
      return 'Products'
    case 'questionnaires':
      return 'Questionnaires'
    case 'questionnairesusers':
      return 'QuestionnairesUsers'
    case 'reminddates':
      return 'RemindDates'
    case 'reviews':
      return 'Reviews'
    case 'roles':
      return 'Roles'
    case 'services':
      return 'Services'
    case 'servicesusers':
      return 'ServicesUsers'
    case 'sitesettings':
      return 'SiteSettings'
    case 'test':
      return 'Test'
    case 'toolstemplates':
      return 'ToolsTemplates'
    case 'newsletters':
      return 'Newsletters'
    case 'individualweddings':
      return 'IndividualWeddings'
    default:
      return false
  }
}

export default async function handler(req, res) {
  const { query } = req
  const collection = query.collection
  const actualCollection = collectionCheck(collection)

  if (!actualCollection)
    return res?.status(400).json({ success: false, error: 'No collection' })
  delete query.collection

  return await CRUD(actualCollection, req, res)
}
