# My Fit Progressive Web App for "Mi Scale 2"
![MyFitPWA](/screenshot.png?raw=true)

Test it -> [__soon__](__)

This is a PWA playground for testing new Bluetooth LE API features

- navigator.bluetooth
- navigator.bluetooth.requestLEScan


There is room to be improved, like:
- use fallback method navigator.bluetooth.requestDevice for read last completed measurement
  (this method will not be able to listen BLE broadcast packets)
- Read Xiaomi Mi Scale 2 measurements history memory
- Make a UI with User Profile selector and store each measurement on each user

## Compatibility
You must be using Chrome 79+ with the chrome://flags/#enable-experimental-web-platform-features flag enabled

- Desktop: Chrome 79+ with the chrome://flags/#enable-experimental-web-platform-features flag enabled
- Mobile: Chrome 79+ with the chrome://flags/#enable-experimental-web-platform-features flag enabled

- Opera Mobile 56 Support navigator.bluetooth.requestDevice only. requestLEScan not available right now.
- Opera Desktop till v67 do not support navigator.bluetooth at all

- Edge Mobile 45 support navigator.bluetooth.requestDevice only. requestLEScan not available right now.

- Mozilla Firefox: No Bluetooth support at ALL in all platforms :(

## Features
* Weight
* Ideal weight
* Metabolic Age
* Water
* Body Type
* Lean Body Mass
* Body Mass Index
* Bone Mass
* Muscle Mass
* Basal metabolic rate
* Body Fat
* Visceral Fat
* Protein Percentage


## Requirements
* Updated Chrome Browser

## How to use in your site
git clone https://github.com/glococo/MyFit-PWA.git
and setup it in your hosting. Must use https.

or

Use this -> [__soon__](__)

## License
Copyright (C) 2020 Guillermo Lo Coco

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/lgpl>.
