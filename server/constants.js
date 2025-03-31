export const whatsappConstants = {
  krsk: {
    urlWithInstance: `${process.env.WHATSAPP_API_URL_KRSK}/waInstance${process.env.WHATSAPP_ID_INSTANCE_KRSK}`,
    token: process.env.WHATSAPP_TOKEN_KRSK,
  },
  nrsk: {
    urlWithInstance: `${process.env.WHATSAPP_API_URL_NRSK}/waInstance${process.env.WHATSAPP_ID_INSTANCE_NRSK}`,
    token: process.env.WHATSAPP_TOKEN_NRSK,
  },
  ekb: {
    urlWithInstance: `${process.env.WHATSAPP_API_URL_EKB}/waInstance${process.env.WHATSAPP_ID_INSTANCE_EKB}`,
    token: process.env.WHATSAPP_TOKEN_EKB,
  },
}
