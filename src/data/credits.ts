/** Credits for the open-licence reference photographs shown on the site. */
export type Credit = { title: string; author?: string; licence: string; licenceUrl: string; source: string; url: string };

const BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const BY_4 = "https://creativecommons.org/licenses/by/4.0/";
const BY_2 = "https://creativecommons.org/licenses/by/2.0/";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";

export const CREDITS: Credit[] = [
  { title: "Late 1900s zinc plated M12 8 G hex head machine bolt and nut", author: "R. Henrik Nilsson", licence: "CC BY 4.0", licenceUrl: BY_4, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=197596331" },
  { title: "Silver hex nuts bolt (2 fotos)", licence: "CC0", licenceUrl: CC0, source: "rawpixel", url: "https://www.rawpixel.com/image/6018761/photo-image-public-domain-construction-free" },
  { title: "Banjo bolts", author: "Alison Cassidy", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Banjo_bolts.jpg" },
  { title: "Mid 20th century Beru spark plug 175 18 U2", author: "R. Henrik Nilsson", licence: "CC BY 4.0", licenceUrl: BY_4, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=195503086" },
  { title: "Porsche Boxster 986 Ph. 2 brake disc", author: "Friday83260", licence: "CC BY-SA 4.0", licenceUrl: BY_SA_4, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=36116030" },
  { title: "Car engine part shows details of throttle body", author: "Shixart1985", licence: "CC BY 2.0", licenceUrl: BY_2, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=186975290" },
  { title: "Deuce front suspension detail", author: "Trekphiler", licence: "CC BY 3.0", licenceUrl: "https://creativecommons.org/licenses/by/3.0/", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=4525127" },
  { title: "Fiat Panda 2003 suspension shock absorbers", author: "Pava", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=25621210" },
  { title: "Shock absorber demonstration example SDVN 12 50", author: "R. Henrik Nilsson", licence: "CC BY 4.0", licenceUrl: BY_4, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=176435730" },
  { title: "Spring brake air cylinder", author: "Panoha", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=3663688" },
  { title: "Air brakes relay valve", author: "Panoha", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=3663594" },
  { title: "Air foot valve", author: "Panoha", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=3663619" },
  { title: "Trailer brake relay valve", author: "Panoha", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=3663396" },
  { title: "Air disc brake", author: "Panoha", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=3639003" },
  { title: "Hydraulic hose fittings", author: "Jstapko", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=22893146" },
  { title: "Banjo Fitting Example", author: "Gregzsidisin", licence: "CC BY-SA 4.0", licenceUrl: BY_SA_4, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Banjo_Fitting_Example.jpg" },
  { title: "Hydraulic cylinder", author: "S.J. de Waard", licence: "CC BY 2.5", licenceUrl: "https://creativecommons.org/licenses/by/2.5/", source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=10186219" },
  { title: "Socket wrenches 002 y 003", author: "Ocdp", licence: "CC0", licenceUrl: CC0, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=177204747" },
  { title: "Gedore No. 7 combination wrenches 6–19 mm", author: "Lucasbosch", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=55038798" },
  { title: "Close-up view of various hydraulic hoses", author: "nenadstojkovicart", licence: "CC BY 2.0", licenceUrl: BY_2, source: "Flickr", url: "https://www.flickr.com/photos/202846129@N03/54553064876" },
  { title: "Hoses, Clamps, Rings, Elbows", author: "cogdogblog", licence: "CC BY 2.0", licenceUrl: BY_2, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=56977068" },
  { title: "Hoseclamps.screw.agr", author: "ArnoldReinhold", licence: "CC BY-SA 3.0", licenceUrl: BY_SA_3, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Hoseclamps.screw.agr.jpg" },
  { title: "Fire Truck Headlight", author: "Florence Huston", licence: "CC0", licenceUrl: CC0, source: "Wikimedia Commons", url: "https://commons.wikimedia.org/w/index.php?curid=82166369" },
];
