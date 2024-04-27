const cheerio = require("cheerio");


// fetch("https://simownerdata.pk/wp-admin/admin-ajax.php", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
//     "content-type": "application/x-www-form-urlencoded",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "cookie": "_ga=GA1.1.233030858.1714184207; _ga_04TKCLTNF9=GS1.1.1714184206.1.1.1714184213.0.0.0",
//     "Referer": "https://simownerdata.pk/sim-database/",
//     "Referrer-Policy": "strict-origin-when-cross-origin"
//   },
//   "body": "action=get_number_data&get_number_data=searchdata=3101502365",
//   "method": "POST"
// }).then(res=>res.json()).then(res=>console.log(res))

const data = async (number) => {
  try {
    let res = await fetch(
      "https://simownerdata.pk/wp-admin/admin-ajax.php",
      {
        headers: {
    "accept": "*/*",
    "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "_ga=GA1.1.233030858.1714184207; _ga_04TKCLTNF9=GS1.1.1714184206.1.1.1714184213.0.0.0",
    "Referer": "https://simownerdata.pk/sim-database/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
        body: `action=get_number_data&get_number_data=searchdata=${number}`,
        method: "POST",
      }
    );
    res = await res.json();
    console.log(res)
    if (res.success) {
      const $ = cheerio.load(res.data);

      const result = [];

      $(".result-card").each((index, element) => {
        const fullName = $(element)
          .find('.field:contains("FULL NAME") div')
          .text()
          .trim();
        const phoneNumber = $(element)
          .find('.field:contains("PHONE #") div')
          .text()
          .trim();
        const cnicNumber = $(element)
          .find('.field:contains("CNIC #") div')
          .text()
          .trim();
        const address = $(element)
          .find('.field:contains("ADDRESS") div')
          .text()
          .trim();

        const entry = {
          fullName,
          phoneNumber,
          cnicNumber,
          address,
        };

        result.push(entry);
      });

      return result;
    } else {
      throw new Error("Not found");
    }
  } catch (error) {
    return error;
  }
};
data("3101502365").then((res) => console.log(res));
module.exports = data;
