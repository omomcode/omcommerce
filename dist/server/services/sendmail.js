"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = require('nodemailer');
const googleapis_1 = require("googleapis");
const sendMail = async (order, message, strapi, gmail) => {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(gmail.client_id, gmail.client_secret, process.env.STRAPI_ADMIN_EMAIL_REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: gmail.refresh_token });
    const findConversionRate = async (query, strapi) => {
        return await strapi.entityService.findOne("plugin::omcommerce.conversionrate", query);
    };
    const convertFromEURtoRSD = (rate, spreadPercentage, amount) => {
        // const spreadPercentage = 0.025 / 100;
        // const rate = 0.0082327;
        //
        const spread = amount * spreadPercentage;
        const amountWithoutSpread = amount + spread;
        return amountWithoutSpread / rate;
    };
    try {
        const accessToken = await oAuth2Client.getAccessToken();
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
        });
        const cr = await findConversionRate({}, strapi);
        const rsd_value = convertFromEURtoRSD(cr.rate, cr.spread, order.amount);
        const messageText = `Dear ${order.customer_name},\n\n`;
        const drzava = "Srbija";
        if (order.discount === null) {
            order.discount = 0;
        }
        const ukupno = rsd_value - parseInt(order.discount);
        const totalPrice = ukupno.toFixed(2);
        const ordert = order.items.map((entry) => {
            return {
                ...entry,
                unit_amount: { value: convertFromEURtoRSD(cr.rate, cr.spread, parseFloat(entry.unit_amount.value)).toFixed(2), currency_code: entry.unit_amount.currency_code }
            };
        });
        order.items = ordert;
        // const signature = '<tbody><tr style="height:90.75pt"><td style="border-right:1.5pt solid rgb(153,153,153);vertical-align:top;padding:5pt;overflow:hidden"><p dir="ltr" style="line-height:1.44;margin-top:0pt;margin-bottom:0pt"><img data-aii="CiExM2xkZGFFOWlkSVdNVkFNcllXRzZBcDhVZm9PVDR3X1o" width="96" height="96" src="https://ci3.googleusercontent.com/mail-sig/AIorK4ywSOT7D0PhyQgNPwCLI2RzzWkqPLSG6pOh7bHJDzdaF6qRUGQz8Ggi7Y510FhgYRbVt4mmg9c" data-os="https://lh3.googleusercontent.com/d/13lddaE9idIWMVAMrYWG6Ap8UfoOT4w_Z"><br></p></td><td style="border-left:1.5pt solid rgb(153,153,153);vertical-align:top;padding:5pt;overflow:hidden"><br></td><td style="vertical-align:top;padding:5pt;overflow:hidden"><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt"><span style="font-size:11pt;font-family:Arial;color:rgb(34,34,34);font-weight:700;vertical-align:baseline;white-space:pre-wrap">Support team</span></p><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt"><span style="font-size:11pt;font-family:Arial;color:rgb(34,34,34);font-weight:700;vertical-align:baseline;white-space:pre-wrap">Support</span></p><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt;padding:0pt 0pt 5pt"><a href="http://www.omomcode.com/" target="_blank"><span style="font-size:11pt;font-family:Arial;color:rgb(17,85,204);font-weight:700;vertical-align:baseline;white-space:pre-wrap">www.omomcode.com</span></a></p><p dir="ltr" style="line-height:1.656;margin-top:0pt;margin-bottom:0pt;padding:0pt 0pt 5pt"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExMExHaG01M2IyLVJtdmw5TDZDTFJEcmViUDktMjlLdks" width="19" height="19" src="https://ci3.googleusercontent.com/mail-sig/AIorK4zx02rit2_4ZPj5O4td0jB_fjXGOuQZJP8F5Bwrl173Cwaut71joLcP2coX9HsBDQdVXpnXPgg" data-os="https://lh3.googleusercontent.com/d/10LGhm53b2-Rmvl9L6CLRDrebP9-29KvK" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExcW9NancyYjBBZTVEelF0ek4tZFBVVTdERGNLYUJrWmo" src="https://ci3.googleusercontent.com/mail-sig/AIorK4xwRHIQk2QJyxrSAEqnuzDSDR674yeBRllJTIjLYNuVJ234dTJg00pxeFO6csk58zBNpc9h1jE" data-os="https://lh3.googleusercontent.com/d/1qoMjw2b0Ae5DzQtzN-dPUU7DDcKaBkZj" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExNUlVSWkzd3VDYVdpLUlOd2xraldZc25PMG1GdUUxdWs" src="https://ci3.googleusercontent.com/mail-sig/AIorK4xv5q9N6UUJlGlyP6IuxrJefGRE4I_JVeJzqB2fxvN33IbpsRNpjgX_bIhSi6_5q7og3HbZNH8" data-os="https://lh3.googleusercontent.com/d/15IUIi3wuCaWi-INwlkjWYsnO0mFuE1uk" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExcy1FdHVRNUM4S2dHdjB4U2hTUm1zaVhha2pVT1Y0eEQ" src="https://ci3.googleusercontent.com/mail-sig/AIorK4ygD5-SiP6ZI2kc5hSla9tPtIMla6DGnFxMQ7rFu_nPAIX771sUE_idCFwpgJePq0CyqgkwZh0" data-os="https://lh3.googleusercontent.com/d/1s-EtuQ5C8KgGv0xShSRmsiXakjUOV4xD" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"><span style="color:rgb(34,34,34)">&nbsp;</span><img data-aii="CiExT08xUWM1amhuT2FUbWQ5cWl5cWtpdGdPdEZWZTZQSFM" src="https://ci3.googleusercontent.com/mail-sig/AIorK4ydRVybWEbcEs_fdHb8ukBqunUhs69e6hFY1VAq7iq8jsZ8mBCKx-CzIVUG3NgkRvWvRYcNHOs" data-os="https://lh3.googleusercontent.com/d/1OO1Qc5jhnOaTmd9qiyqkitgOtFVe6PHS" width="19" height="19" style="color:rgb(34,34,34);margin-right:0px"></p></td></tr></tbody>'
        const orderTemp = order.items.map((entry) => `<div style="background-color: #fff;display: flex;
    border-bottom: 2px solid #000;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
    <span>
    ${entry.name}
      </span>
      <span style="text-align: right;">
      ${entry.quantity}  x   ${entry.unit_amount.value} RSD
    </span>
    </div>`);
        const signature = `
<div style="justify-content: center; width: 98vw;">

        <div style="display: grid; width:580px;background-color: #ffffff;
    padding: 10px; gap: 10px; padding-top:20px;
">
            <div style="width: 100%; height:100px; background-color: green;">
            </div>
            <div style="background-color: rgba(124, 255, 59, 0.5);display: flex;
    padding: 10px;
    font-size: 20px;
    justify-content:space-between;
    ">
                <span>
                    PRIMALAC RAČUNA
                </span>
            </div>
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
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
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    Ulica i broj:
                </span>
                <span style="text-align: right;">
                    ${" " + order.address_line_1}
                </span>
            </div>
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    Poštanski broj i grad:
                </span>
                <span style="text-align: right;">
                    ${" " + order.postal_code + " " + order.admin_area_2}
                </span>
            </div>
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    Država:
                </span>
                <span style="text-align: right;">
                    ${" " + drzava}
                </span>
            </div>
        </div>
            <div style="display: grid; width:600px;background-color: #ffffff;
        gap: 10px; padding-top:20px;
    ">
                <div style="background-color: rgba(124, 255, 59, 0.5);display: flex;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                    <span>
                        ADRESA ZA ISPORUKU
                    </span>
                </div>
                <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
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
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    Ulica i broj:
                </span>
                <span style="text-align: right;">
                    ${" " + order.address_line_1}
                </span>
            </div>
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    Poštanski broj i grad:
                </span>
                <span style="text-align: right;">
                    ${" " + order.postal_code + " " + order.admin_area_2}
                </span>
            </div>
            <div style="background-color: #fff;display: flex;
        border-bottom: 2px solid #000;
        padding: 10px;
        font-size: 20px;
        justify-content:space-between;
        ">
                <span>
                    Država:
                </span>
                <span style="text-align: right;">
                    ${" " + drzava}
                </span>
            </div>

            </div>
            <div style="display: grid; width:600px;background-color: #ffffff;
            gap: 10px; padding-top:20px;
        ">
                <div style="background-color: rgba(124, 255, 59, 0.5);display: flex;
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
            <div style="display: grid; width:600px;background-color: #ffffff;
                gap: 10px; padding-top:20px;
            ">
                <div style="background-color: rgba(124, 255, 59, 0.5);display: flex;
                padding: 10px;
                font-size: 20px;
                justify-content:space-between;
                ">
                    <span>
                        VREDNOST PORUDŽBINE
                    </span>
                </div>
                <div style="background-color: #fff;display: flex;
                    border-bottom: 2px solid #000;
                    padding: 10px;
                    font-size: 20px;
                    justify-content:space-between;
                    ">
                    <span>
                        Popust:
                    </span>
                    <span style="text-align: right;">
                        ${order.discount} RSD
                    </span>
                </div>
                <div style="background-color: #fff;display: flex;
                    border-bottom: 2px solid #000;
                    padding: 10px;
                    font-size: 20px;
                    justify-content:space-between;
                    ">
                    <span>
                        Poštarina:
                    </span>
                    <span style="text-align: right;">
                        ${order.shipping_fee} RSD
                    </span>
                </div>
                <div style="background-color: #fff;display: flex;
                    border-bottom: 2px solid #000;
                    padding: 10px;
                    font-size: 20px;
                    justify-content:space-between;
                    ">
                    <span>
                        Iznos porudžbine:
                    </span>
                    <span style="text-align: right;">
                        ${ukupno.toFixed(2)}
                    </span>
                </div>
                <div style="background-color: #fff;display: flex;
                    border-bottom: 2px solid #000;
                    padding: 10px;
                    font-size: 20px;
                    color: #ff0000;
                    justify-content:space-between;
                    ">
                    <div>
                        UKUPNO ZA PLAĆANJE:
                    </div>
                    <div style="text-align: right;">
                        ${" " + totalPrice} RSD
                    </div>
                </div>

            </div>
        </div>
</div>`;
        const mailOptions = {
            from: gmail.from,
            to: order.email,
            // to: "alexmitrovic993@gmail.com",
            subject: 'Hvala Vam na kupovini!',
            text: messageText + signature,
            html: messageText.replace(/\n/g, '<br>') + signature
        };
        return await transport.sendMail(mailOptions);
    }
    catch (err) {
        return err;
    }
};
exports.sendMail = sendMail;
