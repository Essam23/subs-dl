#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import re
import os
import sys
import xml.etree.ElementTree as ET

# check command line arguments
is_srt = True
args = sys.argv
if len(args) > 1:
  if args[1] == '-v' or args[1] == '--vtt':
    is_srt = False

# prompt instruction
print('Copy the text below and paste it to console of your browser to get Content ID:')
print('------------------------------------------------------------------------------')
print('var x=new XMLHttpRequest;x.open("GET","https://discover.hulu.com/content/v5/deeplink/playback?namespace=entity&schema=1&id="+window.location.href.split("/").pop(),!1),x.withCredentials=!0,x.send(null),JSON.parse(x.responseText)["eab_id"].split("::")[2];')
print('------------------------------------------------------------------------------')
content_id = input('Enter Content ID: ')

# process
r = requests.get(f'https://www.hulu.com/captions.xml?content_id={content_id}')
root = ET.fromstring(r.text)
ens = root.findall('./en')
vtt_url = f'https://assetshuluimcom-a.akamaihd.net/captions_webvtt/{int(content_id[-3:])}/{content_id}_US_en_en.vtt'
if len(ens) > 0:
  vtt_url = ens[0].text.replace('captions', 'captions_webvtt').replace('.smi', '.vtt')
else:
  print('[Info] Could not find subtitle in this video, but trying...')
r = requests.get(vtt_url)
with open(f'{content_id}.vtt', 'wb') as vtt_file:
  vtt_file.write(r.content)
if is_srt:
  with open(f'{content_id}.vtt', 'r+', encoding='utf-8') as read_file:
    lines = read_file.readlines()
    lines.pop()
    line_count = 0
    for i, num in enumerate(lines):
      if num == '\n':
        line_count += 1
        if line_count == 1:
          lines[i] = f'{line_count}\n'
        else:
          lines[i] = f'\n{line_count}\n'
    read_file.seek(0)
    for line in lines:
      if ' --> ' in line:
        read_file.write(line.replace('.', ','))
      else:
        read_file.write(line.replace('WEBVTT\n', ''))
  try:
    os.rename(f'{content_id}.vtt', f'{content_id}.srt')
  except Exception as error:
    print('[Error] Failed to rename file.')
    print(error)
    exit
  print(f'Succeeded in downloading `{content_id}.srt`.')
else:
  print(f'Succeeded in downloading `{content_id}.vtt`.')
