const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const reCaptchaRes = await fetch(
        'https://www.google.com/recaptcha/api/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=6Lcw5bwkAAAAADoHjZWmW7_gzcFjDlOC6_29r6Dm&response=${req.body.gRecaptchaToken}`,
        }
      ).then((response) => response.json())

      console.log(
        reCaptchaRes,
        'Response from Google reCaptcha verification API'
      )
      if (reCaptchaRes?.success && reCaptchaRes?.score > 0.5) {
        // Save data to the database from here
        return res.status(200).json({
          status: 'success',
          message: 'Enquiry submitted successfully',
        })
      }

      return res.status(200).json({
        status: 'failure',
        message: 'Google ReCaptcha Failure',
      })
    } catch (err) {
      return res.status(405).json({
        status: 'failure',
        message: 'Error submitting the enquiry form',
      })
    }
  } else {
    res.status(405)
    res.end()
  }
}

export default handler
