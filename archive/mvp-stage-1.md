Great question — here’s a clear, opinionated UI blueprint for **MVP Stage 1 (through Wishlist creation & approval)** that’s simple, clean, and scalable for later phases. It’s organized by **navigation**, **key screens**, **components**, **states**, and **flows** so your UI developer can run with it.

---

## 1) Global Navigation & Shell

**Top App Bar (persistent)**

* **Logo / Product name**
* **Project Switcher** (dropdown: recent + search)
* **Step Indicator** (read-only stepper for Stage 1):

  * 1. Voice Intake → 2) Template → 3) Wishlist → 4) Review
* **Notifications Bell** (badge count; opens quick panel; link to Inbox)
* **User Menu** (profile, settings, sign out)

**Primary Left Sidebar (collapsible)**

* **Dashboard**
* **Projects**
* **Notifications (Inbox)**
* **Help / Docs** (optional)
* Sticky “Create Project” button (if not in Dashboard)

**Project Workspace Layout**

* **Left Panel — Artifacts List**

  * Stage 1: shows **Wishlist** only (tree/list; searchable)
  * Future-proof: “Artifacts” label; later add Features, Requirements, etc.
* **Center — Dynamic Project Space**

  * Contextual content (stage-aware): Voice intake UI, wishlist board/list, review screen
* **Right Panel — Agent Interaction**

  * **Mentor Agent** chat area + minimal **Voice control**
  * Transcript viewer (read-only for Stage 1; recording handled by agent-mesh)

> The **center** panel always reflects what the user is doing right now.
> The **left** panel is for quick navigation/search.
> The **right** panel is for conversation/assist and small status signals.

---

## 2) Key Screens

### A) Dashboard

* **Header**: “Projects”
* **Project Cards/Table**:

  * Name, status chip (`draft`, `intake_voice`, `template_pending`, `wishlist_active`, `wishlist_review`, `wishlist_approved`)
  * Updated at
  * Last step progress indicator (mini)
  * Quick actions: “Open”, “Resume”
* **Create Project** button (prominent)
* **Notification summary** widget (last 5 items, “View Inbox”)

**Empty State**: “No projects yet” → “Create your first project”

---

### B) Project Overview (Stage-aware)

* **Top context bar**: Project name, status chip, stepper
* **Left panel**: Artifacts → Wishlist (selected)
* **Right panel**: Agent column:

  * Chat thread (read-only for now if agent is not integrated), voice controls (record/start session), latest transcript snippet
* **Center panel**: Dynamic content depending on stage:

  * **Voice Intake**:

    * Big **Record** button with live waveform
    * “Recording…” state → transcription progress
    * After session → “Transcript attached” with preview
    * CTA: “Proceed to Template”
  * **Template Received (Template step)**:

    * Read-only summary of selected template (name, version, brief)
    * **Select Template** (if multiple) or confirm default
    * CTA: “Seed Wishlist from Template” (or “Go to Wishlist”)
  * **Wishlist**:

    * Board/List view of **Wishlist items**
    * Toolbar: Add item, Seed from template, Search, Filters, Bulk actions
    * Inline statuses: `draft`, `suggested`, `in_review`, `approved`, `rejected`
    * Sources: badges (`user`, `template_suggested`, `agent_inferred`)
    * Drag handle for **order**
    * CTA: “Submit for Review” (if ≥1 item)
  * **Review**:

    * Read-only list with statuses
    * If pending: “Send reminder” or “Withdraw submission” (optional)
    * If approved: success summary + “Next steps” (future)

---

### C) Notifications Inbox

* **Filters**: Unread/All, project filter, type filter (approval needed, approved, rejected)
* **List**: Each row: title, project, created time, action buttons (“Open Project”, “Approve/Reject” if applicable)
* **Bulk mark read**
* **Empty state**: “You’re all caught up!”

---

## 3) Core Components

### Project Stepper (read-only in Stage 1)

* **Stages**:

  * Voice Intake → Template → Wishlist → Review
* Shows current state; clicking a completed step can navigate back (optional)

### Wishlist Views

* **Card/List item fields**:

  * Title (required)
  * Description (expand/collapse)
  * Category (chip)
  * Tags (chips)
  * Source (badge): user / template / agent
  * Status chip: draft / suggested / in\_review / approved / rejected
  * Order handle (drag and drop)
  * Actions: Edit, Delete, Approve (inline), Reject (inline)
* **Add/Edit Drawer** (right-side drawer):

  * Fields:

    * Title (required)
    * Description
    * Category (select or free text)
    * Tags (multi-select/add)
    * Source (read-only except for user-created items)
    * Status (allowed transitions only)
  * Footer: Save / Cancel
* **Seed from Template Modal**:

  * List of suggested items with checkboxes (pre-selected)
  * “Select All”, search within suggestions
  * “Add Selected” → creates items with `status='suggested'`, `source='template_suggested'`
* **Submit for Review Dialog**:

  * Summary: number of items, statuses
  * Confirm → creates Approval & transitions project → `wishlist_review`

### Voice Intake Panel

* **Record Button** with wave animation
* Status: Idle / Recording / Processing / Completed
* Transcript snippet viewer (collapsed/expand)
* CTA: “Proceed to Template”

### Notifications

* **Bell Dropdown**: 5 most recent; “View Inbox”
* **Toasts**: success/errors for CRUD and stage transitions

---

## 4) States & Status Signals

**Project Status (Stage 1)**

* `draft` → `intake_voice` → `template_pending` → `wishlist_active` → `wishlist_review` → `wishlist_approved`

**Wishlist Item Status**

* `draft`, `suggested`, `in_review`, `approved`, `rejected`

**Source**

* `user`, `template_suggested`, `agent_inferred`

**Visual Patterns**

* Chips for statuses and sources
* Persuasive empty states with CTAs (e.g., “Seed from template”)
* Inline validation and save feedback
* Disabled actions when transitions aren’t permitted

---

## 5) Flows (Happy Path)

**Create Project → Voice Intake**

1. Dashboard → Create Project
2. Project opens in Voice Intake step → Record → Transcription shown
3. Click “Proceed to Template” → system indicates template is being fetched

**Template → Seed Wishlist**
4\. Template summary shown → User confirms/Selects template
5\. Click “Seed from Template” → Modal → Add Selected
6\. Wishlist populated (`suggested`) → user edits/adds items

**Wishlist → Submit Review**
7\. User reorders, edits, adds tags/categories
8\. Click “Submit for Review” → confirm → status → `wishlist_review`
9\. Inbox receives item “Wishlist needs approval”
10\. Approver approves → project → `wishlist_approved`
11\. Success banner with next-step hints (future)

---

## 6) Routes & URL Scheme (example)

* `/dashboard`
* `/projects/:projectId` → shows current stage in center panel
* `/projects/:projectId/voice`
* `/projects/:projectId/template`
* `/projects/:projectId/wishlist`
* `/projects/:projectId/review`
* `/notifications`

> These route aliases help with deep links from notifications. Internally the center panel can still be stage-aware without separate routes, but deep links improve UX.

---

## 7) Design Guidelines

* **Clean, minimal**: avoid clutter; progressive disclosure
* **Consistency**: chips/badges for status/source across app
* **Keyboard-friendly**: tab order, Enter/Escape in dialogs, drag-and-drop with keyboard fallback
* **Accessible**: ARIA roles for dialogs, lists, buttons; visible focus
* **Responsive**:

  * Desktop: 3 columns (left/artifacts, center/context, right/agent)
  * Tablet: collapsible left/right panels
  * Mobile: stacked views, bottom tab for switching between context/agent/inbox
* **Performance**: lazy load long lists; paginate wishlist if needed
* **Empty & Error States**: meaningful messages with CTA

---

## 8) What the UI Developer Needs from Backend

* **Endpoints** (already defined in your core-backend plan) for:

  * Projects CRUD & status transitions
  * Voice session create/complete + transcript upload URL
  * Templates list/versions + record usage
  * Wishlist CRUD, seed-from-template, reorder, submit-for-review
  * Approvals decide (approve/reject)
  * Notifications list/mark-read
* **Auth**: Supabase JWT in requests
* **Schema contracts**: types for statuses, sources, timestamps, pagination
* **Errors**: structured error format for inline display

---

## 9) Visual Style (High-Level)

* **Colors**: Neutral base, one primary accent. Status chips distinct but subtle.
* **Typography**: Clean sans-serif (e.g., Inter), 14–16px body, 20–24px headers
* **Spacing**: generous whitespace for scannability
* **Icons**: Simple line icons for actions (edit, delete, approve, reorder)
* **Illustrations**: Optional light empty-state illustrations

---

### TL;DR

* **Dashboard** with project cards, notifications widget.
* **Project Workspace** with 3-pane layout:

  * Left: **Artifacts (Wishlist)** list
  * Center: **Dynamic context** (Voice → Template → Wishlist → Review)
  * Right: **Agent** (chat/voice/transcripts panel)
* **Wishlist UX**: clear list/board, edit drawer, seed-from-template modal, reorder, submit for review.
* **Notifications Inbox**: actionable, filterable.
* **Scalable**: constraints and components align with later phases (features/requirements).

