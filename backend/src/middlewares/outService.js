require('dotenv').config()

const outOfService = async (req, res) => {
  try {
    return res.status(423).json({
      statusCode: 423,
      error: {
        message: 'L’opération ne peut avoir lieu car la ressource est verrouillée.'
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      statusCode: 500,
      error: {
        message: 'Server Error. Please try again later'
      }
    })
  }
}

module.exports = outOfService
