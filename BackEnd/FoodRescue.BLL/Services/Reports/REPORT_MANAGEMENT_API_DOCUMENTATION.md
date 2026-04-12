# Report Management API - Complete Documentation

## Overview
The Report Management API provides a comprehensive system for customers to report issues with products and orders, and for administrators to manage and resolve these reports.

## Base URL
```
https://api.yourdomain.com/api/reports
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {jwt_token}
```

---

## Endpoints

### 1. Get All Reports (Admin Only)
**Endpoint:** `GET /api/reports`
**Authorization:** Admin Role
**Description:** Retrieve all reports in the system.

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "reportCode": "REP-001",
    "customerName": "Ahmed Hassan",
    "listingName": "Organic Vegetables Bundle",
    "issueType": "QualityIssue",
    "status": "Pending",
    "priority": "High",
    "createdAt": "2025-02-20T10:30:00Z",
    "responseCount": 2
  }
]
```

---

### 2. Get My Reports (Customer)
**Endpoint:** `GET /api/reports/my-reports`
**Authorization:** Required
**Description:** Retrieve reports submitted by the current user.

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "reportCode": "REP-001",
    "customerName": "Ahmed Hassan",
    "listingName": "Organic Vegetables Bundle",
    "issueType": "QualityIssue",
    "status": "Pending",
    "priority": "High",
    "createdAt": "2025-02-20T10:30:00Z",
    "responseCount": 2
  }
]
```

---

### 3. Get Report by ID
**Endpoint:** `GET /api/reports/{id}`
**Authorization:** Required
**Description:** Retrieve a specific report with all details and responses.

**Path Parameters:**
- `id` (Guid): Report ID

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "reportCode": "REP-001",
  "customerName": "Ahmed Hassan",
  "orderId": "550e8400-e29b-41d4-a716-446655440002",
  "listingName": "Organic Vegetables Bundle",
  "issueType": "QualityIssue",
  "description": "Vegetables were spoiled upon delivery",
  "status": "InReview",
  "priority": "High",
  "refundAmount": 150.00,
  "createdAt": "2025-02-20T10:30:00Z",
  "updatedAt": "2025-02-20T14:30:00Z",
  "responses": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "reportId": "550e8400-e29b-41d4-a716-446655440001",
      "responderName": "Admin User",
      "message": "We are investigating this issue",
      "attachment": "https://api.yourdomain.com/attachments/evidence-001.jpg",
      "createdAt": "2025-02-20T11:00:00Z"
    }
  ]
}
```

---

### 4. Search and Filter Reports (Admin)
**Endpoint:** `GET /api/reports/search/filtered`
**Authorization:** Admin Role
**Description:** Search and filter reports with query parameters.

**Query Parameters:**
- `status` (string): Filter by status (Pending, InReview, Resolved)
- `search` (string): Full-text search in customer name, report code, listing name, description

**Example Request:**
```
GET /api/reports/search/filtered?status=Pending&search=vegetables
```

**Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "reportCode": "REP-001",
    "customerName": "Ahmed Hassan",
    "listingName": "Organic Vegetables Bundle",
    "issueType": "QualityIssue",
    "status": "Pending",
    "priority": "High",
    "createdAt": "2025-02-20T10:30:00Z",
    "responseCount": 2
  }
]
```

---

### 5. Create Report
**Endpoint:** `POST /api/reports`
**Authorization:** Required
**Description:** Submit a new report for a product/order issue.

**Request Body:**
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440002",
  "productId": "550e8400-e29b-41d4-a716-446655440003",
  "listingName": "Organic Vegetables Bundle",
  "issueType": "QualityIssue",
  "description": "The vegetables arrived spoiled and unusable",
  "priority": "High"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "reportCode": "REP-001",
  "customerName": "Ahmed Hassan",
  "orderId": "550e8400-e29b-41d4-a716-446655440002",
  "listingName": "Organic Vegetables Bundle",
  "issueType": "QualityIssue",
  "description": "The vegetables arrived spoiled and unusable",
  "status": "Pending",
  "priority": "High",
  "refundAmount": 0,
  "createdAt": "2025-02-20T10:30:00Z",
  "updatedAt": null,
  "responses": []
}
```

---

### 6. Update Report Status (Admin)
**Endpoint:** `PUT /api/reports/{id}/status`
**Authorization:** Admin Role
**Description:** Update the status and refund amount of a report.

**Path Parameters:**
- `id` (Guid): Report ID

**Request Body:**
```json
{
  "status": "Resolved",
  "refundAmount": 150.00,
  "adminNotes": "Refund approved and processed"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "reportCode": "REP-001",
  "customerName": "Ahmed Hassan",
  "orderId": "550e8400-e29b-41d4-a716-446655440002",
  "listingName": "Organic Vegetables Bundle",
  "issueType": "QualityIssue",
  "description": "The vegetables arrived spoiled and unusable",
  "status": "Resolved",
  "priority": "High",
  "refundAmount": 150.00,
  "createdAt": "2025-02-20T10:30:00Z",
  "updatedAt": "2025-02-20T14:30:00Z",
  "responses": []
}
```

---

### 7. Add Response to Report (Admin)
**Endpoint:** `POST /api/reports/{id}/response`
**Authorization:** Admin Role
**Description:** Add a response/comment to an existing report.

**Path Parameters:**
- `id` (Guid): Report ID

**Request Body:**
```json
{
  "reportId": "550e8400-e29b-41d4-a716-446655440001",
  "message": "Thank you for reporting this issue. We are investigating.",
  "attachmentUrl": "https://api.yourdomain.com/attachments/investigation-001.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "reportId": "550e8400-e29b-41d4-a716-446655440001",
  "responderName": "Admin User",
  "message": "Thank you for reporting this issue. We are investigating.",
  "attachment": "https://api.yourdomain.com/attachments/investigation-001.jpg",
  "createdAt": "2025-02-20T11:00:00Z"
}
```

---

### 8. Get Report Statistics (Admin)
**Endpoint:** `GET /api/reports/stats/overview`
**Authorization:** Admin Role
**Description:** Get aggregated statistics about all reports.

**Response (200 OK):**
```json
{
  "totalReports": 42,
  "pendingReports": 12,
  "inReviewReports": 8,
  "resolvedReports": 22,
  "highPriorityReports": 5,
  "totalRefundAmount": 3450.50,
  "averageResolutionTime": 48.5,
  "reportsByType": {
    "QualityIssue": 18,
    "DamagingProduct": 12,
    "WrongItem": 8,
    "NotReceived": 4
  },
  "reportsByPriority": {
    "High": 5,
    "Medium": 22,
    "Low": 15
  }
}
```

---

## Issue Types
- `QualityIssue` - Product quality problems
- `DamagingProduct` - Product arrived damaged
- `WrongItem` - Received wrong item
- `NotReceived` - Item not received
- `Other` - Other issues

## Status Values
- `Pending` - New report, not reviewed
- `InReview` - Admin is investigating
- `Resolved` - Issue resolved

## Priority Values
- `High` - Urgent issue
- `Medium` - Normal priority
- `Low` - Low priority

## Error Responses

### 400 Bad Request
```json
{
  "code": "INVALID_DATA",
  "message": "Issue type and description are required"
}
```

### 401 Unauthorized
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.3.2",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Authorization header missing or invalid"
}
```

### 404 Not Found
```json
{
  "code": "NOT_FOUND",
  "message": "Report not found"
}
```

### 403 Forbidden
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.3",
  "title": "Forbidden",
  "status": 403,
  "detail": "Access denied"
}
```

---

## Sample cURL Requests

### Create a Report
```bash
curl -X POST "https://api.yourdomain.com/api/reports" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "550e8400-e29b-41d4-a716-446655440002",
    "productId": "550e8400-e29b-41d4-a716-446655440003",
    "listingName": "Organic Vegetables Bundle",
    "issueType": "QualityIssue",
    "description": "Vegetables were spoiled",
    "priority": "High"
  }'
```

### Get Report Details
```bash
curl -X GET "https://api.yourdomain.com/api/reports/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Report Status
```bash
curl -X PUT "https://api.yourdomain.com/api/reports/550e8400-e29b-41d4-a716-446655440001/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Resolved",
    "refundAmount": 150.00
  }'
```

### Add Response to Report
```bash
curl -X POST "https://api.yourdomain.com/api/reports/550e8400-e29b-41d4-a716-446655440001/response" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reportId": "550e8400-e29b-41d4-a716-446655440001",
    "message": "We are investigating this issue",
    "attachmentUrl": "https://example.com/evidence.jpg"
  }'
```

---

## Code Examples

### C# - Create Report
```csharp
using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = 
    new AuthenticationHeaderValue("Bearer", jwtToken);

var dto = new CreateReportDto
{
    OrderId = orderId,
    ProductId = productId,
    ListingName = "Organic Vegetables",
    IssueType = "QualityIssue",
    Description = "Product arrived spoiled",
    Priority = "High"
};

var response = await client.PostAsJsonAsync(
    "https://api.yourdomain.com/api/reports", 
    dto
);
```

### JavaScript - Get My Reports
```javascript
const response = await fetch('https://api.yourdomain.com/api/reports/my-reports', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  }
});

const reports = await response.json();
console.log(reports);
```

---

## Notes
- Report codes are auto-generated in the format `REP-XXX` (e.g., REP-001, REP-002)
- All timestamps are in UTC ISO 8601 format
- Refund amounts use 2 decimal precision
- Average resolution time is calculated in hours
- Deleted reports cannot be restored
