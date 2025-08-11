Great — below is a **low-fidelity wireframe set** (ASCII + Figma-ready specs) and a **component checklist** for your UI developer to implement in React for **MVP Stage 1 (through Wishlist)**.

---

## 0) Scope (Stage 1)

Screens covered:

1. **Dashboard**
2. **Project – Voice Intake**
3. **Template Preview (read-only)**
4. **Wishlist (seed + edit + approve/reject)**
5. **Review Summary (pre-step3)**
6. **Notifications Inbox (supporting)**

Global layout uses a **3-pane workspace**:

* **Left:** Sidebar (Artifacts / Wishlist)
* **Center:** Dynamic content
* **Right:** Agent (chat/voice)

---

## 1) Design Tokens (Figma & CSS/Tailwind)

**Color (Dark-first)**

* `--bg: #0B0F14`
* `--text: rgba(255,255,255,0.92)`
* `--text-muted: rgba(255,255,255,0.64)`
* `--text-subtle: rgba(255,255,255,0.44)`
* `--primary-1: #2EE5FF`
* `--primary-2: #5A8CFF`
* `--accent-1: #7C3AED`
* `--accent-2: #E91E63`
* `--success: #20C997`
* `--warning: #F59E0B`
* `--danger:  #F43F5E`
* `--glass-fill: rgba(255,255,255,0.08)`
* `--glass-border: rgba(255,255,255,0.16)`
* `--glass-highlight: rgba(255,255,255,0.10)`

**Radius**

* `--radius-lg: 16px`
* `--radius-md: 12px`
* `--radius-sm: 10px`

**Blur**

* `--blur-lg: 24px`
* `--blur-md: 16px`
* `--blur-sm: 8px`

**Shadows**

* `--shadow-primary: 0 10px 30px rgba(46, 229, 255, 0.08)`

**Typography**

* Sans: Inter / Plus Jakarta Sans
* Mono: JetBrains Mono
* H1: 28–32 / 1.2; H2: 22–24 / 1.25; Body: 14–16 / 1.6; Caption: 12–13 / 1.4

**Grid**

* Base unit: 8px
* Content max-widths: 1200–1440px center panel; side columns 280–320px

**Tailwind utilities (suggested)**

* `backdrop-blur`, `bg-[rgba(...)]`, `border`, `rounded-XL`, `shadow-[custom]`, custom colors via theme extension.

---

## 2) ASCII Wireframes (Low Fidelity)

### A) Dashboard

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Top Bar [Logo]                [Search]                      [Notifications] [User] │
├───────────────────────────────────────────────────────────────────────────┤
│  [Create Project +]                                                [Filters v]     │
│                                                                               │
│  Projects                                                                    │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                      │
│  │ Project Card  │  │ Project Card  │  │ Project Card  │  ...                 │
│  │ Name          │  │ Name          │  │ Name          │                      │
│  │ Updated ...   │  │ Updated ...   │  │ Updated ...   │                      │
│  └───────────────┘  └───────────────┘  └───────────────┘                      │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

### B) Project – Voice Intake

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Top Bar [Project Name] [Step: Voice Intake ▸ Template ▸ Wishlist]  [User]     │
├───────────────┬───────────────────────────────────────────┬─────────────────┤
│ Sidebar       │ Center: Voice Intake                      │ Agent Panel     │
│ (Wishlist)    │ ┌───────────────────────────────────────┐ │ ┌─────────────┐ │
│ - (empty)     │ │  [ Record ● ]                         │ │ │ Chat bubbles│ │
│               │ │  waveform ~~~~~~~~                    │ │ │ Status: ... │ │
│               │ │  State: Idle/Recording/Processing     │ │ │ Mic toggle  │ │
│               │ └───────────────────────────────────────┘ │ └─────────────┘ │
│               │ [ Help text: “Tell us about your project” ]                  │
└───────────────┴───────────────────────────────────────────┴─────────────────┘
```

### C) Template Preview

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Top Bar [Project Name] [Step: Voice Intake ▸ Template ▸ Wishlist]        │
├───────────────┬───────────────────────────────────────────┬─────────────────┤
│ Sidebar       │ Center: Template Summary (read-only)      │ Agent Panel     │
│ (Wishlist)    │ ┌───────────────────────────────────────┐ │ ...             │
│ - (empty)     │ │ Template: "E-commerce Web" v1.2       │ │                 │
│               │ │ Industry: Retail                      │ │                 │
│               │ │ Summary: ...                           │ │                 │
│               │ │ Default Wishes (preview):              │ │                 │
│               │ │  - User Accounts                       │ │                 │
│               │ │  - Product Catalog                     │ │                 │
│               │ └───────────────────────────────────────┘ │                 │
│               │ [ Seed Wishlist ]   [ Back ]                                  │
└───────────────┴───────────────────────────────────────────┴─────────────────┘
```

### D) Wishlist (Seed + Edit + Approvals)

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Top Bar [Project Name] [Step: Voice Intake ▸ Template ▸ Wishlist]        │
├───────────────┬───────────────────────────────────────────┬─────────────────┤
│ Sidebar       │ Center: Wishlist Board/List               │ Agent Panel     │
│ Wishlist      │ ┌───────────────────────────────────────┐ │ ┌─────────────┐ │
│ - All (12)    │ │ [Search] [Tag filter] [Seed from Template]              │ │
│ - Suggested   │ │--------------------------------------------------------│ │
│ - In Review   │ │  ▸ Card: "User Accounts"  [source: template] [suggested]│ │
│ - Approved    │ │     ...  [Approve] [Reject] [Edit] [Drag ⋮⋮]          │ │
│ - Rejected    │ │  ▸ Card: "Payments"       [source: user] [in_review]    │ │
│               │ │     ...                                                    │ │
│               │ └───────────────────────────────────────┘ │ └─────────────┘ │
│               │ [Submit for Review]                                         │
└───────────────┴───────────────────────────────────────────┴─────────────────┘

Right Drawer (on Edit):
┌──────────────────── Edit "User Accounts" ────────────────────┐
│ Title       [.........................]                      │
│ Description [.........................]                      │
│ Category    [select v]  Tags [ +tag ]                        │
│ Source      [ user | template_suggested | agent_inferred ]   │
│ Status      [ draft | suggested | in_review | approved | ...]│
│ Actions: [Save] [Cancel]                                     │
└──────────────────────────────────────────────────────────────┘
```

### E) Review Summary (pre-next steps)

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Top Bar [Project Name] [Step: Voice Intake ▸ Template ▸ Wishlist]        │
├───────────────┬───────────────────────────────────────────┬─────────────────┤
│ Sidebar       │ Center: Summary                           │ Agent Panel     │
│ Wishlist      │ ┌───────────────────────────────────────┐ │ ...             │
│               │ │ Approved (8) / In Review (3) / Rejected (1)             │ │
│               │ │ List:                                                    │ │
│               │ │  - User Accounts  [approved]                             │ │
│               │ │  - Payments       [in_review]                            │ │
│               │ └───────────────────────────────────────┘ │                 │
│               │ [Confirm Wishlist Complete] [Back]                          │
└───────────────┴───────────────────────────────────────────┴─────────────────┘
```

### F) Notifications Inbox (supporting)

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Top Bar [Inbox] [Search] [Filters: Unread | Project | Type]              │
├───────────────────────────────────────────────────────────────────────────┤
│  ▸ [Project A] “Template ready, seed wishlist?”  [Approve] [Open]         │
│  ▸ [Project B] “Review items pending”            [Open]                   │
│  ▸ [Project A] “Voice processing complete”       [Open]                   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3) Figma-Ready Specs

**Frames**

* Desktop: 1440 × 900
* Top Bar height: 64
* Sidebar width: 280–320
* Agent Panel width: 320
* Center content max-width: 1200 (within remaining area)
* Grid: 12 columns (center), 24px gutter

**Auto-Layout**

* Use Auto Layout for:

  * Sidebars (vertical stacks with 16–24px gap)
  * Lists/boards (8–16px gap)
  * Cards (vertical, padded)
  * Buttons (8px internal padding; 12–16px horizontal)

**Constraints**

* Top Bar: fixed top
* Sidebar: left fixed, scrollable
* Agent panel: right fixed, scrollable
* Center: fills remaining, scrollable

**Components (Figma)**

* `Glass/Card` (variant: with header/without)
* `Button` (primary, secondary, ghost)
* `Chip` (status variants)
* `ListItem/WishlistCard` (variants: compact, expanded)
* `Drawer` (right)
* `Modal` (center)
* `Toast/Notification`
* `VoiceRecorder` (Idle/Rec/Processing/Done)
* `SearchBar`, `Tag`, `Select`
* `Stepper` (Stage: Voice ▸ Template ▸ Wishlist)

**Styles**

* Color styles from tokens
* Text styles: H1/H2/Body/Caption
* Effects: shadow-primary, glass-border

---

## 4) React Component Checklist (Stage 1)

### Layout

* `<AppShell>`: top bar + panes; handles theme, routing
* `<TopBar>`: project name, stepper, user menu
* `<Sidebar>`: artifact list (Stage 1 shows Wishlist groups & filters)
* `<AgentPanel>`: chat/voice statuses (placeholder until mesh)

### Voice Intake

* `<VoiceRecorder>`

  * Props: `{ onStart, onStop, onComplete(transcript), isProcessing }`
  * State: idle|recording|processing|complete
  * A11y: space to toggle; label; visual + text indicators
* `<WaveformVisualizer>`

  * Props: `{ stream, isActive }`

### Template

* `<TemplateSummaryCard>`

  * Props: `{ templateName, version, industry, summary, defaultWishes }`
* `<SeedWishlistButton onSeed={fn} />`

### Wishlist

* `<WishlistHeader>`

  * Props: `{ onSearch, filters, onOpenSeedModal, onSubmitReview }`
* `<WishlistList>`

  * Props: `{ items, onEdit, onApprove, onReject, onReorder }`
* `<WishlistCard>`

  * Props: `{ title, description, source, status, tags, orderIndex }`
  * Actions: approve/reject/edit/drag
* `<WishlistEditDrawer>`

  * Props: `{ item, open, onClose, onSave }`
* `<SeedFromTemplateModal>`

  * Props: `{ suggestedItems, open, onClose, onAddSelected }`

### Notifications

* `<NotificationBell/>`
* `<NotificationsInbox/>`

  * Props: `{ items, onOpenItem, onApproveAction }`

### Shared Primitives

* `<GlassCard>`, `<Button>`, `<Chip>`, `<Icon>`, `<TextField>`, `<TextArea>`,
  `<Select>`, `<TagInput>`, `<Modal>`, `<Drawer>`, `<Toast>`, `<Stepper>`,
  `<EmptyState>`, `<Loader>`

**Data Interfaces (TypeScript)**

```ts
type Project = {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  product_types: string[]; // ["web","mobile",...]
  status: "draft" | "collecting_voice" | "template_ready" | "wishlist_in_progress" | "wishlist_complete";
  created_at: string; updated_at: string;
};

type WishlistItem = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  source: "user" | "template_suggested" | "agent_inferred";
  status: "draft" | "suggested" | "in_review" | "approved" | "rejected";
  order_index?: number;
  seeded_from_template_id?: string;
  seeded_from_version?: number;
  created_by?: string;
  created_at: string; updated_at: string;
};

type TemplateSummary = {
  id: string;
  name: string;
  version: number;
  industry?: string;
  summary: string;
  default_wishes: Array<Pick<WishlistItem, "title"|"description"|"category"|"tags">>;
};
```

---

## 5) Page Skeletons (JSX-Level Pseudocode)

**AppShell**

```tsx
<AppShell>
  <TopBar project={project} step="wishlist" />
  <Sidebar>
    <WishlistSidebar projectId={project.id} />
  </Sidebar>
  <MainContent>
    <Outlet /> {/* Routes render here */}
  </MainContent>
  <AgentPanel />
</AppShell>
```

**Voice Intake**

```tsx
<GlassCard>
  <h2>Tell us about your project</h2>
  <VoiceRecorder
    onComplete={(transcript) => api.submitTranscript(project.id, transcript)}
    isProcessing={processing}
  />
  <p className="muted">We’ll use your voice info to pick a template.</p>
</GlassCard>
```

**Template Preview**

```tsx
<TemplateSummaryCard {...template}>
  <Button onClick={() => seedWishlist(project.id, template.id)}>Seed Wishlist</Button>
</TemplateSummaryCard>
```

**Wishlist**

```tsx
<WishlistHeader
  onSearch={setQuery}
  filters={filters}
  onOpenSeedModal={() => setOpenSeed(true)}
  onSubmitReview={() => submitForReview(project.id)}
/>

<WishlistList
  items={filteredItems}
  onEdit={openEdit}
  onApprove={(id) => updateStatus(id, "approved")}
  onReject={(id) => updateStatus(id, "rejected")}
  onReorder={reorder}
/>

<WishlistEditDrawer
  item={editingItem}
  open={!!editingItem}
  onClose={() => setEditingItem(null)}
  onSave={saveItem}
/>

<SeedFromTemplateModal
  open={openSeed}
  suggestedItems={suggested}
  onClose={() => setOpenSeed(false)}
  onAddSelected={(items)=> addSeeded(items)}
/>
```

**Review Summary**

```tsx
<GlassCard>
  <h2>Wishlist Summary</h2>
  <SummaryStats approved={8} inReview={3} rejected={1} />
  <Button onClick={() => finalizeWishlist(project.id)}>Confirm Wishlist Complete</Button>
</GlassCard>
```

---

## 6) Interactions (Key Flows)

* **Voice → Template**

  * Record → Processing → Transcript saved → Template selected (Industry Expert step behind the scenes) → Navigate to Template Preview.

* **Seed Wishlist**

  * Default wishes displayed → Select/Confirm → Items inserted with `source='template_suggested'`, `status='suggested'`.

* **User Adds Wishlist Item**

  * Inline add (title, description) → `source='user'`, `status='in_review'`.

* **Approve/Reject**

  * Card actions update status; animate chip transition; update order if needed.

* **Submit for Review**

  * Locks editing (optional), shows summary → “Confirm Wishlist Complete”.

---

## 7) Accessibility + Responsiveness

* Focus rings on all controls (2px cyan outline + glow).
* Keyboard shortcuts:

  * `r` start/stop recording (when focused)
  * `n` new wishlist item
  * `f` search focus
* Reduced motion mode: disable waveform animation, damp transitions.
* Responsive:

  * Collapse Agent Panel under 1200px (toggleable tray).
  * Sidebar collapsible to icons.
  * Mobile: stacked layout (Top bar → content → toggled side panels).

---

## 8) Developer Handoff Checklist

* [ ] Figma file with frames, components, tokens, and sample screens
* [ ] React component stubs with prop types & storybook examples
* [ ] Tailwind config or CSS variables theme
* [ ] Routing structure:

  * `/dashboard`
  * `/project/:id/voice`
  * `/project/:id/template`
  * `/project/:id/wishlist`
  * `/inbox`
* [ ] Mock API adapters for Stage 1:

  * `GET/POST /projects`
  * `GET/POST /projects/:id/wishlist_items`
  * `POST /projects/:id/voice_transcript`
  * `POST /projects/:id/seed_wishlist`
* [ ] Accessibility audit checklist for components
* [ ] Empty states, loading states, and error toasts defined

---

## 9) Component Inventory (for React Implementation)

* Layout: `AppShell`, `TopBar`, `Sidebar`, `AgentPanel`, `MainContent`
* Primitives: `GlassCard`, `Button{Primary,Secondary,Ghost}`, `Icon`, `Chip`,
  `TextField`, `TextArea`, `Select`, `TagInput`, `Modal`, `Drawer`, `Toast`, `Stepper`
* Voice: `VoiceRecorder`, `WaveformVisualizer`, `RecordingIndicator`
* Template: `TemplateSummaryCard`, `SeedWishlistButton`
* Wishlist: `WishlistHeader`, `WishlistList`, `WishlistCard`, `WishlistEditDrawer`, `SeedFromTemplateModal`
* Notifications: `NotificationBell`, `NotificationsInbox`
* Utility: `EmptyState`, `Loader`, `ConfirmDialog`

---
