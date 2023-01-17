export interface DashboardData {
  meta: Meta;
  dashboard: Dashboard;
}
export interface Meta {
  type: string;
  canSave: boolean;
  canEdit: boolean;
  canAdmin: boolean;
  canStar: boolean;
  slug: string;
  url: string;
  expires: string;
  created: string;
  updated: string;
  updatedBy: string;
  createdBy: string;
  version: number;
  hasAcl: boolean;
  isFolder: boolean;
  folderId: number;
  folderUid: string;
  folderTitle: string;
  folderUrl: string;
  provisioned: boolean;
  provisionedExternalId: string;
}
export interface Dashboard {
  annotations: Annotations;
  editable: boolean;
  gnetId?: null;
  graphTooltip: number;
  id: number;
  links?: null[] | null;
  panels?: PanelsEntity[] | null;
  refresh: string;
  schemaVersion: number;
  style: string;
  tags?: null[] | null;
  templating: Templating;
  time: Time;
  timepicker: Timepicker;
  timezone: string;
  title: string;
  uid: string;
  version: number;
}
export interface Annotations {
  list?: ListEntity[] | null;
}
export interface ListEntity {
  builtIn: number;
  datasource: string;
  enable: boolean;
  hide: boolean;
  iconColor: string;
  name: string;
  target: Target;
  type: string;
}
export interface Target {
  limit: number;
  matchAny: boolean;
  tags?: null[] | null;
  type: string;
}
export interface PanelsEntity {
  datasource?: string | null;
  fieldConfig?: FieldConfig | null;
  gridPos: GridPos;
  id: number;
  options: Options;
  targets?: TargetsEntity[] | null;
  title: string;
  type: string;
  description?: string | null;
}
export interface FieldConfig {
  defaults: Defaults;
  overrides?: null[] | null;
}
export interface Defaults {
  color: ThresholdsStyleOrColorOrTooltip;
  custom: Custom;
  mappings?: null[] | null;
  thresholds: Thresholds;
}
export interface ThresholdsStyleOrColorOrTooltip {
  mode: string;
}
export interface Custom {
  axisLabel: string;
  axisPlacement: string;
  barAlignment: number;
  drawStyle: string;
  fillOpacity: number;
  gradientMode: string;
  hideFrom: HideFrom;
  lineInterpolation: string;
  lineWidth: number;
  pointSize: number;
  scaleDistribution: ScaleDistribution;
  showPoints: string;
  spanNulls: boolean;
  stacking: Stacking;
  thresholdsStyle: ThresholdsStyleOrColorOrTooltip;
}
export interface HideFrom {
  legend: boolean;
  tooltip: boolean;
  viz: boolean;
}
export interface ScaleDistribution {
  type: string;
}
export interface Stacking {
  group: string;
  mode: string;
}
export interface Thresholds {
  mode: string;
  steps?: StepsEntity[] | null;
}
export interface StepsEntity {
  color: string;
  value?: number | null;
}
export interface GridPos {
  h: number;
  w: number;
  x: number;
  y: number;
}
export interface Options {
  legend?: Legend | null;
  tooltip?: ThresholdsStyleOrColorOrTooltip1 | boolean;
  color?: string | null;
  seriesCountSize?: string | null;
  showSeriesCount?: boolean | null;
  text?: string | null;
  alt_field?: string | null;
  height?: string | null;
  icon_field?: string | null;
  overlay?: Overlay | null;
  singleFill?: boolean | null;
  tooltip_date_elapsed?: boolean | null;
  tooltip_field?: string | null;
  tooltip_include_date?: boolean | null;
  tooltip_include_field?: boolean | null;
  underline?: Underline | null;
  width?: string | null;
}
export interface Legend {
  calcs?: null[] | null;
  displayMode: string;
  placement: string;
}
export interface ThresholdsStyleOrColorOrTooltip1 {
  mode: string;
}
export interface Overlay {
  bindings: Bindings;
  field: string;
  height: HeightOrWidth;
  position: string;
  width: HeightOrWidth;
}
export interface Bindings {
  bindings?: null[] | null;
  has_text: boolean;
  unbounded: string;
}
export interface HeightOrWidth {
  size: number;
  unit: string;
}
export interface Underline {
  field: string;
  text_size: string;
}
export interface TargetsEntity {
  domain?: string | null;
  name?: string | null;
  refId: string;
  sensorCode?: string | null;
  station?: string | null;
  type?: string | null;
  volId?: string | null;
}
export interface Templating {
  list?: null[] | null;
}
export interface Time {
  from: string;
  to: string;
}
export interface Timepicker {}
