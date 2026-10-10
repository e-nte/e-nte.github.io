# Large Data Volumes (LDV) Strategy

Managing large data volumes in Salesforce requires a proactive architecture. When custom object record counts exceed millions of rows, standard queries and reporting interfaces degrade if indexed fields and storage patterns are ignored.

## Key Mitigation Strategies
1. **Custom Indexing:** Request deterministic formula indexes or standard field indexes from Salesforce Support.
2. **Skinny Tables:** Combine frequently queried custom and standard fields into an optimized storage tier.
3. **Asynchronous Archiving:** Offload historical records to Big Objects or external data lakes via Batch Apex.