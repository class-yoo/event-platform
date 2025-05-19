#!/bin/bash

set -e

# 서버 주소들
API_URL=http://localhost:3000/users
LOGIN_URL=http://localhost:3001/auth/login
ATTENDANCE_URL=http://localhost:3002/attendances

# 유저 생성 정보
EMAILS=("admin@maple.com" "operator@maple.com" "auditor@maple.com" "user@maple.com")
ROLES=("ADMIN" "OPERATOR" "AUDITOR" "USER")

echo "👤 Creating users..."

for i in "${!EMAILS[@]}"; do
  email="${EMAILS[$i]}"
  role="${ROLES[$i]}"

  echo "→ Creating $email ($role)"
  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "'"$email"'",
      "password": "pass123",
      "role": "'"$role"'"
    }'

  echo -e "\n"
done

echo "🔐 Logging in as user@maple.com..."

JWT=$(curl -s -X POST "$LOGIN_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@maple.com","password":"pass123"}' \
  | jq -r '.token')

if [ -z "$JWT" ]; then
  echo "❌ Failed to get JWT token"
  exit 1
fi

echo "✅ JWT acquired"

# JWT payload 디코딩 (base64 URL-safe → 표준 base64 → decode)
PAYLOAD=$(echo "$JWT" | cut -d '.' -f2 | \
  sed 's/-/+/g; s/_/\//g; s/\([^.]\{2\}\)$/\1==/' | base64 --decode 2>/dev/null)

USER_ID=$(echo "$PAYLOAD" | jq -r '.sub')

if [ -z "$USER_ID" ] || [ "$USER_ID" = "null" ]; then
  echo "❌ Failed to extract userId from JWT payload"
  echo "Raw payload: $PAYLOAD"
  exit 1
fi

echo "🪪 Extracted userId: $USER_ID"
echo "🗓 Sending attendance records for 2025-05-01 ~ 2025-05-05..."

for day in {1..5}; do
  DATE="2025-05-$(printf "%02d" $day)"
  echo "→ POST $DATE"

  curl -s -X POST "$ATTENDANCE_URL" \
    -H "Authorization: Bearer $JWT" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "'"$USER_ID"'",
      "date": "'"$DATE"'"
    }'

  echo -e "\n"
done

echo "🎉 All done! 출석 데이터 등록 완료"

