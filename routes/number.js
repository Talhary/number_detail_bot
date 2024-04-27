const router = require('express').Router()
const info = require('../script')
const data = async(number)=>{
    let res;
      try {
        res = await info(number);
        console.log(res);
      } catch (error) {
        return {status:500,message:'Something goes wrong'}
      }
      if (!res[0]) {
        return {status:500,message:'not found anything'}
      }
      let message = ''
      for (let i = 0; i < res.length; i++) {
        let el = res[i];
        
         message = message +'\n\n\n\n\n'+ el.fullName +
            "\n \n" +
            el.phoneNumber +
            "\n\n" +
            el.cnicNumber +
            "\n\n" +
            el.address
        
      }
      return {status:201,message:message}
}
router.route('/number').get(async (req,res)=>{
const {number } = req.query
if(!number){
    return res.json({status:401,message:'Please enter your phone number'}).status(401)
}
// if (number.length > 11 || number.length < 11)
// return res.json({status:402,message:'Please enter correct phone number'}).status(402)
const {status,message} = await data(number)
return res.json({status,message})

})
module.exports = router