import requests
import math

# Constants for phone number and password
phonenumber = "your_azercell_phone_number" # Azercell phone number in format xx xxx xx xx (without +994)
password = "your_kabinetim_app_password" # Password for Kabinetim app

# Function to convert size from bytes to a readable format
def convert_size(size_bytes, decimals=2, k=1024):
    if size_bytes == 0:
        return "0 Bytes"
    size_name = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    i = int(math.floor(math.log(size_bytes, k)))
    p = math.pow(k, i)
    s = round(size_bytes / p, max(0, decimals))
    return f"{s} {size_name[i]}"

# Function to perform API requests
def perform_request(method, url, headers=None, data=None):
    with requests.Session() as session:
        response = session.request(method, url, headers=headers, json=data)
        response.raise_for_status()  # Raises HTTPError for bad requests
        return response.json()

# Base headers reused across requests
base_headers = {
    'Origin': 'https://kabinetim.azercell.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    'Content-Type': 'application/json',
}

# Step 1 - Send phone number to get proceedKey
url1 = "https://kabinetim.azercell.com/my/ext/auth/public/web/v1/user/login/check"
payload1 = {"msisdn": phonenumber}
response1 = perform_request("POST", url1, headers=base_headers, data=payload1)
proceedKey = response1["result"]["proceedKey"]

# Step 2 - Send password and proceedKey to get token
url2 = "https://kabinetim.azercell.com/my/ext/auth/public/web/v1/user/login"
payload2 = {"proceedKey": proceedKey, "password": password}
response2 = perform_request("POST", url2, headers=base_headers, data=payload2)
accessToken = response2["result"]["loginDetails"]["accessToken"]

# Step 3 - Send access token to get balance info
url3 = f"https://kabinetim.azercell.com/my/api/BalanceService/getAdditionalBalanceV2/{phonenumber}/0a1b2c3d4e5f6g7h8i9q/{phonenumber}"
headers3 = base_headers.copy()
headers3.update({
    'X-ACCESS-TOKEN': accessToken,
    'X-LOGIN': phonenumber,
})

finalResponse = perform_request("GET", url3, headers=headers3)
print(finalResponse)

# totalInternetBalance = finalResponse['GeneralBalanceResponseV2']['balances'][0]['units']['dataBalanceItems']['items'][0]['description']['eng']
# leftInternetBalance = finalResponse['GeneralBalanceResponseV2']['balances'][0]['units']['dataBalanceItems']['items'][0]['value']['remaining']

# print(f"Total Internet Balance: {totalInternetBalance}", f"Left Internet Balance: {convert_size(int(leftInternetBalance))}", sep="\n")
