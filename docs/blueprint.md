# **App Name**: KoboCore ERP

## Core Features:

- Isolated Multi-Tenant Architecture: Enterprise-grade data isolation ensuring that each business instance and its users can only access their specific tenant data through robust Firestore security rules.
- Operational Ledger & Inventory: A centralized dashboard to manage real-time stock levels, low-stock alerts in FCFA, and comprehensive sales recording tailored for the Cameroonian market.
- Smart HR & Employee Tracking: A workforce module to track staff records, attendance, and salary statuses with role-based visibility to protect sensitive payroll information.
- Intelligent Task Orchestrator: Full lifecycle task management that automatically flags overdue items and provides visual status heatmaps for departmental performance.
- Insight-Driven AI Assistant: A read-only generative tool that uses business data to provide RAG-based summaries on sales, stock, and task performance while strictly adhering to the user's role-based permissions.
- Append-Only Guardian Logs: An immutable audit trail system that captures every record change and login event, creating a permanent activity history stored in Firestore.
- Financial Resource Hub: Streamlined expense tracking and document storage for receipts, invoices, and licenses using Firebase Storage, complete with automated profit/loss calculation.

## Style Guidelines:

- Primary color: Deep Navy (#1E3A8A), a professional blue that anchors the interface in trust and economic stability.
- Background color: Ultra-clean Frost White (#F8FAFC) to ensure heavy data-tables remain readable and focused.
- Accent color: Vibrant Electric Indigo (#8B5CF6) used for high-importance interactions and AI-powered insights.
- Font pairing: 'Space Grotesk' for headlines to give a tech-forward feel, paired with 'Inter' for data-rich tables and body text to maximize objective readability.
- Use minimalist, thin-line monochrome icons that don't distract from business-critical data visualizations.
- A high-density 'Card-based' layout using a fixed sidebar to facilitate rapid switching between the Sales, Inventory, and HR modules.
- Subtle slide-and-fade transitions (200ms) for modal overlays to keep the administrative workflow feeling snappy and light.