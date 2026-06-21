import axios from "axios";

// Aşağıdaki Fonksiyonu değiştirmeyin.

async function ipAdresimiAl() {
  return await axios({
    method: "get",
    url: "https://api.ipify.org",
  }).then(function (response) {
    return response.data;
  });
}

const ipAdresim = await ipAdresimiAl();
console.log(ipAdresim);

/*
  AMAÇ:
  - location_card.png dosyasındakine benzer dinamik bir card oluşturmak.
  - HTML ve CSS hazır, önce IP adresini, sonra bunu kullanarak diğer bilgileri alacağız.

	ADIM 1: IP kullanarak verileri almak
  getData fonskiyonunda axios kullanarak şu adrese GET sorgusu atacağız: https://apis.ergineer.com/ipgeoapi/{ipAdresiniz}

  Fonksiyon gelen datayı geri dönmeli.

  Not: Request sonucu gelen datayı browserda network tabından inceleyin.
  İpucu: Network tabıından inceleyemezseniz GET isteklerini gönderdiğiniz URL'i direkt browserda açabildiğinizi unutmayın. 😉

  Bu fonksiyonda return ettiğiniz veri, Adım 2'de oluşturacağınız component'de argüman olarak kullanılıyor. Bu yüzden, veride hangi key-value çiftleri olduğunu inceleyin.
*/

async function getData() {
  return await axios({
    method: "get",
    url: `http://ip-api.com/json/${ipAdresim}?fields=status,message,country,countryCode,city,zip,lat,lon,timezone,currency,isp,query`,
  }).then(function (response) {
    return response.data;
  });
}

/*
	ADIM 2: Alınan veriyi sayfada gösterecek componentı oluşturmak
  getData ile aldığımız konum bazlı veriyi sayfada göstermek için cardOlustur fonskiyonu kullanılacak. DOM metodlarını ve özelliklerini kullanarak aşağıdaki yapıyı oluşturun ve dönün (return edin).

  Not: Ülke Bayrağını bu linkten alabilirsiniz:
  'https://flaglog.com/codes/standardized-rectangle-120px/{ülkeKodu}.png';

	<div class="card">
    <img src={ülke bayrağı url} />
    <div class="card-info">
      <h3 class="ip">{ip adresi}</h3>
      <p class="ulke">{ülke bilgisi (ülke kodu)}</p>
      <p>Enlem: {enlem} Boylam: {boylam}</p>
      <p>Şehir: {şehir}</p>
      <p>Saat dilimi: {saat dilimi}</p>
      <p>Para birimi: {para birimi}</p>
      <p>ISP: {isp}</p>
    </div>
  </div>
*/

function cardOlustur(data) {
  console.log("Kart oluşturma:", data);
  const card = document.createElement("div");
  card.classList.add("card");

  const cardImg = document.createElement("img");
  cardImg.src = `https://flaglog.com/codes/standardized-rectangle-120px/${data.countryCode}.png`;
  card.appendChild(cardImg);

  const cardInfo = document.createElement("div");
  cardInfo.classList.add("card-info");

  const cardIP = document.createElement("h3");
  cardIP.classList.add("ip");
  cardIP.textContent = ipAdresim;

  const cardCInfo = document.createElement("p");
  cardCInfo.classList.add("ulke");
  cardCInfo.textContent = `${data.country} (${data.countryCode})`;

  const cardEBInfo = document.createElement("p");
  cardEBInfo.textContent = `Enlem: ${data.lat} - Boylam: ${data.lon}`;

  const cardCityInfo = document.createElement("p");
  cardCityInfo.textContent = `Şehir: ${data.city} `;

  const cardTZInfo = document.createElement("p");
  cardTZInfo.textContent = `Saat dilimi: ${data.timezone}`;

  const cardCRInfo = document.createElement("p");
  cardCRInfo.textContent = `Para birimi: ${data.currency}`;

  const cardISPInfo = document.createElement("p");
  cardISPInfo.textContent = `ISP: ${data.isp}`;

  cardInfo.appendChild(cardIP);
  cardInfo.appendChild(cardCInfo);
  cardInfo.appendChild(cardEBInfo);
  cardInfo.appendChild(cardCityInfo);
  cardInfo.appendChild(cardTZInfo);
  cardInfo.appendChild(cardCRInfo);
  cardInfo.appendChild(cardISPInfo);

  card.appendChild(cardInfo);

  return card;
}

// Buradan sonrasını değiştirmeyin, burası yazdığınız kodu sayfaya uyguluyor.

getData().then((response) => {
  const cardContent = cardOlustur(response);
  const container = document.querySelector(".container");
  container.appendChild(cardContent);
});
