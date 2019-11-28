# /usr/bin/python3
from os import listdir
from os.path import isfile, join
import os
import time


def isTwitter(filename):

    if(len(filename[:filename.rfind(".")]) == 15):
        filename = filename.replace("_large", "")

        print(filename)
        return True
    else:
        return False


proxies = {
}


def downloadReplace(filename):
    # Work on windows
    import requests
    pic_url = "https://pbs.twimg.com/media/{}:orig".format(filename)
    global enlargedPic
    global total
    if(isfile(filename)):
        try:
            sizeCompare(filename)
        except:
            pass
        print("Skiped: {}, Enlarged Picture Count: {}/{}".format(filename,
                                                                 enlargedPic, total))
        return

    with open(filename, 'wb') as handle:
        print("Url: {}".format(pic_url))
        try:
            response = requests.get(
                pic_url, stream=True, proxies=proxies, timeout=20)
        except:
            time.sleep(1)
            try:
                response = requests.get(
                    pic_url, stream=True, proxies=proxies, timeout=20)
            except:
                print("Request Fail")
                handle.close()
                os.remove(filename)

                return

        if not response.ok:
            print(response)
            handle.close()
            os.remove(filename)
            return

        for block in response.iter_content(1024):
            if not block:
                break

            handle.write(block)

    handle.close()
    try:
        sizeCompare(filename)
    except:
        pass
    print("Success: {}, Enlarged Picture Count: {}/{}".format(filename, enlargedPic, total))


def sizeCompare(filename):
    from PIL import Image
    global total
    global enlargedPic
    if not isfile(join(mypath, filename)) or not isfile(filename):
        total += 1
        return

    old = Image.open(join(mypath, filename))
    oldwidth, oldheight = old.size

    new = Image.open(filename)
    newwidth, newheight = new.size

    total += 1
    if newwidth > oldwidth or newheight > oldheight:
        enlargedPic += 1


if __name__ == "__main__":
    mypath = ""
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    onlytwitter = [f for f in onlyfiles if isTwitter(f)]

    global enlargedPic
    global total
    enlargedPic = 0
    total = 0
    for f in onlytwitter:
        f = f.replace("_large", "")
        downloadReplace(f)
