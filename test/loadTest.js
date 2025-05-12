import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 500 }, // Ramp up to 500 users over 2 minutes
    { duration: '5m', target: 500 }, // Stay at 500 users for 5 minutes
    { duration: '1m', target: 0 },   // Ramp down to 0 users over 1 minute
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete in under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

// Main test function
export default function () {
  // Replace with your backend's endpoint
  const url = 'http://localhost:3000/api/restaurant/all';
  
  // Sample payload (modify based on your API)
  const payload = JSON.stringify({
    data: 'test',
  });

  // Headers (modify as needed)
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send POST request
  const response = http.post(url, payload, params);

  // Verify response
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Simulate user think time (1-3 seconds)
  sleep(Math.random() * 2 + 1);
}