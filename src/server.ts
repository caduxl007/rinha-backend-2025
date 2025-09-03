import {  server } from './app'

server.listen({port: 9999}).then(() => {
  console.log('Server is running port 9999')
})