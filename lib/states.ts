/**
 * 51-state home-care dataset, generated from research/homecare_states.csv
 * ("(verify)" markers stripped). Median hourly cost, Medicaid HCBS program
 * names, agency licensure, and HHA training-hour minimums per state.
 */

export interface StateInfo {
  name: string;
  slug: string;
  /** Median private-pay hourly cost for home care, e.g. "$36/hr" */
  hourlyCost: string;
  /** Medicaid HCBS program names that can pay for care at home */
  programs: string[];
  /** Whether the state licenses non-medical home care agencies */
  licensed: boolean;
  /** Full licensure line from the dataset */
  licensure: string;
  /** Minimum aide training hours (federal floor is 75) */
  trainingHours: number;
  /** Full training-requirement line from the dataset */
  trainingNote: string;
}

export const states: StateInfo[] = [
  {
    "name": "Alabama",
    "slug": "alabama",
    "hourlyCost": "$27/hr",
    "programs": [
      "Elderly & Disabled (E&D) Waiver",
      "ACT Waiver",
      "Personal Choices"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical agencies (ADPH licenses home health only)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Alaska",
    "slug": "alaska",
    "hourlyCost": "$38/hr",
    "programs": [
      "Alaskans Living Independently (ALI) Waiver",
      "Community First Choice",
      "Personal Care Services"
    ],
    "licensed": false,
    "licensure": "No license for private-pay non-medical agencies (Dept. of Health certifies Medicaid PCA agencies)",
    "trainingHours": 140,
    "trainingNote": "140 hrs"
  },
  {
    "name": "Arizona",
    "slug": "arizona",
    "hourlyCost": "$38/hr",
    "programs": [
      "Arizona Long Term Care System (ALTCS)"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (AZ Dept. of Health Services)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Arkansas",
    "slug": "arkansas",
    "hourlyCost": "$25/hr",
    "programs": [
      "ARChoices in Homecare Waiver",
      "Personal Care Program",
      "IndependentChoices"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 AR Dept. of Health",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "California",
    "slug": "california",
    "hourlyCost": "$40/hr",
    "programs": [
      "In-Home Supportive Services (IHSS)",
      "HCB Alternatives (HCBA) Waiver",
      "MSSP"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 CA Dept. of Social Services (Home Care Organization license)",
    "trainingHours": 120,
    "trainingNote": "120 hrs"
  },
  {
    "name": "Colorado",
    "slug": "colorado",
    "hourlyCost": "$42/hr",
    "programs": [
      "Elderly Blind & Disabled (EBD) Waiver (CDASS/IHSS)",
      "Community First Choice"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 CO Dept. of Public Health & Environment",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Connecticut",
    "slug": "connecticut",
    "hourlyCost": "$36/hr",
    "programs": [
      "CT Home Care Program for Elders (CHCPE)",
      "Community First Choice"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 CT Dept. of Public Health (homemaker-companion agencies register with DCP)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Delaware",
    "slug": "delaware",
    "hourlyCost": "$35/hr",
    "programs": [
      "Diamond State Health Plan Plus (DSHP-Plus)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 DE Division of Health Care Quality",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "District of Columbia",
    "slug": "district-of-columbia",
    "hourlyCost": "$35/hr",
    "programs": [
      "Elderly & Persons with Physical Disabilities (EPD) Waiver",
      "State Plan Personal Care"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 DC Health",
    "trainingHours": 125,
    "trainingNote": "125 hrs"
  },
  {
    "name": "Florida",
    "slug": "florida",
    "hourlyCost": "$32/hr",
    "programs": [
      "Statewide Medicaid Managed Care Long-Term Care (SMMC-LTC)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 FL Agency for Health Care Administration (AHCA)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Georgia",
    "slug": "georgia",
    "hourlyCost": "$32/hr",
    "programs": [
      "Community Care Services Program (CCSP)",
      "SOURCE"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 GA Dept. of Community Health (private home care provider license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Hawaii",
    "slug": "hawaii",
    "hourlyCost": "$41/hr",
    "programs": [
      "QUEST Integration (QI)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 HI Dept. of Health",
    "trainingHours": 100,
    "trainingNote": "100 hrs"
  },
  {
    "name": "Idaho",
    "slug": "idaho",
    "hourlyCost": "$39/hr",
    "programs": [
      "Aged & Disabled (A&D) Waiver",
      "Personal Care Services"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical agencies (Dept. of Health & Welfare)",
    "trainingHours": 120,
    "trainingNote": "120 hrs"
  },
  {
    "name": "Illinois",
    "slug": "illinois",
    "hourlyCost": "$36/hr",
    "programs": [
      "HCBS Waiver for Persons who are Elderly",
      "Supportive Living Program"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 IL Dept. of Public Health (home services agency license)",
    "trainingHours": 120,
    "trainingNote": "120 hrs"
  },
  {
    "name": "Indiana",
    "slug": "indiana",
    "hourlyCost": "$35/hr",
    "programs": [
      "PathWays for Aging (formerly Aged & Disabled Waiver)",
      "CDAC"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 IN Dept. of Health (personal services agency)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Iowa",
    "slug": "iowa",
    "hourlyCost": "$41/hr",
    "programs": [
      "HCBS Elderly Waiver"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (DIAL licenses home health only)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Kansas",
    "slug": "kansas",
    "hourlyCost": "$34/hr",
    "programs": [
      "Frail Elderly (FE) Waiver (KanCare)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 KS Dept. of Health & Environment",
    "trainingHours": 110,
    "trainingNote": "110 hrs"
  },
  {
    "name": "Kentucky",
    "slug": "kentucky",
    "hourlyCost": "$33/hr",
    "programs": [
      "Home & Community Based (HCB) Waiver"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 KY Cabinet for Health & Family Services",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Louisiana",
    "slug": "louisiana",
    "hourlyCost": "$26/hr",
    "programs": [
      "Community Choices Waiver",
      "Long-Term Personal Care Services (LT-PCS)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 LA Dept. of Health (Health Standards; personal care attendant agency license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Maine",
    "slug": "maine",
    "hourlyCost": "$45/hr",
    "programs": [
      "Elderly & Adults with Disabilities Waiver (Section 19)",
      "Consumer Directed Attendant Services"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 ME DHHS (personal care agency license)",
    "trainingHours": 180,
    "trainingNote": "180 hrs"
  },
  {
    "name": "Maryland",
    "slug": "maryland",
    "hourlyCost": "$35/hr",
    "programs": [
      "Community Options Waiver",
      "Community First Choice",
      "CPAS"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 MD Office of Health Care Quality (RSA license)",
    "trainingHours": 100,
    "trainingNote": "100 hrs"
  },
  {
    "name": "Massachusetts",
    "slug": "massachusetts",
    "hourlyCost": "$40/hr",
    "programs": [
      "Frail Elder Waiver",
      "PCA Program",
      "Senior Care Options"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care agencies (EOHHS)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Michigan",
    "slug": "michigan",
    "hourlyCost": "$35/hr",
    "programs": [
      "MI Choice Waiver",
      "Home Help Program"
    ],
    "licensed": false,
    "licensure": "No state license for home care agencies (LARA)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Minnesota",
    "slug": "minnesota",
    "hourlyCost": "$44/hr",
    "programs": [
      "Elderly Waiver",
      "Community First Services & Supports (CFSS, formerly PCA)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 MN Dept. of Health (home care provider license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Mississippi",
    "slug": "mississippi",
    "hourlyCost": "$24/hr",
    "programs": [
      "Elderly & Disabled (E&D) Waiver",
      "Independent Living Waiver"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (MS State Dept. of Health)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Missouri",
    "slug": "missouri",
    "hourlyCost": "$33/hr",
    "programs": [
      "Aged & Disabled Waiver",
      "Medicaid Personal Care / Consumer Directed Services"
    ],
    "licensed": false,
    "licensure": "No license for private-pay non-medical agencies (DHSS licenses in-home Medicaid providers)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Montana",
    "slug": "montana",
    "hourlyCost": "$38/hr",
    "programs": [
      "Big Sky Waiver",
      "Community First Choice / Personal Care Services"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical agencies (DPHHS)",
    "trainingHours": 91,
    "trainingNote": "91 hrs"
  },
  {
    "name": "Nebraska",
    "slug": "nebraska",
    "hourlyCost": "$36/hr",
    "programs": [
      "Aged & Disabled (AD) Waiver",
      "Personal Assistance Services"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (NE DHHS)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Nevada",
    "slug": "nevada",
    "hourlyCost": "$37/hr",
    "programs": [
      "Frail Elderly (FE) Waiver",
      "Personal Care Services"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 NV Division of Public & Behavioral Health (personal care agency license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "New Hampshire",
    "slug": "new-hampshire",
    "hourlyCost": "$40/hr",
    "programs": [
      "Choices for Independence (CFI) Waiver",
      "Personal Care Attendant Services"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 NH DHHS",
    "trainingHours": 100,
    "trainingNote": "100 hrs"
  },
  {
    "name": "New Jersey",
    "slug": "new-jersey",
    "hourlyCost": "$38/hr",
    "programs": [
      "Managed Long Term Services & Supports (MLTSS)",
      "Personal Preference Program"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 NJ Division of Consumer Affairs (health care service firm registration)",
    "trainingHours": 76,
    "trainingNote": "76 hrs"
  },
  {
    "name": "New Mexico",
    "slug": "new-mexico",
    "hourlyCost": "$30/hr",
    "programs": [
      "Community Benefit Program (Turquoise Care)"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 NM Health Care Authority",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "New York",
    "slug": "new-york",
    "hourlyCost": "$35/hr",
    "programs": [
      "Managed Long Term Care",
      "CDPAP",
      "Community First Choice Option"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 NY State Dept. of Health (LHCSA license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum; 40-hr NYS PCA program for personal care)"
  },
  {
    "name": "North Carolina",
    "slug": "north-carolina",
    "hourlyCost": "$30/hr",
    "programs": [
      "Community Alternatives Program for Disabled Adults (CAP/DA)",
      "Personal Care Services"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 NC Division of Health Service Regulation (home care agency license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "North Dakota",
    "slug": "north-dakota",
    "hourlyCost": "$34/hr",
    "programs": [
      "HCBS Waiver",
      "Medicaid State Plan Personal Care"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical agencies (ND HHS enrolls qualified service providers)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Ohio",
    "slug": "ohio",
    "hourlyCost": "$34/hr",
    "programs": [
      "PASSPORT Waiver",
      "MyCare Ohio",
      "Assisted Living Waiver"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 OH Dept. of Health (non-medical home care licensure began 2023)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Oklahoma",
    "slug": "oklahoma",
    "hourlyCost": "$33/hr",
    "programs": [
      "ADvantage Waiver",
      "State Plan Personal Care"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 OK State Dept. of Health (home care agency license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Oregon",
    "slug": "oregon",
    "hourlyCost": "$40/hr",
    "programs": [
      "K Plan (Community First Choice)",
      "APD Waiver",
      "Oregon Project Independence"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 OR Health Authority (in-home care agency license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Pennsylvania",
    "slug": "pennsylvania",
    "hourlyCost": "$34/hr",
    "programs": [
      "Community HealthChoices (CHC)",
      "Services My Way"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 PA Dept. of Health (home care agency/registry license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Rhode Island",
    "slug": "rhode-island",
    "hourlyCost": "$40/hr",
    "programs": [
      "Medicaid LTSS (1115 waiver)",
      "RIte @ Home"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 RI Dept. of Health",
    "trainingHours": 100,
    "trainingNote": "100 hrs"
  },
  {
    "name": "South Carolina",
    "slug": "south-carolina",
    "hourlyCost": "$31/hr",
    "programs": [
      "Community Choices Waiver"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 SC Dept. of Public Health (in-home care provider license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "South Dakota",
    "slug": "south-dakota",
    "hourlyCost": "$44/hr",
    "programs": [
      "HOPE Waiver",
      "State Plan Personal Care"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (SD Dept. of Health)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Tennessee",
    "slug": "tennessee",
    "hourlyCost": "$31/hr",
    "programs": [
      "TennCare CHOICES"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 TN Health Facilities Commission (personal support services agency)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Texas",
    "slug": "texas",
    "hourlyCost": "$30/hr",
    "programs": [
      "STAR+PLUS HCBS",
      "Community First Choice",
      "Primary Home Care"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 TX Health & Human Services Commission (HCSSA license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Utah",
    "slug": "utah",
    "hourlyCost": "$39/hr",
    "programs": [
      "Aging Waiver",
      "New Choices Waiver"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 UT DHHS (personal care agency license)",
    "trainingHours": 100,
    "trainingNote": "100 hrs"
  },
  {
    "name": "Vermont",
    "slug": "vermont",
    "hourlyCost": "$45/hr",
    "programs": [
      "Choices for Care",
      "Attendant Services Program"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (DAIL)",
    "trainingHours": 80,
    "trainingNote": "80 hrs"
  },
  {
    "name": "Virginia",
    "slug": "virginia",
    "hourlyCost": "$35/hr",
    "programs": [
      "Commonwealth Coordinated Care Plus (CCC Plus) Waiver"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 VA Dept. of Health (home care organization license)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum; 40-hr PCA curriculum for Medicaid personal care)"
  },
  {
    "name": "Washington",
    "slug": "washington",
    "hourlyCost": "$45/hr",
    "programs": [
      "COPES Waiver",
      "Community First Choice",
      "Medicaid Personal Care",
      "Tailored Supports for Older Adults"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 WA Dept. of Health (in-home services agency license)",
    "trainingHours": 85,
    "trainingNote": "85 hrs (75-hr certified Home Care Aide requirement)"
  },
  {
    "name": "West Virginia",
    "slug": "west-virginia",
    "hourlyCost": "$30/hr",
    "programs": [
      "Aged & Disabled Waiver (ADW)",
      "Medicaid Personal Care"
    ],
    "licensed": true,
    "licensure": "Yes \u2014 WV Office of Health Facility Licensure & Certification (OHFLAC)",
    "trainingHours": 75,
    "trainingNote": "75 hrs (federal minimum)"
  },
  {
    "name": "Wisconsin",
    "slug": "wisconsin",
    "hourlyCost": "$36/hr",
    "programs": [
      "Family Care & Partnership",
      "IRIS (self-directed)",
      "Medicaid Personal Care"
    ],
    "licensed": false,
    "licensure": "No license for private-pay non-medical agencies (DHS certifies Medicaid personal care agencies)",
    "trainingHours": 120,
    "trainingNote": "120 hrs"
  },
  {
    "name": "Wyoming",
    "slug": "wyoming",
    "hourlyCost": "$46/hr",
    "programs": [
      "Community Choices Waiver (CCW)"
    ],
    "licensed": false,
    "licensure": "No state license for non-medical home care (WY Dept. of Health)",
    "trainingHours": 91,
    "trainingNote": "91 hrs"
  }
];

export function getState(slug: string): StateInfo | undefined {
  return states.find((s) => s.slug === slug);
}
