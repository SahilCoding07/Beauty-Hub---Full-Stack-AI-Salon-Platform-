import re

with open('src/pages/AdminPage.tsx', 'r') as f:
    code = f.read()

code = code.replace('Menu,', 'Menu, X,')

with open('src/pages/AdminPage.tsx', 'w') as f:
    f.write(code)
