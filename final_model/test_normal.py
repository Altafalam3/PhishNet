def Hppts(self):
        try:
            if 'https' in self.domain:
                return -1
            return 1
        except:
            return -1
url="https://www.google.com"
ans=Hppts(url)
print(ans)