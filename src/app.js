

const axios = require('axios');

const feeds = ['https://expressen.se/rss/nyheter',
'https://gt.se/rss/nyheter',
'https://kvp.se/rss/nyheter',
'https://expressen.se/rss/sport',
'https://expressen.se/rss/noje',
'https://expressen.se/rss/debatt',
'https://expressen.se/rss/ledare',
'https://expressen.se/rss/kultur',
'https://expressen.se/rss/ekonomi',
'https://expressen.se/rss/halsa',
'https://expressen.se/rss/levabo',
'https://expressen.se/rss/motor',
'https://expressen.se/rss/res',
'https://expressen.se/rss/dokument']

let Parser = require('rss-parser');
let parser = new Parser();


const express = require('express')

const app = express()

const port = 3000;

app.get('/', async (req, res) => {

  let allItems = [];

  allItems = feeds.map(feed => parser.parseURL(feed));

  console.log(await Promise.allSettled(allItems)).filter(item=> !!item).flatMap(item => item.items)
  
  
  
  allItems = (await Promise.finally(allItems)).filter(item=> !!item).flatMap(item => item.items)
  



  const guids = [];
  const filteredItems = allItems.reduce((acc, value) => {
    if (!guids.includes(value.guid)) {
      guids.push(value.guid);
      acc.push(value)
    }
    return acc;
  }, [])

  filteredItems.sort((a,b) => {
    return (a.isoDate > b.isoDate) ? -1 : ((a.isoDate < b.isoDate) ? 1 : 0)
  })


  const listItems = filteredItems.slice(0,10).map(filteredItem => {
    const listItem = `
    <li>
      <a href = "${filteredItem.link}">${filteredItem.title}</a>    
    </li>
    `;
    return listItem;
  })

  const htmlReply = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>

  <ul>
  ${listItems.join('')}  
  </ul>
  
  </body>
  </html>  
  `

  console.log(htmlReply)
  res.send(htmlReply);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
