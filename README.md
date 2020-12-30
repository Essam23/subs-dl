# subs-dl
Subtitles Downloader (Hulu, Animelon)

## Requirements
- Python 3.x
  - requests
  - pycrypto
## Usage
### Hulu (hulu.py)
1. Open video page like `https://www.hulu.com/watch/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
2. Copy the text below and paste it to console of your browser to get Content ID:
```
var x=new XMLHttpRequest;x.open("GET","https://discover.hulu.com/content/v3/entity?language=en&schema=4&eab_ids="+window.location.href.split("/").pop(),!1),x.withCredentials=!0,x.send(null),JSON.parse(x.responseText)["items"][0]["content_id"];
```  
3. Execute the following command and follow the steps as told (if you want to save as VTT, use `-v` or `--vtt` option):
```
python3 hulu.py
```

### Animelon (animelon.py)
1. Get video ID from URL:  
`https://animelon.com/video/xxxxxxxxxxxx` => `xxxxxxxxxxxx`

2. Execute the following command and paste the ID:
```
python3 animelon.py
```