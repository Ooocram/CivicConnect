# CivicConnect

## SEN381 Software Engineering Project

CivicConnect is a controlled software engineering project focused on
developing a digital platform for managing community service requests.

The project addresses problems caused by fragmented communication channels,
including email, telephone calls, messaging platforms, spreadsheets and
paper-based records.

## Project Purpose

CivicConnect aims to provide a controlled and centralised approach for:

- Submitting service requests
- Categorising requests
- Tracking request status
- Managing request assignments
- Recording actions and resolutions
- Supporting management reporting
- Improving accountability and traceability

## Milestone 1

Milestone 1 establishes the Engineering Foundation and Requirements Baseline.

Key artefacts include:

- Problem and Business Need
- Stakeholder Analysis
- Scope Baseline
- Constraints and Trade-offs
- Functional Requirements
- Non-Functional Requirements
- Acceptance Criteria
- Requirements Traceability Matrix
- Risk Register
- Forward Engineering Considerations
- Engineering Decision Log
- AI Usage Register
- PED v1.0

## Repository Governance

This repository follows controlled engineering practices.

Substantive changes should be made through:

1. GitHub Issues
2. Working Branches
3. Pull Requests
4. Peer Reviews
5. Required Approval Before Merge

The main branch represents the controlled project baseline.

## Team

- Team Member 1 – Business, Scope & Stakeholders
- Team Member 2 – Requirements, Traceability & Risk
- Team Member 3 – Governance, Forward Planning & PED

## Application & Technical Documentation (M2 Baseline)

### Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Frontend:** React.js (Planned for Sprint 2)

### Prerequisites

- Node.js v18+
- PostgreSQL v14+

### Environment Setup

1. Clone the repository and navigate to the project directory.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory for your local environment variables (e.g., `PORT`, database credentials). Do not commit this file to version control.

### Run Instructions

- Run `node server.js` to start the local development server.

### Active Endpoints

- `POST /api/v1/requests` - Accepts JSON payloads to submit a new community service request (Golden Trace).
