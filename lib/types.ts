// Entity-Component System Types
export type EntityId = string

export interface Entity {
  id: EntityId
  name: string
  parentId?: EntityId
  order: number
  components: Record<ComponentType, ComponentData>
  children?: EntityId[]
}

export type ComponentType =
  // Content Components (render actual content)
  | "TextComponent"
  | "ButtonComponent"
  | "ImageComponent"
  | "DividerComponent"
  | "SpacerComponent"
  | "IconComponent"
  | "LinkComponent"
  | "BadgeComponent"
  | "MapEmbedComponent"
  | "QRComponent"
  | "SliderComponent"
  | "AudioComponent"
  | "VideoComponent"
  | "AccordionComponent"
  | "TabsComponent"
  | "ContactFormComponent"
  | "CertificationPreviewComponent"
  | "GalleryComponent"
  | "TimelineCVComponent"
  | "TestimonialComponent"
  | "SkillsComponent"
  | "ProjectCardComponent"
  | "EducationComponent"
  | "AwardsComponent"
  | "CalendarComponent"
  | "PricingTableComponent"
  | "NewsletterComponent"
  | "StatisticsComponent"
  | "SocialLinksComponent"
  // Effect Components (modify other components)
  | "ColorPaletteComponent"
  | "FontStyleComponent"
  | "CustomFontComponent"
  | "ImageFilterComponent"
  | "GradientComponent"
  | "PatternComponent"
  | "BorderComponent"
  | "ShadowComponent"
  | "TooltipComponent"
  | "EmbedSocialComponent"
  | "AnalyticsComponent"
  | "SEOMetadataComponent"
  | "ExportCardComponent"

export interface ComponentDefinition {
  type: ComponentType
  name: string
  description: string
  cost: number
  category: "basic" | "aesthetic" | "interaction" | "portfolio" | "professional"
  subcategory?: string
  componentClass: "content" | "effect" | "global"
  targets?: ComponentType[] // Which components this effect can target
  defaultData: any
  new?: boolean
}

export interface ComponentData {
  type: ComponentType
  data: any
}

// Text Component
export interface TextData {
  content: string
  isHeading: boolean
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  textAlign: "left" | "center" | "right" | "justify"
  color?: string
}

// Button Component
export interface ButtonData {
  text: string
  variant: "default" | "outline" | "ghost" | "link"
  size: "sm" | "default" | "lg"
  fullWidth: boolean
  icon: string
  iconPosition: "left" | "right"
  url: string
  color?: string
  backgroundColor?: string
}

// Divider Component
export interface DividerData {
  style: "solid" | "dashed" | "dotted"
  width: string
  thickness: number
  color?: string
  margin: string
}

// Spacer Component
export interface SpacerData {
  height: string
  width: string
}

// Icon Component
export interface IconData {
  name: string
  size: string
  color?: string
  strokeWidth: number
}

// Link Component
export interface LinkData {
  text: string
  url: string
  openInNewTab: boolean
  underline: boolean
  color?: string
}

// Badge Component
export interface BadgeData {
  text: string
  variant: "default" | "secondary" | "outline" | "destructive"
  size: "sm" | "default" | "lg"
  color?: string
  backgroundColor?: string
}

// Map Embed Component
export interface MapEmbedData {
  latitude: number
  longitude: number
  zoom: number
  markerTitle: string
  markerDescription: string
  mapType: "roadmap" | "satellite" | "hybrid" | "terrain"
  height: string
  width: string
  showControls: boolean
  showMarker: boolean
  apiKey?: string
}

// Image Component
export interface ImageData {
  url: string
  alt: string
  width: string
  height: string
  borderRadius: string
  shadow: boolean
}

// Color Palette Component (Effect)
export interface ColorPaletteData {
  palette: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  targetComponents: ComponentType[] // Which components to affect
  applyToEntity: boolean // Apply to entire entity or specific components
}

// Font Style Component (Effect)
export interface FontStyleData {
  fontFamily: string
  headingSize: string
  bodySize: string
  fontWeight: string
  targetComponents: ComponentType[] // Which text components to affect
  applyToEntity: boolean
}

// Custom Font Component (Effect)
export interface CustomFontData {
  fontUrl: string
  fontName: string
  fontWeight: string
  fontStyle: string
  targetComponents: ComponentType[]
  applyToEntity: boolean
}

// Image Filter Component (Effect)
export interface ImageFilterData {
  filter: string
  intensity: number
  targetEntityId?: string
  showPreview?: boolean
  targetComponents: ComponentType[] // Which image components to affect
}

// Border Component (Effect)
export interface BorderData {
  width: string
  style: "solid" | "dashed" | "dotted"
  color: string
  radius: string
  sides: string[]
  targetComponents: ComponentType[]
  applyToEntity: boolean
}

// Shadow Component (Effect)
export interface ShadowData {
  type: "drop" | "inner" | "text"
  x: string
  y: string
  blur: string
  spread: string
  color: string
  targetComponents: ComponentType[]
  applyToEntity: boolean
}

// Gradient Component (Effect)
export interface GradientData {
  type: "linear" | "radial"
  direction: string
  colors: string[]
  stops: number[]
  targetComponents: ComponentType[]
  applyToEntity: boolean
}

// Pattern Component (Effect)
export interface PatternData {
  pattern: string
  primaryColor: string
  secondaryColor: string
  opacity: number
  size: string
  targetComponents: ComponentType[]
  applyToEntity: boolean
}

// Tooltip Component (Effect)
export interface TooltipData {
  text: string
  position: "top" | "right" | "bottom" | "left"
  style: "light" | "dark" | "colorful"
  targetComponents: ComponentType[]
}

// QR Component
export interface QRData {
  content: string
  size: number
  color: string
  backgroundColor: string
  logo?: string
}

// Slider Component
export interface SliderData {
  images: string[]
  autoplay: boolean
  interval: number
  showDots: boolean
  showArrows: boolean
}

// Accordion Component
export interface AccordionData {
  items: {
    title: string
    content: string
  }[]
  allowMultiple: boolean
  defaultOpen: number[]
}

// Tabs Component
export interface TabsData {
  tabs: {
    title: string
    content: string
  }[]
  defaultTab: number
  orientation: "horizontal" | "vertical"
}

// Social Links Component
export interface SocialLinksData {
  links: {
    platform: string
    url: string
    username: string
  }[]
  displayStyle: "icon" | "text" | "both"
  size: "small" | "medium" | "large"
  color?: string
}

// Contact Form Component
export interface ContactFormData {
  fields: {
    type: string
    name: string
    label: string
    required: boolean
  }[]
  submitButtonText: string
  successMessage: string
  errorMessage: string
}

// Skills Component
export interface SkillsData {
  skills: {
    name: string
    rating: number
  }[]
  displayStyle: "bars" | "tags" | "list"
  showRatings: boolean
}

// Project Card Component
export interface ProjectCardData {
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  technologies: string[]
  completed: string
}

// Education Component
export interface EducationData {
  institutions: {
    name: string
    degree: string
    field: string
    startYear: string
    endYear: string
    logo: string
  }[]
  displayStyle: "cards" | "list" | "timeline"
}

// Awards Component
export interface AwardsData {
  awards: {
    title: string
    issuer: string
    date: string
    description: string
    imageUrl: string
  }[]
  displayStyle: "list" | "grid"
}

// Calendar Component
export interface CalendarData {
  availableDays: string[]
  timeSlots: string[]
  duration: number
  timezone: string
  confirmationEmail: boolean
}

// Pricing Table Component
export interface PricingTableData {
  plans: {
    name: string
    price: string
    period: string
    features: string[]
    cta: string
    ctaUrl: string
    highlighted: boolean
  }[]
  layout: "horizontal" | "vertical"
}

// Newsletter Component
export interface NewsletterData {
  title: string
  description: string
  buttonText: string
  placeholder: string
  successMessage: string
  service: "mailchimp" | "convertkit" | "custom"
}

// Statistics Component
export interface StatisticsData {
  stats: {
    label: string
    value: string
    icon: string
  }[]
  layout: "grid" | "row"
  animation: boolean
}

// Embed Social Component
export interface EmbedSocialData {
  platform: "instagram" | "youtube" | "twitter"
  url: string
  displayType: "feed" | "post" | "profile"
}

// Audio Component
export interface AudioData {
  url: string
  autoplay: boolean
  loop: boolean
  controls: boolean
}

// Video Component
export interface VideoData {
  url: string
  autoplay: boolean
  loop: boolean
  controls: boolean
  thumbnail?: string
}

// Certification Preview Component
export interface CertificationPreviewData {
  title: string
  issuer: string
  date: string
  imageUrl: string
  certificateUrl: string
}

// Gallery Component
export interface GalleryData {
  images: {
    url: string
    title: string
    description: string
  }[]
  layout: "grid" | "masonry" | "carousel"
}

// Timeline CV Component
export interface TimelineCVData {
  entries: {
    title: string
    organization: string
    startDate: string
    endDate: string
    description: string
    logo?: string
  }[]
}

// Testimonial Component
export interface TestimonialData {
  quote: string
  author: string
  position: string
  company: string
  avatarUrl?: string
  rating?: number
}

// Analytics Component
export interface AnalyticsData {
  trackPageViews: boolean
  trackClicks: boolean
  trackConversions: boolean
  goals: string[]
}

// SEO Metadata Component
export interface SEOMetadataData {
  title: string
  description: string
  keywords: string[]
  ogImage: string
  twitterCard: "summary" | "summary_large_image" | "app" | "player"
}

// Export Card Component
export interface ExportCardData {
  format: "pdf" | "png" | "jpg"
  quality: "low" | "medium" | "high"
  includeBackground: boolean
}

// Preset Types
export interface Preset {
  id: string
  name: string
  description: string
  thumbnail: string
  entities: Record<string, Omit<Entity, "id">>
}

// Application State
export interface CardBuilderState {
  entities: Record<EntityId, Entity>
  rootEntities: EntityId[]
  selectedEntityId: EntityId | null
  selectedComponentType: ComponentType | null
  availablePoints: number
  totalPoints: number
  editMode: boolean
}
