# Azercell Balance and Data Checker for iOS Widget


This project provides a simple and quick way for Azercell subscribers to check their balance and remaining cellular data directly from an iOS widget using Scriptable. It utilizes an undocumented API of Azercell, enabling users to access their account details without the need for logging into the official app or website.

## Disclaimer


This tool is not officially affiliated with, authorized, maintained, sponsored, or endorsed by Azercell or any of its affiliates or subsidiaries. It is developed for personal use and educational purposes only. The use of this project might be against Azercell's terms of service. Users should proceed with caution and at their own risk.

## Features

- Check Azercell balance
- View remaining cellular data
- Easy to use iOS widget

## Requirements

- iOS device
- Scriptable app installed
- Basic understanding of how to add widgets on iOS

## Installation Instructions

1. Download the `iOS_Scriptable_Widget.js` script.
2. Open the Scriptable app on your iOS device.
3. Tap on the "+" icon to create a new script.
4. Copy and paste the content of `iOS_Scriptable_Widget.js` into the new script.
5. **Customize the script** by changing the top lines of the script where constants for the phone number and password are defined:


// Constants for phone number and password

const phoneNumber = "your_azercell_phone_number"; // Azercell phone number in format xx xxx xx xx (without +994)

const password = "your_kabinetim_app_password"; // Password for Kabinetim app


	Replace `"your_azercell_phone_number"` with your actual Azercell phone number (formatted as xx xxx xx xx and without the country code +994) and `"your_kabinetim_app_password"` with the password you use for the Kabinetim app.


6. Rename the script to "Azercell Balance Checker" for easy identification.

## Usage


After setting up the script in Scriptable, you can add a new widget to your home screen:


1. Long press on your home screen and tap the "+" icon to add a widget.
2. Search for Scriptable and choose your desired widget size.
3. Select the "Azercell Balance Checker" script from the list.
4. Place the widget wherever you like on your home screen.

## Contributions


Contributions are welcome! If you have any improvements or suggestions, please feel free to fork the project and submit a pull request.

## License


This project is provided for educational and personal use only. Please use responsibly.
