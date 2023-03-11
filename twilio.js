const express = require('express')


const accountSid = "ACec0ae6f0215f2e72e9e9091f5dab307d";
const authToken = "6e809ee165ee4736f8b41a728592da8c";
const verifySid = "VA9d3bc4726b3f2f91de7327f845b97841";
const client = require("twilio")(accountSid, authToken);

module.exports={
    sentotp :(number) =>{
      console.log('wert')
      client.verify.v2 
    .services(verifySid)
    .verifications.create({ to: `+91 ${number} `, channel: "sms" })
   },
      check: async (otpCode,number) => {
            try{
      const status = await client.verify.v2
                .services(verifySid)
                .verificationChecks.create({ to: `+91 ${number}`, code: otpCode });
                 return status
            }catch(err){
                console.log(err);
            }   
        }
      }
  