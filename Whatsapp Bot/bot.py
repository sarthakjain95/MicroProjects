
#! /usr/bin/python3

# Whatsapp Bot - Play a prank! (Not on me.)

from selenium import webdriver
from bs4 import BeautifulSoup

import pyautogui, time, subprocess


browser= webdriver.Firefox()
base= "https://web.whatsapp.com/"
spam_message= "😂"
spam_limit= 10
has_pyperclip= True

try:
	import pyperclip
except:
	print("Could not import pyperclip")
	has_pyperclip= False

count=0
printed_chars=0
def waitingAnimation(m="",e1="",e2=""):
	global count
	global printed_chars
	print("\r"+" "*printed_chars, end=e1)
	m= "\r"+m+'.'*count
	printed_chars= len(m) + 5
	print(m, end=e2)
	count+=1
	if count>3: count=0


print("\nFetching Whatsapp Login Page!")
browser.get( base )

print("Got the Login Page.")
print("Please scan the QR.")

soup= BeautifulSoup(browser.page_source, features="html.parser")
contacts= []
while len(contacts) == 0:
	soup= BeautifulSoup(browser.page_source, features="html.parser")
	contacts= soup.find_all("span",{"class":"_3NWy8"})
	waitingAnimation("Waiting for QR Authentication")
	time.sleep(1)

waitingAnimation("Done.","\n","\n\n")

if has_pyperclip: 
	que= input("Take input from clipboard? (y/n): ")
else: 
	que='n' 

if que in ("Y",'y'): spam_message= pyperclip.paste()
else: spam_message= input("Enter Spam Message: ")

contact_to_spam= input("Enter username of contact to spam: ")
try:
	res= browser.find_element_by_xpath("//span[@title=\'"+contact_to_spam+"\']")
	res.click()
except:
	print("Contact not found!")
	exit(0)

while True:
	try:
		spam_limit= input("Enter number of messages: ")
		spam_limit= int(spam_limit)
		break
	except:
		print("Invalid Input. Try Again.")

input_elem= browser.find_element_by_class_name("_13mgZ")

print("Click on the whatsapp window to put the window in focus.")
while True:
	# xdotool getwindowfocus getwindowname
	window_name= subprocess.check_output(["xdotool","getwindowfocus","getwindowname"])
	window_name= str(window_name).split()
	if "Mozilla" not in window_name:
		waitingAnimation("Waiting for window to be in focus")
		time.sleep(1)
	else:
		break

pyperclip.copy(spam_message)
for n in range(0,spam_limit):
	# browser.find_element_by_class_name().click()
	input_elem.click()
	pyautogui.hotkey('ctrl','v', interval=0.05 )
	pyautogui.press("enter")

if spam_limit>30: print("\n\nSpammed the heck out of them!")
else: print("\n\nEnds.")

browser.close()
