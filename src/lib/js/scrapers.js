// https://medium.com/data-scraper-tips-tricks/scraping-data-with-javascript-in-3-minutes-8a7cf8275b31

const cheerio = require('cheerio');
const rp = require('request-promise');

const RedesSociales = [
  'askfm',
  'twitch',
  'twitter',
  'youtube',
  'facebook',
  'linkedin',
  'instagram'
]

let Resultados_DuckDuckGo = {
  'RedesSociales': [],
  'Otros': []
}

module.exports = {

  Resultados: { 'DuckDuckGo': Resultados_DuckDuckGo },

  DuckDuckGo: (query) => {
    if(!query) return

    let url = 'https://duckduckgo.com/html/?ia=web&q='.concat(query.replace(' ','+'))

    // Cogemos el HTML de la página
    rp(url)
    .then((html) => {
      // Lo cargamos con cheerio
      const $ = cheerio.load(html)
      // Buscamos las etiquetas con las clases .results > .result > .result__a
      $('.results .result .result__a').each((i,element) => {
        // Parseamos los resultados
        let result = {
          'title': $(element).text(),
          'link': decodeURIComponent($(element)[0].attribs.href.replace('/l/?kh=-1&uddg=','')),
        }

        let clasificado = false
        RedesSociales.forEach((redSocial) => {
          if(!clasificado && result.link.toLowerCase().includes(redSocial)) {
            clasificado = true
            Resultados_DuckDuckGo.RedesSociales.push(result)
          }
        })
        if(!clasificado) Resultados_DuckDuckGo.Otros.push(result)
      })
      console.log(Resultados_DuckDuckGo)
    }).catch((error) => {
      // console.log(error)
    })
  }
}
