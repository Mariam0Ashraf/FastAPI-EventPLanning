#!/bin/sh

# Default value if ENV variable not supplied
API_URL=${API_URL}

echo "Using API URL: $API_URL"

# Generate env.js dynamically at runtime
cat <<EOF > /usr/share/nginx/html/assets/env.js
(function (window) {
  window.__env = window.__env || {};
  window.__env.apiUrl = "$API_URL";
})(this);
EOF

# Start Nginx
exec "$@"