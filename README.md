# My Fit SCALE is a Progressive Web App for "Mi Scale 2"
![MyFitSCALE](/screenshot.png?raw=true)

Try it -> [https://my-fit-pwa.now.sh](https://my-fit-pwa.now.sh)

See how it works -> [https://youtu.be/STR1Re5WSkQ](https://youtu.be/STR1Re5WSkQ)

This WebApp was made to demostrate how easy sometimes is to replace Native Apps. If you don't own a Xiaomi Mi Composition Body Scale, try run Demo to see how it feels.
And also this is a PWA playground for testing new Bluetooth LE API features like:

- navigator.bluetooth
- navigator.bluetooth.requestLEScan


There is always room to be improved, like:
- use fallback method to read last completed measurement (navigator.bluetooth.requestDevice)
  (this method will not be able to listen BLE broadcast packets)
- Read Xiaomi Mi Scale 2 measurements history memory
- Make a multilanguage UI, and so on...


![Desktop](/onDesktops.jpg?raw=true)
## Compatibility
You must be using Chrome 79+ with the chrome://flags/#enable-experimental-web-platform-features flag enabled

- Desktop: Chrome 79+ with the chrome://flags/#enable-experimental-web-platform-features flag enabled
- Mobile: Chrome 79+ with the chrome://flags/#enable-experimental-web-platform-features flag enabled

- Opera Mobile 57 with the chrome://flags/#enable-experimental-web-platform-features flag enabled
- Opera Desktop 68 with the opera://flags/#enable-experimental-web-platform-features flag enabled

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

* Persistent storage
* Export profiles with history

## Requirements
* Updated Chrome Browser
* Updated Opera Browser

## How to use in your site
git clone https://github.com/glococo/MyFit-PWA.git
and setup it in your hosting. Must use https.

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
