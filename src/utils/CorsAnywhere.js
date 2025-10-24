import { createServer } from "cors-anywhere";

createServer({
  origin: ['*']
}).listen(8088, 'localhost', () => {
  console.log('🌐Cors anywhere on')
})