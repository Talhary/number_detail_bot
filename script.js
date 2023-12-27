const cheerio = require("cheerio");
const data = async (number) => {
  try {
    let res = await fetch(
      "https://simownerdetails.pk/wp-admin/admin-ajax.php",
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua":
            '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          cookie:
            "_ga_04TKCLTNF9=GS1.1.1703514125.1.0.1703514125.0.0.0; _ga=GA1.1.347773137.1703514125; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CP3V7wAP3V7wAEsACBENAgEgAAAAAEPgAB5QAAAQaQD2F2K2kKFkPCmQWYAQBCijYEAhQAAAAkCBIAAgAUgQAgFIIAgAIFAAAAAAAAAQEgCQAAQABAAAIACgAAAAAAIAAAAAAAQQAAAAAIAAAAAAAAEAQAAAAAQAAAAIAABEhCAAQQAEAAAAAAAQAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAgAA%22%2C%221~%22%2C%227A5AFCD8-57D5-4081-A594-597DF983E0B0%22%5D%5D",
          Referer: "https://simownerdetails.pk/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `action=get_number_data&get_number_data=searchdata=${number}`,
        method: "POST",
      }
    );
    res = await res.json();

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
// data("").then((res) => console.log(res));
module.exports = data;
