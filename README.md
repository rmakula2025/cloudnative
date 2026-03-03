
## Cloud-Native Feature Flags Service

A minimal cloud-native feature flag service built with **Node.js/Express**, **Redis** for edge caching, and **Terraform** modules for **AWS** and **Azure**.

Use it to gradually roll out features, run experiments, and keep flag evaluation fast and close to your application.

---

### Features

- **Percentage-based rollout**: Enable flags for a configurable percentage of users.
- **Deterministic user bucketing**: Same user will consistently see the same flag decision for a given configuration.
- **Redis edge caching**: Fast local reads using Redis (`REDIS_URL` configurable, defaults to `redis://localhost:6379`).
- **Simple HTTP API**: Create/update and evaluate flags over REST.
- **Multi-cloud IaC**: Terraform examples for AWS (ECS + ELB placeholder) and Azure (Container Instances).

---

### Project Structure

- **`service/`**: Node.js/Express feature flag API.
  - `src/index.js`: HTTP server and flag evaluation logic.
  - `package.json`: Dependencies (`express`, `ioredis`, `uuid`) and scripts.
- **`terraform/aws/`**: AWS infrastructure example (ECS cluster + ELB stub).
- **`terraform/azure/`**: Azure infrastructure example (resource group + container group).

---

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm**
- **Redis** instance (local or managed)
- **Terraform** (v1.x) if you want to deploy infra

---

### Running the Service Locally

1. **Start Redis**
   - Local (default): ensure Redis is running on `redis://localhost:6379`
   - Or set `REDIS_URL` to point to your Redis:
     - Example: `export REDIS_URL=redis://<host>:<port>`

2. **Install dependencies & start API**

```bash
cd service
npm install
npm start
```

The service will start on `http://localhost:5000`.

---

### API Reference

**Base URL**: `http://localhost:5000`

#### 1. Create / Update a Flag

- **Endpoint**: `POST /flags`
- **Body**:

```json
{
  "key": "new_checkout",
  "enabled": true,
  "rollout": 50
}
```

- **Fields**:
  - `key` (string): Unique flag key.
  - `enabled` (boolean): Master switch for the flag.
  - `rollout` (number 0–100): Percentage of users who should see the feature.

- **Response**:

```json
{
  "success": true,
  "flag": {
    "key": "new_checkout",
    "enabled": true,
    "rollout": 50
  }
}
```

#### 2. Evaluate a Flag for a User

- **Endpoint**: `GET /flags/:key/:userId`
- **Example**:

```bash
curl http://localhost:5000/flags/new_checkout/user123
```

- **Response**:

```json
{
  "key": "new_checkout",
  "userId": "user123",
  "active": true
}
```

Where:
- `active = true` means the feature should be ON for that user.
- `active = false` means the feature should be OFF for that user.

If the flag does not exist, the service returns:

```json
{
  "error": "Flag not found"
}
```

with HTTP status `404`.

---

### Terraform: Cloud Deployment (Examples)

These are **minimal examples** meant as a starting point; they are not production-ready.

#### AWS (`terraform/aws`)

Files model:

- AWS provider in `us-east-1`
- `aws_ecs_cluster.feature_flags` – ECS cluster placeholder
- `aws_elb.feature_flags_lb` – Classic ELB placeholder

Usage:

```bash
cd terraform/aws
terraform init
terraform plan
terraform apply
```

You will need to extend this with:
- ECS task definitions and services
- Networking (VPC, subnets, security groups)
- Container image, environment variables, etc.

#### Azure (`terraform/azure`)

Files model:

- `azurerm_resource_group.feature_flags` – Resource group
- `azurerm_container_group.feature_flags` – Container group stub

Usage:

```bash
cd terraform/azure
terraform init
terraform plan
terraform apply
```

You will need to extend this with:
- Container image and ports
- Environment variables (including `REDIS_URL`)
- Networking and DNS as appropriate

---

### Environment Variables

- **`REDIS_URL`**: Connection string for Redis.
  - Default: `redis://localhost:6379`

---

### Next Steps / Ideas

- Add authentication/authorization for flag management.
- Add UI dashboard for non-engineers to view/edit flags.
- Add audit logging and version history for flags.
- Wire Terraform modules to build and deploy the Node.js service end-to-end.

