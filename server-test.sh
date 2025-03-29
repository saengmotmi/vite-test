#!/bin/bash

echo "Testing Todo API"
echo "-----------------------"

# API 기본 URL
API_URL="http://localhost:3000/api/todos"

# 헬스 체크
echo "1. Health Check"
curl -s "http://localhost:3000/health"
echo -e "\n"

# 모든 할 일 가져오기
echo "2. Get all todos"
curl -s "$API_URL"
echo -e "\n"

# 새 할 일 추가
echo "3. Create new todo"
NEW_TODO=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test todo"}')
echo $NEW_TODO
echo -e "\n"

# ID 추출
TODO_ID=$(echo $NEW_TODO | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Todo ID: $TODO_ID"

# 특정 할 일 가져오기
echo "4. Get todo by ID"
curl -s "$API_URL/$TODO_ID"
echo -e "\n"

# 할 일 업데이트
echo "5. Update todo"
curl -s -X PATCH "$API_URL/$TODO_ID" \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated todo", "completed": true}'
echo -e "\n"

# 업데이트된 할 일 확인
echo "6. Check updated todo"
curl -s "$API_URL/$TODO_ID"
echo -e "\n"

# 할 일 삭제
echo "7. Delete todo"
curl -s -X DELETE "$API_URL/$TODO_ID"
echo -e "\n"

# 삭제 확인
echo "8. Verify deletion"
curl -s "$API_URL/$TODO_ID"
echo -e "\n"

echo "Testing completed" 