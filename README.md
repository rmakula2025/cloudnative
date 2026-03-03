
# Cloud-Native Feature Flags Service

Features:
- Percentage-based gradual rollout
- Redis edge caching (<5ms local read)
- Zero-downtime flag updates
- Multi-region Terraform modules (AWS & Azure)

Run Service:

cd service
npm install
npm start

Create Flag:
POST /flags
{
  "key": "new_checkout",
  "enabled": true,
  "rollout": 50
}

Evaluate Flag:
GET /flags/new_checkout/user123
