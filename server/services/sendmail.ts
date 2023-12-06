const nodemailer = require('nodemailer');
import {google} from 'googleapis';

export const sendMail = async (order : any, message : any, strapi : any, gmail : any) => {


  if(!gmail || !gmail.client_id || !gmail.client_secret || !gmail.from || !gmail.refresh_token || !gmail.languageRadio) {
    throw new Error("Invalid gmail data")
  }

  const oAuth2Client = new google.auth.OAuth2(gmail.client_id, gmail.client_secret, "https://developers.google.com/oauthplayground");
  oAuth2Client.setCredentials({refresh_token: gmail.refresh_token})



  const convertFromEURtoRSD = (rate: any, spreadPercentage: any,amount: any) => {
    // const spreadPercentage = 0.025 / 100;
    // const rate = 0.0082327;
    //
    const spread = amount * spreadPercentage;
    const amountWithoutSpread = amount + spread;
    return amountWithoutSpread / rate;
  }

  console.log("gmail", gmail)

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("accessToken",accessToken)
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmail.from,
        clientId: gmail.client_id,
        clientSecret: gmail.client_secret,
        refreshToken: gmail.refresh_token,
        accessToken: accessToken
      }
    })
    const profile = await strapi.plugin("omcommerce").service("profile").find({});
    if(profile === undefined){
      throw new Error("Invalid profile data!")
    }
    const cr = await strapi.plugin("omcommerce").service("conversionrate").find({});
    if(cr === undefined || !cr) {
      throw new Error("Invalid conversion rate data!");
    }
    console.log("conversionrate", cr)
    const rsd_value =  convertFromEURtoRSD(cr.rate,cr.spread,order.amount)
    const messageText = `Dear ${order.customer_name},\n\n`;

    if (order.discount === null) {
      order.discount = 0;
    }

    const ukupno = Math.round(rsd_value) - parseInt(order.discount);
    const totalPrice = Math.round(ukupno);
    const ordert = order.items.map((entry: { unit_amount: { value: string; currency_code: any; }; }) =>
    {
      return {
        ...entry,
        unit_amount : {value: convertFromEURtoRSD(cr.rate, cr.spread, parseFloat(entry.unit_amount.value)).toFixed(2),currency_code: entry.unit_amount.currency_code}
      }
    })
    order.items = ordert
    // const signature = '<tbody><tr style="height:90.75pt"><td style="border-right:1.5pt solid rgb(153,153,153);vertical-align:top;padding:5pt;overflow:hidden"><p dir="ltr" style="line-height:1.44;margin-top:0pt;margin-bottom:0pt"><img data-aii="CiExM2xkZGFFOWlkSVdNVkFNcllXRzZBcDhVZm9PVDR3X1o" width="96" height="96" src="https://ci3.googleusercontent.com/mail-sig/AIorK4ywSOT7D0PhyQgNPwCLI2RzzWkqPLSG6pOh7bHJDzdaF6qRUGQz8Ggi7Y510FhgYRbVt4mmg9c" data-os="https://lh3.googleusercontent.com/d/13lddaE9idIWMVAMrYWG6Ap8UfoOT4w_Z"><br></p></td><td style="border-left:1.5pt solid rgb(153,153,153);vertical-align:top;padding:5pt;overflow:hidden"><br></td><td style="vertical-align:top;padding:5pt;overflow:hidden"><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt"><span style="font-size:11pt;font-family:Arial;color:rgb(34,34,34);font-weight:700;vertical-align:baseline;white-space:pre-wrap">Support team</span></p><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt"><span style="font-size:11pt;font-family:Arial;color:rgb(34,34,34);font-weight:700;vertical-align:baseline;white-space:pre-wrap">Support</span></p><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt;padding:0pt 0pt 5pt"><a href="http://www.omomcode.com/" target="_blank"><span style="font-size:11pt;font-family:Arial;color:rgb(17,85,204);font-weight:700;vertical-align:baseline;white-space:pre-wrap">www.omomcode.com</span></a></p><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt;padding:0pt 0pt 5pt"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExMExHaG01M2IyLVJtdmw5TDZDTFJEcmViUDktMjlLdks" width="19" height="19" src="https://ci3.googleusercontent.com/mail-sig/AIorK4zx02rit2_4ZPj5O4td0jB_fjXGOuQZJP8F5Bwrl173Cwaut71joLcP2coX9HsBDQdVXpnXPgg" data-os="https://lh3.googleusercontent.com/d/10LGhm53b2-Rmvl9L6CLRDrebP9-29KvK" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExcW9NancyYjBBZTVEelF0ek4tZFBVVTdERGNLYUJrWmo" src="https://ci3.googleusercontent.com/mail-sig/AIorK4xwRHIQk2QJyxrSAEqnuzDSDR674yeBRllJTIjLYNuVJ234dTJg00pxeFO6csk58zBNpc9h1jE" data-os="https://lh3.googleusercontent.com/d/1qoMjw2b0Ae5DzQtzN-dPUU7DDcKaBkZj" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExNUlVSWkzd3VDYVdpLUlOd2xraldZc25PMG1GdUUxdWs" src="https://ci3.googleusercontent.com/mail-sig/AIorK4xv5q9N6UUJlGlyP6IuxrJefGRE4I_JVeJzqB2fxvN33IbpsRNpjgX_bIhSi6_5q7og3HbZNH8" data-os="https://lh3.googleusercontent.com/d/15IUIi3wuCaWi-INwlkjWYsnO0mFuE1uk" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExcy1FdHVRNUM4S2dHdjB4U2hTUm1zaVhha2pVT1Y0eEQ" src="https://ci3.googleusercontent.com/mail-sig/AIorK4ygD5-SiP6ZI2kc5hSla9tPtIMla6DGnFxMQ7rFu_nPAIX771sUE_idCFwpgJePq0CyqgkwZh0" data-os="https://lh3.googleusercontent.com/d/1s-EtuQ5C8KgGv0xShSRmsiXakjUOV4xD" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExT08xUWM1amhuT2FUbWQ5cWl5cWtpdGdPdEZWZTZQSFM" src="https://ci3.googleusercontent.com/mail-sig/AIorK4ydRVybWEbcEs_fdHb8ukBqunUhs69e6hFY1VAq7iq8jsZ8mBCKx-CzIVUG3NgkRvWvRYcNHOs" data-os="https://lh3.googleusercontent.com/d/1OO1Qc5jhnOaTmd9qiyqkitgOtFVe6PHS" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"></p></td></tr></tbody>'


    const orderTemp = order.items.map((entry: { name: any; quantity: any; unit_amount: { value: any; currency_code: any;}; }) =>

        `<div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
    <span>
    ${entry.name}:
      </span>
      <span style="text-align: right;">
      ${entry.quantity}  x   ${entry.unit_amount.value} ${cr.conversion_currency}
    </span>
    </div>`
    )

    let signature = "";
    if(gmail.languageRadio === "Serbian") {
      signature = `
<div style="display: flex; justify-content: center;font-family: Tahoma,sans-serif;padding:20px;">
    <div style="border-top-left-radius: 40px;border-top-right-radius: 40px;border: 5px solid #e6cfc5;justify-content: center; width: 600px;padding:5px;">

        <div style="display: grid; width:600px;background-color: #fff5ee;
 gap: 10px;
">
            <div class="center" align="center" valign="center" style="border-top-left-radius: 30px;border-top-right-radius: 30px;width: 100%; height:150px; background-color: #e6cfc5;font-size: 50px;font-weight: bold;color:white;">
				<p class="center" align="center">${profile.name}</p>
            </div>
            <div style="background-color: #f3e5e0;display: flex;
padding: 10px;
font-size: 20px;
justify-content:space-between;
">
                <span>
                    PRIMALAC
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Ime i prezime:
                </span>
                <span style="text-align: right;">
                    ${" " + order.customer_name + " " + order.customer_surname}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Adresa:
                </span>
                <span style="text-align: right;">
                    ${" " + order.address_line_1}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Grad i poštanski broj:
                </span>
                <span style="text-align: right;">
                    ${" " + order.postal_code + " " + order.admin_area_2}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Država:
                </span>
                <span style="text-align: right;">
                    ${" " + order.country_code}
                </span>
            </div>
        </div>
        <div style="display: grid; width:600px;background-color: #fff5ee;
    gap: 10px; padding-top:20px;
">
            <div style="background-color: #f3e5e0;display: flex;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    ADRESA DOSTAVE
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Ime i prezime:
                </span>
                <span style="text-align: right;">
                    ${" " + order.customer_name + " " + order.customer_surname}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Adresa:
                </span>
                <span style="text-align: right;">
                    ${" " + order.address_line_1}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Grad i poštanski broj:
                </span>
                <span style="text-align: right;">
                    ${" " + order.postal_code + " " + order.admin_area_2}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Država:
                </span>
                <span style="text-align: right;">
                    ${" " + order.country_code}
                </span>
            </div>

        </div>
        <div style="display: grid; width:600px;background-color: #fff5ee;
        gap: 10px; padding-top:20px;
    ">
            <div style="background-color: #f3e5e0;display: flex;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    PORUČENI PROIZVODI
                </span>
            </div>
            ${orderTemp}
        </div>
        <div style="display: grid; width:600px;background-color: #fff5ee;
            gap: 10px; padding-top:20px;
        ">
            <div style="background-color: #f3e5e0;display: flex;
            padding: 10px;
            font-size: 20px;
            justify-content:space-between;
            ">
                <span>
                    VREDNOST PORUDŽBINE
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                <span>
                    Popust:
                </span>
                <span style="text-align: right;">
                    ${order.discount} ${cr.conversion_currency}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                <span>
                    Poštarina:
                </span>
                <span style="text-align: right;">
                    ${order.shipping_fee} ${cr.conversion_currency}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                <span>
                    Cena:
                </span>
                <span style="text-align: right;">
                    ${ukupno} ${cr.conversion_currency}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                color: #ff3030;
                justify-content:space-between;
                ">
                <div>
                    UKUPNO:
                </div>
                <div style="text-align: right;">
                    ${" " + totalPrice} ${cr.conversion_currency}
                </div>
            </div>

        </div>
    </div>
</div>`;
    }
    else {
      `
<div style="display: flex; justify-content: center;font-family: Tahoma,sans-serif;padding:20px;">
    <div style="border-top-left-radius: 40px;border-top-right-radius: 40px;border: 5px solid #e6cfc5;justify-content: center; width: 600px;padding:5px;">

        <div style="display: grid; width:600px;background-color: #fff5ee;
 gap: 10px;
">
            <div class="center" align="center" valign="center" style="border-top-left-radius: 30px;border-top-right-radius: 30px;width: 100%; height:150px; background-color: #e6cfc5;font-size: 50px;font-weight: bold;color:white;">
				<p class="center" align="center">${profile.name}</p>
            </div>
            <div style="background-color: #f3e5e0;display: flex;
padding: 10px;
font-size: 20px;
justify-content:space-between;
">
                <span>
                    RECIPIENT
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    First and last name:
                </span>
                <span style="text-align: right;">
                    ${" " + order.customer_name + " " + order.customer_surname}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Address:
                </span>
                <span style="text-align: right;">
                    ${" " + order.address_line_1}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Postal code and city name:
                </span>
                <span style="text-align: right;">
                    ${" " + order.postal_code + " " + order.admin_area_2}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Country:
                </span>
                <span style="text-align: right;">
                    ${" " + order.country_code}
                </span>
            </div>
        </div>
        <div style="display: grid; width:600px;background-color: #fff5ee;
    gap: 10px; padding-top:20px;
">
            <div style="background-color: #f3e5e0;display: flex;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    SHIPPING ADDRESS
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    First and last name:
                </span>
                <span style="text-align: right;">
                    ${" " + order.customer_name + " " + order.customer_surname}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Address:
                </span>
                <span style="text-align: right;">
                    ${" " + order.address_line_1}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Postal code and city name:
                </span>
                <span style="text-align: right;">
                    ${" " + order.postal_code + " " + order.admin_area_2}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
    border-bottom: 2px solid #e6cfc5;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    Country:
                </span>
                <span style="text-align: right;">
                    ${" " + order.country_code}
                </span>
            </div>

        </div>
        <div style="display: grid; width:600px;background-color: #fff5ee;
        gap: 10px; padding-top:20px;
    ">
            <div style="background-color: #f3e5e0;display: flex;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    ORDERED PRODUCTS
                </span>
            </div>
            ${orderTemp} ${cr.conversion_currency}
        </div>
        <div style="display: grid; width:600px;background-color: #fff5ee;
            gap: 10px; padding-top:20px;
        ">
            <div style="background-color: #f3e5e0;display: flex;
            padding: 10px;
            font-size: 20px;
            justify-content:space-between;
            ">
                <span>
                    ORDER VALUE
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                <span>
                    Discount:
                </span>
                <span style="text-align: right;">
                    ${order.discount} ${cr.conversion_currency}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                <span>
                    Shipping fee:
                </span>
                <span style="text-align: right;">
                    ${order.shipping_fee} ${cr.conversion_currency}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                <span>
                    Price:
                </span>
                <span style="text-align: right;">
                    ${ukupno}
                </span>
            </div>
            <div style="background-color: #fff5ee;display: flex;
                border-bottom: 2px solid #e6cfc5;
                padding: 10px;
                font-size: 20px;
                color: #ff3030;
                justify-content:space-between;
                ">
                <div>
                    TOTAL:
                </div>
                <div style="text-align: right;">
                    ${" " + totalPrice} ${cr.conversion_currency}
                </div>
            </div>

        </div>
    </div>
</div>`;
    }

    //'Lucida Console', 'Courier New', monospace

    console.log("order", order)
    const mailOptions = {
      from: {
        name: profile?.name,
        address: gmail.from
      },
      to: order.email,
      // to: "alexmitrovic993@gmail.com",
      subject: 'Thank you for your purchase!',
      text: messageText + signature,
      html: messageText.replace(/\n/g, '<br>') + signature
    }
    return await transport.sendMail(mailOptions);

  } catch (err) {
    console.log("error", err)
    return err;
  }
}
