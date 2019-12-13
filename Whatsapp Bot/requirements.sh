
#! /bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

sudo apt-get install python3
sudo apt-get install python3-pip
pip3 install selenium
pip3 install beautifulsoup4
pip3 install pyautogui
pip3 install pyperclip
sudo apt-get firefox
echo "Trying to configure Gecko"
wget https://github.com/mozilla/geckodriver/releases/download/v0.26.0/geckodriver-v0.26.0-linux64.tar.gz
tar -xvzf geckodriver*
chmod +x geckodriver
sudo mv geckodriver /usr/local/bin
