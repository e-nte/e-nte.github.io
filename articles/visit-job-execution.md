<!--
---
title: "Visit Job Execution: Consumer Goods Cloud vs. Field Service"
description: "How Salesforce addresses field visit execution across Consumer Goods Cloud and Field Service, when to choose each, and whether a native Flow build is worth it."
author: "Evangelos Ntermaris: Senior Salesforce Consultant"
date: 2026-10-10
reading_time: "6 min"
tags:
  - salesforce
  - consumer-goods-cloud
  - field-service
  - visit-execution
  - solution-architecture
audience:
  - prospective-customers
  - business-analysts
  - developers
---
-->
# Visit Job Execution: Consumer Goods Cloud vs. Field Service

`#salesforce` `#consumer-goods-cloud` `#field-service` `#solution-architecture`

> **Author:** Evangelos Ntermaris | **Date:** 2026-10-10 | **Read Time:** 6 min

How Salesforce addresses field visit execution across Consumer Goods Cloud and Field Service, when to choose each, and whether a native Flow build is worth it.

---

## The Business Need: Closing the Field Execution Gap

Every organisation that sends people into the field — whether to stock shelves, audit planograms, or repair equipment — faces the same fundamental problem: **the gap between what is planned and what actually happens on the ground**. Field teams operate under cost pressure, time pressure, and increasing scrutiny over whether visits deliver measurable value. Without a structured execution framework, visits become unstructured conversations, task completion is inconsistently recorded, and managers lack the data to distinguish productive field time from wasted travel. This is the core business need that visit job execution addresses: turning every field appointment into a repeatable, verifiable, and measurable unit of work.

Salesforce approaches this need through two distinct products: **Consumer Goods Cloud** (now branded Agentforce Consumer Goods) for retail execution, and **Field Service** (Agentforce Field Service) for service-driven field operations. They share a platform and a philosophy — plan the work, execute it on mobile, capture the outcome — but they solve fundamentally different problems. Understanding where each belongs is the first architectural decision a consultant must get right.

## Consumer Goods Cloud: Structured Retail Execution

Consumer Goods Cloud is purpose-built for **repetitive, compliance-driven store visits** in industries such as FMCG, beverages, and consumer health. The central object is the **Visit**, which stores the place, visitor, planned and actual start/end times, special instructions, priority, and status (Planned, In Progress, Abandoned, Completed). What makes CG Cloud distinctive is how it answers the question *"what happens during the visit?"* through **Action Plan Templates**.

An Action Plan Template is a reusable definition of the tasks a rep must perform in a given visit type. It contains items built from **Assessment Task Definitions**, which map to six standard task types: Inventory Check, Planogram Check, Promotion Check, Place Order, In-Store Survey, and Other. Each task definition can be linked to Assessment Indicator Definitions — the metrics that capture the actual in-store reality, such as facings, share of shelf, or out-of-stock counts. When a rep starts a visit on the Consumer Goods mobile app, the Action Plan is instantiated as Assessment Task records, each with its own status and captured data. The **Retail Visit KPI** object then stores the captured metric values for that specific visit, enabling comparison against the Retail Store KPI targets defined at the store level.

The practical implication is **standardisation at scale**: a sales manager defines one "NTO Stores – Compliance Checks" template once, publishes it, and applies it to hundreds of visits. Reps execute the same checklist every time, and the data captured flows into dashboards that show compliance rates, not just visit counts. CG Cloud also includes geofencing and explicit start-visit controls to reduce visit fraud and improve execution reliability.

## Field Service: Dispatched Work Order Execution

Field Service solves a different problem. Its data model is built around the **Work Order** — the unit of work — and the **Service Appointment**, which represents the scheduled visit. A single Work Order can spawn multiple Service Appointments (a multi-day installation, for example), and each appointment has a time window, an assigned Service Resource, a location, and a status. The execution flow is fundamentally **case-driven or asset-driven**: a customer reports an issue, a Case or Work Order is created, and the scheduling engine assigns a qualified technician based on skills, territories, operating hours, and service-level agreements.

During execution, the technician uses the **Field Service Mobile app** (offline-capable) to view the appointment, access asset history and prior visit notes, capture parts used, record labour time, and obtain customer sign-off. Recent Agentforce capabilities add pre-work briefs that analyse the work order and predict likely faults before the technician arrives, and post-job summaries drafted from technician notes. The critical difference is that Field Service execution is **not template-driven in the same way**. Each work order line item defines what needs to be done (replace compressor, inspect wiring), and the service appointment is the scheduled opportunity to do it. There is no equivalent of a reusable "action plan" applied across hundreds of visits — each job is scoped individually, though Work Types and Work Order Line Items provide structuring mechanisms.

## The Comparison: Choosing the Right Cloud

The decision between Consumer Goods Cloud and Field Service is not about which is "better" — it is about which model matches the operational reality. CG Cloud assumes **high-frequency, low-variability visits** to the same type of location, where the value comes from consistency and compliance measurement. Field Service assumes **variable-scope, dispatch-driven jobs** where the value comes from matching the right resource to the right task at the right time.

| Dimension | Consumer Goods Cloud | Field Service |
| :--- | :--- | :--- |
| **Core execution object** | Visit | Service Appointment (child of Work Order) |
| **Task definition model** | Action Plan Template to Assessment Task Definitions | Work Order Line Items |
| **Primary driver** | Route and call cycle planning | Customer request or asset condition |
| **Metric capture** | Retail Visit KPI vs. Retail Store KPI | Work order completion fields, parts, labour |
| **Scheduling emphasis** | Trip Lists and optimised routes | Scheduling engine with skills and SLA constraints |
| **Mobile app** | Consumer Goods offline app | Field Service Mobile |
| **Typical user** | Merchandiser, pre-sales rep | Technician, engineer, installer |

A useful heuristic: if the rep visits the same store every Tuesday and performs the same five checks, CG Cloud is the natural fit. If the rep is dispatched to a different customer site each day to fix something specific, Field Service is the correct platform. Some organisations, particularly in equipment rental or technical consumer goods, may need both — CG Cloud for retail presence and Field Service for after-sales support — and Salesforce supports this coexistence on the same org, though the data models remain separate and require deliberate integration design.

## The Decoupling Option: Building Visit Execution with Native Flows

A client that does not need the full Consumer Goods Cloud suite — with its trade promotion management, order capture, and offline mobile app — might reasonably ask: *can we build a leaner visit execution capability using standard Salesforce objects and Flow Builder?* The answer is yes, and for a focused use case, the effort is moderate and well within reach for an experienced admin or consultant.

The core of a custom solution rests on three or four custom objects: a **Visit** object (linked to Account and User), a **Visit Task** object (child of Visit, with a status and a reference to a task template), and a **Task Template** object that mirrors the role of the Action Plan Template. Record-triggered flows on Visit creation can instantiate the required Visit Tasks from the template, and screen flows embedded in the Salesforce mobile app can guide the rep through check-in, task completion, and check-out. Check-in and check-out timestamps can be captured via a screen flow action or a Lightning web component, and geolocation can be approximated using the standard `Location` field or a lightweight Apex callout if the client has a Maps licence. Reporting on task completion rates and visit durations is straightforward using standard reports and dashboards.

The effort is **not trivial, but it is contained**. The typical build involves 3–5 custom objects, 6–10 fields per object, 3–4 record-triggered flows, 2–3 screen flows for mobile execution, and a small number of validation rules and permission sets. For an experienced Salesforce professional, this is a matter of weeks, not months — particularly if the client is willing to accept the trade-offs. Those trade-offs are worth stating plainly. A custom build will **not** have the offline capability of the CG Cloud mobile app, so it is unsuitable for environments with unreliable connectivity. It will **not** have Einstein Vision for shelf recognition or AI-driven task recommendations. It will **not** have the process-contract architecture that governs the CG Cloud mobile UI, meaning the mobile experience must be built and maintained manually. And it will **not** be supported by Salesforce as a managed package, so every enhancement and bug fix becomes the client's responsibility.

The decision, therefore, is a classic build-versus-buy calculation. If the client's needs are a structured checklist, basic geo-tagged check-in, and task completion reporting, a native Flow-based build delivers 80% of the value at a fraction of the licence cost and implementation time. If the client needs offline execution, AI-driven compliance checks, or tight integration with trade promotion and order capture, the full Consumer Goods Cloud suite is the right investment. A senior consultant's role is to help the client see that trade-off clearly — and to resist the temptation to build custom simply because it feels lighter, when the operational reality demands the robustness of the packaged product.

## Critical Components to Get Right

For either cloud, three implementation components determine whether visit job execution succeeds in production. First, **the task or work definition layer**: in CG Cloud, this means Assessment Task Definitions and Action Plan Templates; in Field Service, Work Types and Work Order Line Items; in a custom build, the Task Template object. If this layer is inconsistent, the execution data becomes unreliable. Second, **the mobile experience**: both platforms are mobile-first, but offline behaviour must be tested against real network conditions, especially in CG Cloud where the offline app is the primary execution surface for merchandisers. Third, **the measurement feedback loop**: CG Cloud's Retail Visit KPI must be mapped correctly to Assessment Indicator Definitions, and Field Service's completion data must flow back to the Work Order and Asset history. Without this loop, the system records activity but does not enable learning.

## Summary

Visit job execution is where field strategy meets field reality. Consumer Goods Cloud provides a template-driven, compliance-oriented execution model for structured retail visits, while Field Service provides a dispatch-driven, work-order-oriented model for variable-scope service jobs. Both are built on the Salesforce platform and share core principles — mobile execution, offline capability, structured task capture — but their data models and assumptions differ enough that the choice should be driven by visit frequency, task variability, and the primary reason the visit exists. For clients with narrower needs, a native Flow-based build offers a viable middle path, provided the trade-offs around offline capability, AI, and long-term support are understood. For potential customers, the question is not "which cloud is better?" but "which execution model matches how our field teams actually work?" For analysts and developers, the critical components are the task/work definition layer, the mobile execution layer, and the KPI feedback loop — get these right, and the platform delivers; get them wrong, and you have digitised chaos.