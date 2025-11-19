AutoLog Backend Integration Guide

This file contains recommended endpoints and data shapes for the frontend to integrate with the Spring Boot backend.

Endpoints (examples)
- GET /api/v1/vehicles -> [{id, model, purchaseDate, odometer, image, nextService}]
- POST /api/v1/vehicles -> create vehicle
- GET /api/v1/documents?type=insurance -> [{id,name,type,issuedDate,expiry,vehicle:{id,model,company,regDate},url}]
- POST /api/v1/documents (multipart/form-data) -> upload document
- GET /api/v1/services?from=YYYY-MM-DD&to=YYYY-MM-DD -> [{id,date,type,items,cost,workshop,mileage,invoice}]
- GET /api/v1/notifications -> [{id,title,message,severity,createdAt}]

Auth
- JWT in Authorization header: `Authorization: Bearer <token>`

Notes
- The frontend expects `documents` to optionally include a nested `vehicle` object with `company`, `model`, and `regDate`.
- Adjust the `src/services/api.js` helper if your API uses different parameter names.
