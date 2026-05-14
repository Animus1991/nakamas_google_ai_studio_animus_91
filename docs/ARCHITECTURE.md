# System Architecture

## Overview
The architecture is designed to manage event discovery, secure group formation, strict role-based access control (Tiers), and integrations with external ticketing APIs. 

## Mermaid System Architecture Diagram

```mermaid
graph TD
    %% Client Layer
    subgraph Client ["Client App (React + Vite)"]
        UI[User Interface - Event/Group Dashboards]
        State[State Management / Caching]
        AuthClient[Authentication Client]
        Routing[App Routing]
        UI --> State
        UI --> AuthClient
        UI --> Routing
    end

    %% API Gateway Layer
    subgraph APIGateway ["API Gateway & Services"]
        Route[Router / Load Balancer]
        AuthProxy[Auth Middleware]
        Rate[Rate Limiting]
        Route --> AuthProxy
    end

    %% Backend Services Layer
    subgraph Backend ["Backend Microservices (Node/Express)"]
        EventSvc[Event Service]
        GroupSvc[Group Matching Service]
        ScoreSvc[Reliability & Trust Service]
        PaymentSvc[Payment & Discount Engine]
        ChatSvc[Ephemeral Chat Service]
        
        AuthProxy --> EventSvc
        AuthProxy --> GroupSvc
        AuthProxy --> ScoreSvc
        AuthProxy --> PaymentSvc
        AuthProxy --> ChatSvc
    end

    %% Persistence Layer
    subgraph Persistence ["Data Persistence (Firebase/Firestore)"]
        DB[(Firestore DB)]
        Storage[(Cloud Storage - Avatars/Selfies)]
        EventSvc --> DB
        GroupSvc --> DB
        ScoreSvc --> DB
        ChatSvc --> DB
        ScoreSvc --> Storage
    end

    %% External Systems Layer
    subgraph External ["External Third-Party APIs"]
        Ticketing[Ticketing Partners API e.g. more.com]
        Identity[Identity Verification API e.g. Onfido]
        Stripe[Stripe Payments]
        Map[Mapping Service API]
    end

    %% Cross-Domain Interactions
    Client --> Route
    PaymentSvc --"Process Payments & Affiliates"--> Stripe
    PaymentSvc --"Confirm Tickets/Discounts"--> Ticketing
    ScoreSvc --"Selfie/ID Checks"--> Identity
    EventSvc --"Geo-Spatial Query"--> Map
    
    %% Event Matching Flow
    GroupSvc -.->|"Evaluates Tier Rules"| ScoreSvc
    PaymentSvc -.->|"Applies Group Discount"| GroupSvc

    %% Internal Structure Notes
    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef api fill:#fef08a,stroke:#ca8a04,stroke-width:2px;
    classDef backend fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
    classDef database fill:#fce7f3,stroke:#db2777,stroke-width:2px;
    classDef external fill:#f3f4f6,stroke:#4b5563,stroke-width:2px;

    class UI,State,AuthClient,Routing client;
    class Route,AuthProxy,Rate api;
    class EventSvc,GroupSvc,ScoreSvc,PaymentSvc,ChatSvc backend;
    class DB,Storage database;
    class Ticketing,Identity,Stripe,Map external;
```
