import requests
import json
import base64
from hashlib import md5
from Crypto.Cipher import AES

def unpad(data):
    return data[:-(data[-1] if type(data[-1]) == int else ord(data[-1]))]

def bytes_to_key(data, salt, output=48):
    assert len(salt) == 8, len(salt)
    data += salt
    key = md5(data).digest()
    final_key = key
    while len(final_key) < output:
        key = md5(key + data).digest()
        final_key += key
    return final_key[:output]

def decrypt(encrypted, passphrase):
    encrypted = base64.b64decode(encrypted)
    assert encrypted[0:8] == b"Salted__"
    salt = encrypted[8:16]
    key_iv = bytes_to_key(passphrase, salt, 32+16)
    key = key_iv[:32]
    iv = key_iv[32:]
    aes = AES.new(key, AES.MODE_CBC, iv)
    return unpad(aes.decrypt(encrypted[16:]))

videoId = input('Enter video ID: ')
userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
response = requests.get(f'https://animelon.com/api/languagevideo/findByVideo?videoId={videoId}&learnerLanguage=en&subs=1&cdnLink=1&viewCounter=1', headers={'user-agent': userAgent})
videoJson = json.loads(response.text)
encrypted = videoJson['resObj']['subtitles'][2]['content']['japaneseSub']
decrypted = decrypt(encrypted[8:-5], ''.join(list(reversed(encrypted[0:8]))).encode())

with open(f'{videoId}.ass', 'wb') as f:
    f.write(decrypted)
    print(f'Saved subtitle file as {videoId}.ass!')