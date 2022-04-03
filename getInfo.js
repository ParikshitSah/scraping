const puppeteer = require("puppeteer");
const xlsx = require("xlsx");
const fs = require("fs");



const emailSelector = "#react-app > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(2)" 
const pageSM =
  "#react-app > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(5) > a";

const pageTitle = "#org-search-results > ul > div > div > a";
const loadMore =
  "#react-app > div > div > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-3 > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-9.MuiGrid-grid-lg-9 > div > div > div.outlinedButton > button  > div > div > span";

const titleSelector = "#react-app > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(1) > h1"

const fbUsername =
  "#mount_0_0_Jo > div > div:nth-child(1) > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.l9j0dhe7.dp1hu0rb.cbu4d94t.j83agx80 > div:nth-child(1) > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.gs1a9yip.owycx6da.btwxx1t3.ihqw7lf3.cddn0xzi > div > div > div > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.d2edcug0.hpfvmrgz.buofh1pr.g5gj957u.o8rfisnq.ph5uu5jm.b3onmgus.ecm0bbzt.on77hlbc.ihqw7lf3 > div > div > div:nth-child(2) > span > span > span.tojvnm2t.a6sixzi8.abs2jz4q.a8s20v7p.t1p8iaqh.k5wvi7nf.q3lfd5jv.pk4s997a.bipmatt0.cebpdrjk.qowsmv63.owwhemhu.dp1hu0rb.dhp61c6y.iyyx5f41";

async function getLinks() {
  //Returns page links
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "https://boilerlink.purdue.edu/organizations?branches=77161&categories=7537"
  ); //go to this page

  while (await page.$(loadMore)) {
    await page.waitForSelector(loadMore);
    await page.waitForSelector(loadMore);
    await page.click(loadMore);
    await page.waitForSelector(loadMore);
  }

  const Links = await page.$$eval(pageTitle, (Title) =>
    Title.map((Title) => Title.href)
  ); //get page link

  await browser.close();
  return Links;
}

async function social(url, page) {
  try {
    if (url.includes("www.instagram.com")) {
      let filter; 
      filter = url;
      let Instagram;
      Instagram = "insta: " + filter.replace("https://www.instagram.com/", "");
    
      if (Instagram.includes("/")) {
        Instagram = Instagram.split("/")[0];
        
      }
     
      return Instagram;


    } else if (url.includes("www.facebook.com")){

      let filter = url;
      let facebook;

      if (filter.includes("https://www.facebook.com/")) {
         facebook =
          "facebook: " + filter.replace("https://www.facebook.com/", ""); //remove facebook tag

       // return facebook;
      } else if (filter.includes("http://www.facebook.com/")) {
         facebook =
          "facebook: " + filter.replace("http://www.facebook.com/", ""); //remove facebook tag

       

        //return facebook;
      }

      if (url.includes("/groups/")) {
        return "facebook: **group**"; //for groups
      }

      if (facebook.includes("pages")) {
        // for pages
        let newer;
        
          newer =
            facebook.replace("pages/", ""); //remove pages
  
        newer = newer.split("/")[0]; //remove everything after last /
        return newer; //return newer
      } 
      
      if (facebook.includes("/")) {
        facebook = facebook.split("/")[0];
      }

      return facebook

    } 
    
    else if (url.includes("twitter.com")) {
      const Twitter = "twitter: " + url.replace("https://twitter.com/", "");
      console.log(Twitter);
      return Twitter;
    } else return "no insta twitter or fb";
  } catch (err) {
    console.log("social err");
  }
}

async function getInfo(url, page) {
  await page.goto(url);

  let Insta, textInsta, Facebook, textFacebook, Twitter, textTwitter, combined, allSocial, Email,Title;
  try {
    Insta = await page.$eval(
      '[aria-label="Visit our instagram"]',
      (SM) => SM.href
    );
    textInsta = await social(Insta, page);
  } catch (err) {
    console.log("no insta");
  }
  try {
    Twitter = await page.$eval(
      '[aria-label="Visit our twitter"]',
      (SM) => SM.href
    );
    textTwitter = await social(Twitter, page);
  } catch (err) {
    console.log("no twitter");
  }

  try{
    Email = await page.$eval(emailSelector, SM => SM.textContent);

    Email =  Email.replace(" Contact Email E:  ","")
  }catch(err){
    console.log("no email")
  }

  try{
    Title = await page.$eval(titleSelector, SM => SM.textContent);

  }catch(err){
    console.log("Title err")
  }

  try {

    //const Insta = await page.$eval("#react-app > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(5) > a:nth-child(2)", SM => SM.href);
    //const Insta = await page.$eval('[aria-label="Visit our instagram"]', SM => SM.href);
    Facebook = await page.$eval(
      '[aria-label="Visit our facebook"]',
      (SM) => SM.href
    );
    //const Twitter = await page.$eval('[aria-label="Visit our twitter"]', SM => SM.href);
    textFacebook = await social(Facebook, page);

    //const textInsta =  await social(Insta,page);
    //const textTwitter = await social(Twitter,page);

    // if(textTwitter === undefined){
    //   return textFacebook, textInsta
    // }

    // else if(textInsta === undefined)
    // {
    //   return textFacebook, textTwitter
    // }
    // else if(textFacebook === undefined)
    // {
    //   return textInsta, textTwitter
    // }
    // else
  } catch (err) {
    console.log("no Fb");
  }


  combined = textFacebook+" "+textInsta+" "+textTwitter;

  //  allSocial = allSocial.filter((element) => {
  //   return element !== undefined;
  // });

  allSocial = combined.replace(/undefined/g,'');

  return {
    //Email,
    Title,
allSocial,
Email
    // textInsta,
    // textFacebook,
    // textTwitter,
  };
  //const SM = await page.$$eval(pageSM, (SM) => SM.map((SM) => SM.href));

  //console.log(SM);

  //check for key word for social media
}

async function main() {
  const allData = [];
  try {
    const allLinks = await getLinks();

    console.log(allLinks);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // const objData ={
    //   link1:,

    // };
    for (let link of allLinks) {
      const data = await getInfo(link, page);
      allData.push(data);
      console.log(data);
    }

    const filtered = allData.filter((element) => {
      return element !== undefined;
    });
    // console.log(allData);
    console.log(filtered);

    //const aoaTitle = allData.map( T => [T] );
    //const Data = Object.assign({}, allData);

    // const wb = xlsx.utils.book_new();
    // const ws = xlsx.utils.json_to_sheet(filtered);

    // xlsx.utils.book_append_sheet(wb, ws);
    // xlsx.writeFile(wb, "1Allthestuff.xlsx");
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(filtered);

    xlsx.utils.book_append_sheet(wb, ws);
    xlsx.writeFile(wb, "1Final_normal.xlsx");
  } catch (err) {
    console.log(err);
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(filtered);

    xlsx.utils.book_append_sheet(wb, ws);
    xlsx.writeFile(wb, "Final_error.xlsx");
  }
}

main();
