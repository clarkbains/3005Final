#! /bin/sh
## Have to build so we can inject env var
API_ADDR="${API_ADDR:-http://localhost:9756}"
echo "let API_ADDR = \"$API_ADDR\"" > /app/src/Config.tsx
echo "export default API_ADDR;" >> /app/src/Config.tsx
npm run build
serve -s build