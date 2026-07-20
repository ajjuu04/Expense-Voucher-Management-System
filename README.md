# Expense Voucher Management System (ExpenseVoucherMS)

A full-stack web application for managing employee expense vouchers digitally. It replaces the old paper-based process with an online system that follows a clear approval workflow: **Employee → Director → Accounts Team**.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Java 17, Spring Boot <!-- confirm your actual JDK version and fix this if you used 21 -->
- **Database:** MySQL
- **Security:** Spring Security + JWT Authentication
- **File Storage:** Local file system (for signature images)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Java 17 (JDK) <!-- match this to whatever you put in Tech Stack above -->
- Maven
- MySQL Server

### 1. Database Setup
1. Open MySQL and create the database:
   ```sql
   CREATE DATABASE ExpenseVoucherMS;
   ```
2. The backend uses Spring Data JPA with `spring.jpa.hibernate.ddl-auto=update`, so all tables are created automatically the first time the app runs — no manual table creation needed.
3. If your MySQL username/password is different from the default, update it in `application.properties`.

### 2. Backend Setup
```bash
cd ExpenseVoucherMS
mvn clean install
mvn spring-boot:run
```
The backend runs at `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd _Frontend
npm install
npm run dev
```
The frontend runs at `http://localhost:5173` (or `5174` if that port is already in use).

> **Note:** If your frontend ends up running on a different port, update the allowed origin in the backend's `SecurityConfig` (CORS settings) to match it.

## Database Schema Explanation

The system has two main tables: **users** and **vouchers**, connected by a **one-to-many relationship** in two ways — one employee can create many vouchers, and one director can review many vouchers, but each voucher belongs to exactly one employee and (once reviewed) exactly one director.

### `users` table
Stores login and role information for every person using the system.

| Column | Type | Notes |
|---|---|---|
| id | BIGINT (PK) | |
| name | VARCHAR | Full name |
| email | VARCHAR (unique) | Used as the login username |
| password | VARCHAR | Stored as a BCrypt hash, never plain text |
| role | ENUM | `EMPLOYEE`, `DIRECTOR`, or `ACCOUNTS` |

### `vouchers` table
Stores every expense claim and tracks it through the approval workflow.

| Column | Type | Notes |
|---|---|---|
| id | BIGINT (PK) | |
| voucher_number | VARCHAR (unique) | Auto-generated, e.g. `VCH-123456` |
| expense_title | VARCHAR | Short description |
| expense_category | VARCHAR | e.g. Travel, Meals, Accommodation |
| expense_desc | TEXT | Longer description |
| exp_date | DATE | Date the expense actually happened |
| amount | DECIMAL | Amount being claimed |
| status | ENUM | `DRAFT`, `PENDING`, `APPROVED`, `REJECTED` |
| employee_id | BIGINT (FK → users.id) | Who created the voucher |
| director_id | BIGINT (FK → users.id) | Who reviewed the voucher (set only after review) |
| employee_sign_url | VARCHAR | Path to the employee's uploaded signature |
| director_sign_url | VARCHAR | Path to the director's uploaded signature |
| reject_reason | VARCHAR | Filled in only if the voucher was rejected |
| created_at / updated_at | TIMESTAMP | Audit fields |

## API Documentation

All endpoints except `/api/auth/login` require a valid JWT token in the request header:
`Authorization: Bearer <token>`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, returns a JWT token |
| POST | `/api/vouchers` | EMPLOYEE | Create a new draft voucher |
| PUT | `/api/vouchers/{id}` | EMPLOYEE | Edit a voucher (only while status is DRAFT) |
| DELETE | `/api/vouchers/{id}` | EMPLOYEE | Delete a voucher (only while status is DRAFT) |
| POST | `/api/vouchers/{id}/signature` | EMPLOYEE | Upload employee signature image |
| PUT | `/api/vouchers/{id}/submit` | EMPLOYEE | Submit a draft (DRAFT → PENDING); requires a signature to already be uploaded |
| GET | `/api/vouchers/my` | EMPLOYEE | Get all vouchers created by the logged-in employee |
| GET | `/api/vouchers/{id}` | EMPLOYEE, DIRECTOR, ACCOUNTS | Get full details of one voucher |
| GET | `/api/vouchers/status/{status}` | DIRECTOR, ACCOUNTS | Get all vouchers with a given status (e.g. `PENDING`, `APPROVED`) |
| POST | `/api/vouchers/{id}/director-signature` | DIRECTOR | Upload director signature image |
| PUT | `/api/vouchers/{id}/approve` | DIRECTOR | Approve a voucher (PENDING → APPROVED); requires director signature |
| PUT | `/api/vouchers/{id}/reject` | DIRECTOR | Reject a voucher (PENDING → REJECTED); requires a reason in the request body |

<example data to run on mysql>

INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
('Employee One', 'employee1@test.com', '$2b$12$Cxm/eJfDCaf6EQAunp2rmux595iEbdPKZVU4SLHG7952jEqmmS3Fe', 'EMPLOYEE', NOW(), NOW()),
('Employee Two', 'employee2@test.com', '$2b$12$Cxm/eJfDCaf6EQAunp2rmux595iEbdPKZVU4SLHG7952jEqmmS3Fe', 'EMPLOYEE', NOW(), NOW()),
('Employee Three', 'employee3@test.com', '$2b$12$Cxm/eJfDCaf6EQAunp2rmux595iEbdPKZVU4SLHG7952jEqmmS3Fe', 'EMPLOYEE', NOW(), NOW()),

('Test Director', 'director@abc.com', '$2b$12$Cxm/eJfDCaf6EQAunp2rmux595iEbdPKZVU4SLHG7952jEqmmS3Fe', 'DIRECTOR', NOW(), NOW()),

('Test Accounts', 'accounts@abc.com', '$2b$12$Cxm/eJfDCaf6EQAunp2rmux595iEbdPKZVU4SLHG7952jEqmmS3Fe', 'ACCOUNT_TEAM', NOW(), NOW());


| Role       | Email                | Password  |
| ---------- | -------------------- | --------- |
| Employee 1 | `employee1@test.com` | `test123` |
| Employee 2 | `employee2@test.com` | `test123` |
| Employee 3 | `employee3@test.com` | `test123` |
| Director   | `director@abc.com`   | `test123` |
| Accounts   | `accounts@abc.com`   | `test123` |


## Assumptions Made During Development

1. **No sign-up screen:** User accounts are assumed to be created by HR/Admin, similar to how a real company already has an internal employee database. Accounts are provisioned by the company itself, not self-registered — this is outside the scope of this assignment.
2. **Test data:** The system expects a few test users (one Employee, one Director, one Accounts) to already exist in the database, so the full workflow can be tested end-to-end.
3. **Draft immutability:** Once a voucher is submitted (DRAFT → PENDING), it can no longer be edited. A rejected voucher stays `REJECTED` permanently as an audit record, rather than reverting to draft.
4. **Signature storage:** Signatures are currently stored on the local server file system (`/uploads` folder). In a production system, this would move to cloud storage (e.g. AWS S3) for scalability.
5. **Merged workflow step:** The original spec listed "Submitted" and "Pending Approval" as two separate steps — these were merged into a single `PENDING` status, since no action happens between them.
6. **Role restrictions:**
   - Employees can only view and edit their **own** vouchers.
   - Directors can view all vouchers and approve/reject only vouchers in `PENDING` status.
   - Accounts Team has **read-only** access to view all vouchers for tracking.

## Testing

- **Backend:** All API endpoints were tested manually using Postman — including login/JWT issuance, and confirming role-based access works correctly (e.g., an EMPLOYEE token correctly gets a `403 Forbidden` on DIRECTOR-only endpoints).
- **Frontend:** Checked manually in Chrome, including responsive layout using Chrome DevTools (F12).

## Tools & Resources Used

Along with official Spring Boot and React documentation, Stack Overflow and an AI coding assistant were used for debugging support and to learn Spring MultipartFile, which was new to me. Given the project deadline, AI assistance was also used to speed up parts of the frontend implementation where all backend are implemeted using the manual worl. All code was tested and understood before being included.
