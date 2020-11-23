const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./api/db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'POST') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    req.method = 'GET'
    // req.params = req.body[Object.keys(req.body)[0] ];
    // delete req.body;
  }
  next();
})

// Filter by req.method
// server.all('*', function (req, res, next) {
//   // if (req.method === 'GET') {
//   //   next() // Continue
//   // } else {

//   // }
//   console.log(req.method)
//   if (req.method === 'POST') {
//     // Converts POST to GET and move payload to query params
//     // This way it will make JSON Server that it's GET request
//     req.method = 'GET'
//     req.query = req.body
//     delete req.body;
//   }
//   // Continue to JSON Server router
//   next()
// });
// Add this before server.use(router)
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
}))
server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running')
})
