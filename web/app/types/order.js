//@flow

export type Resource = {
  resource: string,
  id: number,
  name: string,
  modality_id: number,
  updated_at: number,
  external_system_id: number,
  site_id: number,
  modality: {
    id: number,
    modality: string,
    updated_at: number,
  }
}

export type Patient = {
  id: number,
  gender: string,
  name: string,
  updated_at: number,
  birthdate: string,
}

export type PatientMRN = {
  empi: boolean,
  id: number,
  patient_id: number,
  updated_at: number,
  external_system_id: number,
  mrn: string,
  patient: Patient,
}

export type RadExamTime = {
  check_in: ?number,
  id: number,
  end_exam: number,
  reschedule_event: ?number,
  cancelled: ?number,
  updated_at: number,
  begin_exam: number,
  appointment: number,
  end_exam_event: ?number,
  begin_exam_event: ?number,
  begin_reg: ?number,
  appointment_duration: ?number,
  rad_exam_id: number,
  schedule_event: number,
  order_arrival: number,
  sign_in: number
}

export type RadExamDetail = {
  patient_age: number,
  procedure_change_reason_id: ?number,
  diagnosis: ?number,
  id: number,
  procedure_change_comments: ?number,
  updated_at: number,
  order_comments: ?number,
  procedure_modifier_id: ?number,
  delay_reason_id: ?number,
  previous_procedure_id: ?number,
  rad_exam_id: number
}

export type Procedure = {
  tech_fee: number,
  specialty_id: ?number,
  id: number,
  updated_at: number,
  pro_fee: number,
  pro_rvu: number, scheduled_duration: number,
  external_system_id: number,
  volume: number,
  tech_rvu: number,
  active: boolean,
  practice_fee: number,
  code: string,
  description: string,
  reportable: boolean
}

export type SiteClass = {
  trauma: boolean,
  id: number,
  name: ?number,
  patient_type_id: number,
  ed: boolean,
  updated_at: number,
  site_class: string,
  external_system_id: number,
  cms_facility_type_id: ?number,
  site_id: number,
  patient_type: {
    id: number,
    updated_at: number,
    patient_type: string,
  }
}

export type RadExamPersonnel = {
  signin_id: ?number,
  assisting_tech2_id: ?number,
  ordering_id: number,
  technologist_id: number,
  begin_exam_id: ?number,
  performing_id: ?number,
  id: number,
  authorizing_id: ?number,
  checkin_id: ?number,
  end_exam_id: ?number,
  updated_at: number,
  scheduler_id: ?number,
  attending_id: number,
  rad_exam_id: number,
  assisting_tech3_id: ?number,
  assisting_tech1_id: ?number,
  ordering: {
    id: number,
    person_id: number,
    name: string,
    fte: number,
    updated_at: number,
    active: boolean
  }
}

export type RadExamStatus = {
  id: number,
  universal_event_type_id: number,
  updated_at: number,
  status: string,
  external_system_id: number,
  universal_event_type: {
    id: number,
    event_type: string,
    updated_at: number,
    description: string,
  }
}

export type RadExam = {
  current_status_id: number,
  site_class_id: number,
  first_final_report_id: number,
  id: number,
  last_prelim_report_id: ?number,
  last_final_report_id: number,
  procedure_id: number,
  accession: string,
  order_id: number,
  updated_at: number,
  patient_mrn_id: number,
  first_report_id: number,
  visit_id: ?number,
  external_system_id: number,
  rad_exam_department_id: number,
  exam_priority_id: ?number,
  site_sublocation_id: ?number,
  first_prelim_report_id: ?number,
  current_report_id: number,
  site_id: number,
  resource_id: number,
  rad_exam_time: RadExamTime,
  rad_exam_personnel: RadExamPersonnel,
  rad_exam_detail: RadExamDetail,
  procedure: Procedure,
  patient_mrn: PatientMRN,
  resource: Resource,
  site_class: SiteClass,
  current_status: RadExamStatus,
  site_sublocation: Object
}

export type Employee = {
  id: number,
  person_id: number,
  name: string,
  fte: number,
  updated_at: number,
  active: boolean
}

export type Event = {
  id: number,
  exam_adjustment_id: number,
  event_type: string,
  new_state: {start_time?: string | number} & {[string]: string | boolean},
  comments: ?string,
  created_at: number,
  updated_at: string,
  employee: Employee,
}

export type Order = {
  department_id: number,
  current_status_id: ?number,
  site_class_id: ?number,
  id: number,
  order_number: number,
  procedure_id: ?number,
  updated_at: number,
  patient_mrn_id: number,
  visit_id: ?number,
  external_system_id: number,
  ordering_provider_id: ?number,
  exam_priority_id: ?number,
  appointment: number,
  master_order_id: ?number,
  appointment_duration: ?number,
  order_arrival: number,
  site_id: number,
  resource_id: ?number,
  master_order: Object,
  resource: Object,
  site_class: Object,
  procedure: Object,
  current_status: RadExamStatus,
  patient_mrn: PatientMRN,
  rad_exams: Array<RadExam>,
  adjusted: Object,
  events: Array<Event>,
  rad_exam: RadExam,
  groupIdentity: string,
}

export type Images = {
  spinner: string,
}

export type ViewType = "calendar" | "kiosk" | "overview"
