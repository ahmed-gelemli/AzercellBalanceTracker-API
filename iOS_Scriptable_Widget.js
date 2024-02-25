// Constants for phone number and password
const phoneNumber = "your_azercell_phone_number"; // Azercell phone number in format xx xxx xx xx (without +994)
const password = "your_kabinetim_app_password"; // Password for Kabinetim app

// Function to convert bytes to normal human-readible size format
function convert_size(a,b=2,k=1024){with(Math){let d=floor(log(a)/log(k));return 0==a?"0 Bytes":parseFloat((a/pow(k,d)).toFixed(max(0,b)))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}}

// Function to prepare and send a request
async function sendRequest(url, method, headers, body = null) {
    let req = new Request(url);
    req.method = method;
    req.headers = headers;
    if (body) {
        req.body = JSON.stringify(body); // Convert body object to JSON string
    }
    let res = await req.loadJSON(); // Assuming loadJSON is a valid method to parse JSON response
    return res;
}

// Common headers used in the requests
const commonHeaders = {
    'Host': 'kabinetim.azercell.com',
    'Origin': 'https://kabinetim.azercell.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    'Content-Type': 'application/json',
    'Cookie': 'TS0152c8bc=01db3e592e9a24b87c87efc09a3dd923c51b53d1665039f9cdb0359910eaff7dfe28a5c20e86300d3a719ad39b381564ae059bc9db'
};

// Async function to get the proceedKey by sending the phone number
async function getProceedKey() {
    const url = "https://kabinetim.azercell.com/my/ext/auth/public/web/v1/user/login/check";
    const payload = { msisdn: phoneNumber };
    const res = await sendRequest(url, "POST", commonHeaders, payload);
    return res.result.proceedKey;
}

// Async function to get the access token by sending the password and proceedKey
async function getAccessToken() {
    const proceedKey = await getProceedKey();
    const url = "https://kabinetim.azercell.com/my/ext/auth/public/web/v1/user/login";
    const payload = { proceedKey, password };
    const res = await sendRequest(url, "POST", commonHeaders, payload);
    return res.result.loginDetails.accessToken;
}

// Async function to get balance info using the access token
async function getBalanceInfo() {
    const accessToken = await getAccessToken();
    const url = `https://kabinetim.azercell.com/my/api/BalanceService/getAdditionalBalanceV2/${phoneNumber}/0a1b2c3d4e5f6g7h8i9q/${phoneNumber}`;
    const headers = { ...commonHeaders, 'X-ACCESS-TOKEN': accessToken, 'X-LOGIN': phoneNumber };
    // For GET request, the body is not required
    const res = await sendRequest(url, "GET", headers);
    return res;
}

// Main function to orchestrate the login and data retrieval process
const balanceInfo = await getBalanceInfo();
console.log(balanceInfo);

const phoneBalance = balanceInfo['GeneralBalanceResponseV2']['balances'][1]['units']['monetaryBalanceItems']['items'][0]['value']['remaining'];
const totalInternetBalance = balanceInfo['GeneralBalanceResponseV2']['balances'][0]['units']['dataBalanceItems']['items'][0]['description']['eng'];
const leftInternetBalance = balanceInfo['GeneralBalanceResponseV2']['balances'][0]['units']['dataBalanceItems']['items'][0]['value']['remaining'];
const percent = (balanceInfo['GeneralBalanceResponseV2']['balances'][0]['units']['dataBalanceItems']['items'][0]['value']['remaining']/balanceInfo['GeneralBalanceResponseV2']['balances'][0]['units']['dataBalanceItems']['items'][0]['value']['total']*100).toFixed(2);

res = {"balance":phoneBalance, "total":totalInternetBalance, "remaining":convert_size(leftInternetBalance), "percent":percent};

console.log(res);

if (config.runsInWidget) {
    if (config.widgetFamily == "small") {
      Script.setWidget(createWidget(res.balance, res.total, res.remaining, res.percent, config.widgetFamily))
    } else if (config.widgetFamily == "medium") {
      Script.setWidget(createWidget(res.balance, res.total, res.remaining, res.percent, config.widgetFamily))
    }
  
    Script.complete()
}

/* --------------------------------- */

function createWidget(balance, total, remaining, percent, widgetSize) {
  // Make new Widget Object
  let w = new ListWidget();

  // Declaring colors
  var color1 = "#4c1d6d";
  var color2 = "#712ab1";

  // Set gradient background
  let startColor = new Color(color1);
  let endColor = new Color(color2);
  let gradient = new LinearGradient();
  gradient.colors = [startColor, endColor];
  gradient.locations = [0.0, 1];
  w.backgroundGradient = gradient;

  if (widgetSize == "small") {
    // Headline
    let title = w.addText("Azercell");
    title.textColor = Color.white();
    title.font = new Font('Avenir Next Bold', 16);
    w.addSpacer();

    // Balance Label
    let B = w.addText(`Balance: ${balance} AZN`);
    B.textColor = Color.white();
    B.font = new Font('Avenir Next', 12);

    // Data Usage Label
    let dataUsage = w.addText(`${remaining}`);
    dataUsage.textColor = Color.white();
    dataUsage.font = new Font('Avenir Next Bold', 24);

    // Rem / Total Label
    let totalB = w.addText(`${total} / left ${percent}%`);
    totalB.textColor = Color.white();
    totalB.font = new Font('Avenir Next', 12);
    totalB.textOpacity = 0.5;

    // Time Stamp Label
    w.addSpacer();
    var d = new Date();
    let timestamp = w.addText(d.toLocaleTimeString());
    timestamp.textColor = Color.white();
    timestamp.font = new Font('Avenir Next', 10);
    timestamp.textOpacity = 0.3;
  }

  return w;
}