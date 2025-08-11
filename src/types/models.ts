export type ProjectStatus =
  | 'draft'
  | 'intake_voice'
  | 'template_pending'
  | 'wishlist_active'
  | 'wishlist_review'
  | 'wishlist_approved';

export type Project = {
  id: string;
  owner_id?: string;
  name: string;
  description?: string;
  product_types?: string[];
  status: ProjectStatus;
  created_at?: string; updated_at?: string;
};

export type WishlistItemStatus = 'draft' | 'suggested' | 'in_review' | 'approved' | 'rejected';
export type WishlistItemSource = 'user' | 'template_suggested' | 'agent_inferred';

export type WishlistItem = {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  source: WishlistItemSource;
  status: WishlistItemStatus;
  order_index?: number;
  created_at?: string; updated_at?: string;
};

export type TemplateSummary = {
  id: string;
  name: string;
  version: number;
  industry?: string;
  summary: string;
  default_wishes: Array<Pick<WishlistItem, 'title' | 'description' | 'category' | 'tags'>>;
};
