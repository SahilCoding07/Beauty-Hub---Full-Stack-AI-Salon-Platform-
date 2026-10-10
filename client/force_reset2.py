import re

with open('src/api/mockDb.ts', 'r') as f:
    code = f.read()

code = code.replace(
    'if (true) {  // FORCE RESET SERVICES',
    'if (currentServices.length > -1) {  // FORCE RESET SERVICES'
)

with open('src/api/mockDb.ts', 'w') as f:
    f.write(code)
