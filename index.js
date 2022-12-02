const { format } = require("date-fns")
const { v4: uuid} = require("uuid")

console.log('server starting...');

console.log(format(new Date(), "ddMMyyyy\thh:mm:ss"))

console.log(uuid())