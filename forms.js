/* Poultry Management — form views (visual only, no persistence). */
(function () {
  'use strict';

  var CHEV_DOWN = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><polyline points="3,6 8,11 13,6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV_RIGHT = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><polyline points="6,3 11,8 6,13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SEARCH_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="10.4" y1="10.4" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  var ACTION_BUTTONS = ['New', 'Edit', 'Delete', 'Save', 'Refresh', 'Export to Excel'];

  /* Sample reference data (PAPCO context). */
  var FARMS = ['Al-Wafra Farm', 'Al-Wafra Farm', 'Al-Wafra Farm'];
  var HOUSES = ['House 1', 'House 2', 'House 3'];
  var BREEDS = ['Hy-Line Brown', 'Lohmann', 'ISA Brown'];
  var SUPPLIERS = ['Hy-Line Middle East', 'Lohmann Tierzucht', 'ISA Hendrix Genetics', 'Al-Watania Hatchery'];
  var CUSTOMERS = ['Sultan Center', 'Lulu Hypermarket', 'Carrefour Kuwait', 'City Centre', 'Co-op Society'];
  var FEED_TYPES = ['Starter feed', 'Grower feed', 'Layer mash', 'Finisher feed'];
  var MEDS = ['Newcastle vaccine', 'Coccidiostat', 'Vitamin AD3E', 'Amoxicillin 20%', 'Tylosin tartrate'];

  var FORMS = {
    /* ---------- Setup ---------- */
    'poultry-parameters': {
      pattern: 'B',
      title: 'Poultry parameters',
      header: { status: 'Active', lastModified: '06/05/2026 09:14' },
      fastTabs: [
        { name: 'General', summary: 'Default farm: Al-Wafra Farm', fields: [
          { label: 'Default farm', type: 'select', options: ['Al-Wafra Farm'], value: 'Al-Wafra Farm' },
          { label: 'Default cycle length (days)', type: 'input', value: '42' },
          { label: 'Default flock prefix', type: 'input', value: 'FLK-' },
          { label: 'Mortality threshold (%)', type: 'input', value: '3.5' },
          { label: 'Feed unit of measure', type: 'select', options: ['Kilogram', 'Tonne', 'Bag'], value: 'Kilogram' },
          { label: 'Egg unit of measure', type: 'select', options: ['Dozen', 'Tray', 'Carton'], value: 'Tray' }
        ]},
        { name: 'Numbering sequences', summary: 'Auto-numbering enabled', fields: [
          { label: 'Flock number sequence', type: 'input', value: 'POL-FLK-#####' },
          { label: 'Placement number sequence', type: 'input', value: 'POL-PLC-#####' },
          { label: 'Mortality entry sequence', type: 'input', value: 'POL-MORT-YYYY-#####' },
          { label: 'Dispatch number sequence', type: 'input', value: 'POL-DSP-#####' },
          { label: 'Manual override allowed', type: 'select', options: ['Yes', 'No'], value: 'No' }
        ]},
        { name: 'Posting', summary: 'Posting profile: PAPCO-POL', fields: [
          { label: 'Posting profile', type: 'input', value: 'PAPCO-POL' },
          { label: 'Feed consumption account', type: 'input', value: '5301-001' },
          { label: 'Mortality loss account', type: 'input', value: '5302-001' },
          { label: 'Egg production account', type: 'input', value: '4101-001' },
          { label: 'Cost centre dimension', type: 'input', value: 'Farm' }
        ]},
        { name: 'Defaults', summary: 'Defaults configured', fields: [
          { label: 'Default house', type: 'select', options: HOUSES, value: 'House 1' },
          { label: 'Default breed', type: 'select', options: BREEDS, value: 'Hy-Line Brown' },
          { label: 'Default supplier', type: 'select', options: SUPPLIERS, value: 'Hy-Line Middle East' },
          { label: 'Default feed item', type: 'select', options: FEED_TYPES, value: 'Layer mash' },
          { label: 'Default cost bucket', type: 'input', value: 'CB-FEED' }
        ]}
      ]
    },
    'poultry-types': {
      pattern: 'A', title: 'Poultry types',
      columns: ['Type ID', 'Description', 'Category', 'Egg layer', 'Active'],
      rows: [
        ['LAYER', 'Layer hen', 'Layer', 'Yes', 'Yes'],
        ['BROIL', 'Broiler chicken', 'Meat', 'No', 'Yes'],
        ['BREED', 'Breeder', 'Breeder', 'Yes', 'Yes'],
        ['PULLT', 'Pullet (rearing)', 'Layer', 'No', 'Yes'],
        ['ROOST', 'Cockerel / rooster', 'Breeder', 'No', 'Yes'],
        ['CULL',  'Cull bird',       'Meat',    'No', 'No']
      ]
    },
    'poultry-breeds': {
      pattern: 'A', title: 'Poultry breeds',
      columns: ['Breed ID', 'Breed name', 'Type', 'Origin', 'Standard weight (g)', 'Active'],
      rows: [
        ['HY-BR', 'Hy-Line Brown',   'Layer',   'United States',  '1900', 'Yes'],
        ['LM-LSL','Lohmann LSL',     'Layer',   'Germany',        '1750', 'Yes'],
        ['LM-BR', 'Lohmann Brown',   'Layer',   'Germany',        '2000', 'Yes'],
        ['ISA-BR','ISA Brown',       'Layer',   'France',         '1950', 'Yes'],
        ['ROSS308','Ross 308',       'Broiler', 'United Kingdom', '2600', 'Yes'],
        ['COBB500','Cobb 500',       'Broiler', 'United States',  '2700', 'Yes'],
        ['HUB-CL','Hubbard Classic', 'Broiler', 'France',         '2500', 'No']
      ]
    },
    'vaccination-programs': {
      pattern: 'A', title: 'Vaccination programmes',
      columns: ['Programme ID', 'Name', 'Breed', 'Vaccines', 'Duration (days)', 'Active'],
      rows: [
        ['VP-001', 'Layer standard programme',   'Hy-Line Brown', '8', '120', 'Yes'],
        ['VP-002', 'Layer extended programme',   'Lohmann',       '10', '140', 'Yes'],
        ['VP-003', 'Broiler basic programme',    'Ross 308',      '5', '35',  'Yes'],
        ['VP-004', 'Broiler intensive programme','Cobb 500',      '7', '40',  'Yes'],
        ['VP-005', 'Breeder programme',          'ISA Brown',     '12','180', 'Yes'],
        ['VP-006', 'Pullet rearing programme',   'Hy-Line Brown', '6', '90',  'No']
      ]
    },
    'cost-buckets': {
      pattern: 'A', title: 'Cost buckets',
      columns: ['Bucket ID', 'Description', 'GL account', 'Allocation method', 'Active'],
      rows: [
        ['CB-FEED',  'Feed costs',        '5301-001', 'Per bird-day',  'Yes'],
        ['CB-MED',   'Medicine costs',    '5303-001', 'Per dose',      'Yes'],
        ['CB-LAB',   'Labour costs',      '5401-001', 'Per house',     'Yes'],
        ['CB-UTIL',  'Utilities',         '5402-001', 'Per house',     'Yes'],
        ['CB-CHICK', 'Day-old chicks',    '5201-001', 'Per placement', 'Yes'],
        ['CB-VAC',   'Vaccination costs', '5304-001', 'Per dose',      'Yes'],
        ['CB-OVH',   'Overhead',          '5501-001', 'Per cycle',     'Yes']
      ]
    },

    /* ---------- Masters ---------- */
    'poultry-farms': {
      pattern: 'A', title: 'Poultry farms',
      columns: ['Farm ID', 'Name', 'Location', 'Houses', 'Manager', 'Status'],
      rows: [
        ['FARM-001', 'Al-Wafra Farm',    'Al-Wafra, Kuwait',   '3', 'Yousef Al-Sabah',  'Operational'],
        ['FARM-002', 'Al-Abdali Farm',   'Al-Abdali, Kuwait',  '2', 'Mariam Al-Anezi',  'Operational'],
        ['FARM-003', 'Sulaibiya Farm',   'Sulaibiya, Kuwait',  '4', 'Hassan Al-Mutairi','Operational'],
        ['FARM-004', 'Al-Jahra Farm',    'Al-Jahra, Kuwait',   '2', 'Khaled Al-Otaibi', 'Maintenance'],
        ['FARM-005', 'Mina Abdullah',    'Mina Abdullah',      '1', 'Salem Al-Rashidi', 'Operational'],
        ['FARM-006', 'Al-Khiran Farm',   'Al-Khiran, Kuwait',  '2', 'Faisal Al-Ajmi',   'Planned']
      ]
    },
    'poultry-houses': {
      pattern: 'A', title: 'Poultry houses',
      columns: ['House ID', 'Farm', 'Capacity', 'Type', 'Climate control', 'Status'],
      rows: [
        ['HSE-001', 'Al-Wafra Farm', '12,000', 'Layer',   'Tunnel ventilation', 'Operational'],
        ['HSE-002', 'Al-Wafra Farm', '12,000', 'Layer',   'Tunnel ventilation', 'Operational'],
        ['HSE-003', 'Al-Wafra Farm', '10,000', 'Pullet',  'Cross ventilation',  'Operational'],
        ['HSE-004', 'Al-Abdali Farm','15,000', 'Broiler', 'Tunnel ventilation', 'Operational'],
        ['HSE-005', 'Al-Abdali Farm','15,000', 'Broiler', 'Tunnel ventilation', 'Cleaning'],
        ['HSE-006', 'Sulaibiya Farm','20,000', 'Broiler', 'Tunnel ventilation', 'Operational'],
        ['HSE-007', 'Sulaibiya Farm','20,000', 'Broiler', 'Tunnel ventilation', 'Operational'],
        ['HSE-008', 'Al-Jahra Farm', '8,000',  'Breeder', 'Cross ventilation',  'Maintenance']
      ]
    },
    'poultry-sections': {
      pattern: 'A', title: 'Poultry sections',
      columns: ['Section ID', 'House', 'Capacity', 'Cage rows', 'Status'],
      rows: [
        ['SEC-001', 'House 1', '4,000', '8',  'Occupied'],
        ['SEC-002', 'House 1', '4,000', '8',  'Occupied'],
        ['SEC-003', 'House 1', '4,000', '8',  'Empty'],
        ['SEC-004', 'House 2', '6,000', '12', 'Occupied'],
        ['SEC-005', 'House 2', '6,000', '12', 'Occupied'],
        ['SEC-006', 'House 3', '5,000', '10', 'Cleaning'],
        ['SEC-007', 'House 3', '5,000', '10', 'Empty']
      ]
    },
    'poultry-suppliers': {
      pattern: 'A', title: 'Poultry suppliers',
      columns: ['Supplier ID', 'Name', 'Category', 'Contact', 'City', 'Status'],
      rows: [
        ['SUP-001', 'Hy-Line Middle East',     'Day-old chicks', 'Ahmed Khalifa',   'Dubai',    'Active'],
        ['SUP-002', 'Lohmann Tierzucht',       'Day-old chicks', 'Klaus Bauer',     'Cuxhaven', 'Active'],
        ['SUP-003', 'ISA Hendrix Genetics',    'Day-old chicks', 'Pierre Dubois',   'Boxmeer',  'Active'],
        ['SUP-004', 'Al-Watania Hatchery',     'Day-old chicks', 'Mohammed Al-Saud','Riyadh',   'Active'],
        ['SUP-005', 'Cargill Animal Nutrition','Feed',           'Sara Johansson',  'Dammam',   'Active'],
        ['SUP-006', 'Arabian Agricultural',    'Feed',           'Omar Bin Laden',  'Jeddah',   'Active'],
        ['SUP-007', 'Hipra Veterinary',        'Medicines',      'Maria Garcia',    'Amer',     'Active'],
        ['SUP-008', 'Ceva Animal Health',      'Medicines',      'Jean-Luc Martin', 'Libourne', 'Active']
      ]
    },
    'poultry-customers': {
      pattern: 'A', title: 'Poultry customers',
      columns: ['Customer ID', 'Name', 'Contact', 'City', 'Payment terms', 'Status'],
      rows: [
        ['CUS-001', 'Sultan Center',     'Tareq Al-Roumi',     'Kuwait City', 'Net 30', 'Active'],
        ['CUS-002', 'Lulu Hypermarket',  'Rajan Pillai',       'Kuwait City', 'Net 30', 'Active'],
        ['CUS-003', 'Carrefour Kuwait',  'Pierre Lavalle',     'Kuwait City', 'Net 45', 'Active'],
        ['CUS-004', 'City Centre',       'Mahmoud Al-Sayed',   'Hawally',     'Net 30', 'Active'],
        ['CUS-005', 'Co-op Society',     'Abdulaziz Al-Saleh', 'Salmiya',     'Net 15', 'Active'],
        ['CUS-006', 'Al-Marai Catering', 'Salim Al-Khaldi',    'Shuwaikh',    'Net 30', 'Active'],
        ['CUS-007', 'Shamiya Restaurant','Rabia Al-Hashemi',   'Shamiya',     'Cash',   'Active'],
        ['CUS-008', 'Mubarakiya Wholesale','Khaled Al-Sayed',  'Kuwait City', 'Net 60', 'On hold']
      ]
    },
    'feed-items': {
      pattern: 'A', title: 'Feed items',
      columns: ['Item ID', 'Description', 'UoM', 'Type', 'Crude protein (%)', 'Active'],
      rows: [
        ['FD-001', 'Starter feed',  'Kilogram', 'Mash',    '21', 'Yes'],
        ['FD-002', 'Grower feed',   'Kilogram', 'Crumble', '19', 'Yes'],
        ['FD-003', 'Layer mash',    'Kilogram', 'Mash',    '17', 'Yes'],
        ['FD-004', 'Finisher feed', 'Kilogram', 'Pellet',  '20', 'Yes'],
        ['FD-005', 'Breeder feed',  'Kilogram', 'Mash',    '16', 'Yes'],
        ['FD-006', 'Pre-starter',   'Kilogram', 'Crumble', '23', 'Yes'],
        ['FD-007', 'Withdrawal feed','Kilogram','Pellet',  '18', 'No']
      ]
    },
    'medicines': {
      pattern: 'A', title: 'Medicines',
      columns: ['Medicine ID', 'Name', 'Form', 'Withdrawal (days)', 'Storage', 'Active'],
      rows: [
        ['MED-001', 'Newcastle vaccine',   'Vial',      '0',  'Refrigerated', 'Yes'],
        ['MED-002', 'Coccidiostat',        'Powder',    '7',  'Dry',          'Yes'],
        ['MED-003', 'Vitamin AD3E',        'Liquid',    '0',  'Dry',          'Yes'],
        ['MED-004', 'Amoxicillin 20%',     'Powder',    '5',  'Dry',          'Yes'],
        ['MED-005', 'Tylosin tartrate',    'Powder',    '7',  'Dry',          'Yes'],
        ['MED-006', 'Gumboro vaccine',     'Vial',      '0',  'Refrigerated', 'Yes'],
        ['MED-007', 'Infectious bronchitis vaccine', 'Vial', '0', 'Refrigerated', 'Yes'],
        ['MED-008', 'Enrofloxacin 10%',    'Liquid',    '10', 'Dry',          'No']
      ]
    },
    'flocks': {
      pattern: 'A', title: 'Flocks',
      columns: ['Flock ID', 'Breed', 'Placement date', 'House', 'Birds', 'Status'],
      rows: [
        ['FLK-0001', 'Hy-Line Brown', '02/04/2026', 'House 1', '11,950', 'Active'],
        ['FLK-0002', 'Hy-Line Brown', '02/04/2026', 'House 2', '11,940', 'Active'],
        ['FLK-0003', 'Lohmann',       '15/04/2026', 'House 3', '9,985',  'Active'],
        ['FLK-0004', 'Ross 308',      '20/04/2026', 'House 4', '14,920', 'Active'],
        ['FLK-0005', 'Cobb 500',      '01/05/2026', 'House 6', '19,880', 'Active'],
        ['FLK-0006', 'ISA Brown',     '05/05/2026', 'House 8', '7,940',  'Active'],
        ['FLK-0007', 'Hy-Line Brown', '20/03/2026', 'House 1', '0',      'Closed']
      ]
    },

    /* ---------- Operations ---------- */
    'cycles': {
      pattern: 'A', title: 'Cycles',
      columns: ['Cycle ID', 'Farm', 'Start date', 'End date', 'Type', 'Status'],
      rows: [
        ['CYC-2026-001', 'Al-Wafra Farm',  '02/04/2026', '13/05/2026', 'Layer',   'Active'],
        ['CYC-2026-002', 'Al-Wafra Farm',  '15/04/2026', '26/05/2026', 'Layer',   'Active'],
        ['CYC-2026-003', 'Al-Abdali Farm', '20/04/2026', '01/06/2026', 'Broiler', 'Active'],
        ['CYC-2026-004', 'Sulaibiya Farm', '01/05/2026', '12/06/2026', 'Broiler', 'Active'],
        ['CYC-2026-005', 'Sulaibiya Farm', '05/05/2026', '16/06/2026', 'Broiler', 'Active'],
        ['CYC-2026-006', 'Mina Abdullah',  '10/05/2026', '21/06/2026', 'Broiler', 'Planned'],
        ['CYC-2026-007', 'Al-Wafra Farm',  '20/03/2026', '01/05/2026', 'Layer',   'Closed']
      ]
    },
    'placements': {
      pattern: 'A', title: 'Placements',
      columns: ['Placement ID', 'Date', 'Supplier', 'Flock', 'Birds', 'House', 'Status'],
      rows: [
        ['PLC-0001', '02/04/2026', 'Hy-Line Middle East',  'FLK-0001', '12,000', 'House 1', 'Posted'],
        ['PLC-0002', '02/04/2026', 'Hy-Line Middle East',  'FLK-0002', '12,000', 'House 2', 'Posted'],
        ['PLC-0003', '15/04/2026', 'Lohmann Tierzucht',    'FLK-0003', '10,000', 'House 3', 'Posted'],
        ['PLC-0004', '20/04/2026', 'Al-Watania Hatchery',  'FLK-0004', '15,000', 'House 4', 'Posted'],
        ['PLC-0005', '01/05/2026', 'Al-Watania Hatchery',  'FLK-0005', '20,000', 'House 6', 'Posted'],
        ['PLC-0006', '05/05/2026', 'ISA Hendrix Genetics', 'FLK-0006', '8,000',  'House 8', 'Draft'],
        ['PLC-0007', '08/05/2026', 'Hy-Line Middle East',  'FLK-0008', '12,000', 'House 1', 'Draft']
      ]
    },
    'placement-lines': {
      pattern: 'A', title: 'Placement lines',
      columns: ['Line ID', 'Placement', 'Item', 'Quantity', 'UoM', 'Cost bucket'],
      rows: [
        ['PLN-0001', 'PLC-0001', 'Day-old chicks Hy-Line Brown', '12,000', 'Each',     'CB-CHICK'],
        ['PLN-0002', 'PLC-0001', 'Vaccination Marek',            '12,000', 'Dose',     'CB-VAC'],
        ['PLN-0003', 'PLC-0002', 'Day-old chicks Hy-Line Brown', '12,000', 'Each',     'CB-CHICK'],
        ['PLN-0004', 'PLC-0003', 'Day-old chicks Lohmann LSL',   '10,000', 'Each',     'CB-CHICK'],
        ['PLN-0005', 'PLC-0004', 'Day-old chicks Ross 308',      '15,000', 'Each',     'CB-CHICK'],
        ['PLN-0006', 'PLC-0004', 'Pre-starter feed',             '500',    'Kilogram', 'CB-FEED'],
        ['PLN-0007', 'PLC-0005', 'Day-old chicks Cobb 500',      '20,000', 'Each',     'CB-CHICK'],
        ['PLN-0008', 'PLC-0005', 'Pre-starter feed',             '650',    'Kilogram', 'CB-FEED']
      ]
    },
    'transfers': {
      pattern: 'A', title: 'Transfers',
      columns: ['Transfer ID', 'Date', 'From house', 'To house', 'Birds', 'Reason', 'Status'],
      rows: [
        ['TRN-0001', '12/04/2026', 'House 1', 'House 3', '500',   'Density balancing', 'Posted'],
        ['TRN-0002', '18/04/2026', 'House 2', 'House 3', '450',   'Density balancing', 'Posted'],
        ['TRN-0003', '25/04/2026', 'House 4', 'House 6', '1,200', 'Cycle progression', 'Posted'],
        ['TRN-0004', '03/05/2026', 'House 6', 'House 7', '2,000', 'Density balancing', 'Posted'],
        ['TRN-0005', '07/05/2026', 'House 1', 'House 3', '300',   'Culling preparation','Draft'],
        ['TRN-0006', '09/05/2026', 'House 8', 'House 4', '150',   'Breeder selection', 'Draft']
      ]
    },
    'transfer-lines': {
      pattern: 'A', title: 'Transfer lines',
      columns: ['Line ID', 'Transfer', 'Flock', 'Quantity', 'UoM', 'Notes'],
      rows: [
        ['TRL-0001', 'TRN-0001', 'FLK-0001', '500',   'Each', 'Healthy birds'],
        ['TRL-0002', 'TRN-0002', 'FLK-0002', '450',   'Each', 'Healthy birds'],
        ['TRL-0003', 'TRN-0003', 'FLK-0004', '1,200', 'Each', 'Cycle stage 2'],
        ['TRL-0004', 'TRN-0004', 'FLK-0005', '2,000', 'Each', 'Density adjustment'],
        ['TRL-0005', 'TRN-0005', 'FLK-0001', '300',   'Each', 'For culling'],
        ['TRL-0006', 'TRN-0006', 'FLK-0006', '150',   'Each', 'Breeder selection']
      ]
    },
    'mortality-entries': {
      pattern: 'A', title: 'Mortality entries',
      columns: ['Entry ID', 'Date', 'House', 'Flock', 'Cause', 'Count'],
      rows: [
        ['MORT-2026-0001', '03/04/2026', 'House 1', 'FLK-0001', 'Stress',         '12'],
        ['MORT-2026-0002', '04/04/2026', 'House 1', 'FLK-0001', 'Stress',         '8'],
        ['MORT-2026-0003', '05/04/2026', 'House 2', 'FLK-0002', 'Disease',        '15'],
        ['MORT-2026-0004', '12/04/2026', 'House 3', 'FLK-0003', 'Natural',        '5'],
        ['MORT-2026-0005', '21/04/2026', 'House 4', 'FLK-0004', 'Disease',        '22'],
        ['MORT-2026-0006', '02/05/2026', 'House 6', 'FLK-0005', 'Natural',        '18'],
        ['MORT-2026-0007', '06/05/2026', 'House 8', 'FLK-0006', 'Stress',         '4'],
        ['MORT-2026-0008', '08/05/2026', 'House 1', 'FLK-0001', 'Cull (selected)','30']
      ]
    },

    /* ---------- Production Entries (Detail form, fast tabs) ---------- */
    'production-entries': {
      pattern: 'B',
      title: 'Production entries',
      header: { status: 'Draft', lastModified: '09/05/2026 18:42' },
      fastTabs: [
        { name: 'Header', summary: 'PRD-2026-0142 — 09/05/2026', fields: [
          { label: 'Entry ID', type: 'input', value: 'PRD-2026-0142' },
          { label: 'Entry date', type: 'input', value: '09/05/2026' },
          { label: 'Cycle', type: 'select', options: ['CYC-2026-001', 'CYC-2026-002', 'CYC-2026-003'], value: 'CYC-2026-001' },
          { label: 'House', type: 'select', options: HOUSES, value: 'House 1' },
          { label: 'Flock', type: 'select', options: ['FLK-0001', 'FLK-0002', 'FLK-0003'], value: 'FLK-0001' },
          { label: 'Recorded by', type: 'input', value: 'Yousef Al-Sabah' }
        ]},
        { name: 'Production', summary: 'Eggs collected: 11,420', fields: [
          { label: 'Eggs collected', type: 'input', value: '11,420' },
          { label: 'Cracked / soiled', type: 'input', value: '85' },
          { label: 'Trays packed', type: 'input', value: '380' },
          { label: 'Average egg weight (g)', type: 'input', value: '62.4' },
          { label: 'Lay rate (%)', type: 'input', value: '95.6' }
        ]},
        { name: 'Feed consumption', summary: 'Feed used: 1,432 kg', fields: [
          { label: 'Feed item', type: 'select', options: FEED_TYPES, value: 'Layer mash' },
          { label: 'Quantity (kg)', type: 'input', value: '1,432' },
          { label: 'Feed conversion ratio', type: 'input', value: '2.05' },
          { label: 'Water consumption (litres)', type: 'input', value: '2,860' },
          { label: 'Cost bucket', type: 'select', options: ['CB-FEED'], value: 'CB-FEED' }
        ]},
        { name: 'Mortality', summary: '0 entries today', fields: [
          { label: 'Mortality count', type: 'input', value: '0' },
          { label: 'Cull count', type: 'input', value: '0' },
          { label: 'Primary cause', type: 'select', options: ['None', 'Natural', 'Stress', 'Disease', 'Cull (selected)'], value: 'None' },
          { label: 'Notes', type: 'input', value: 'Routine collection day' }
        ]}
      ]
    },

    /* ---------- Hatchery ---------- */
    'incubation-batches': {
      pattern: 'A', title: 'Incubation batches',
      columns: ['Batch ID', 'Set date', 'Eggs set', 'Breed', 'Expected hatch', 'Status'],
      rows: [
        ['INC-2026-001', '08/04/2026', '24,000', 'Hy-Line Brown', '29/04/2026', 'Hatched'],
        ['INC-2026-002', '15/04/2026', '24,000', 'Lohmann',       '06/05/2026', 'Hatched'],
        ['INC-2026-003', '22/04/2026', '30,000', 'Ross 308',      '13/05/2026', 'Incubating'],
        ['INC-2026-004', '29/04/2026', '30,000', 'Cobb 500',      '20/05/2026', 'Incubating'],
        ['INC-2026-005', '03/05/2026', '20,000', 'ISA Brown',     '24/05/2026', 'Incubating'],
        ['INC-2026-006', '06/05/2026', '24,000', 'Hy-Line Brown', '27/05/2026', 'Setting']
      ]
    },
    'hatch-results': {
      pattern: 'A', title: 'Hatch results',
      columns: ['Result ID', 'Batch', 'Hatch date', 'Chicks hatched', 'Hatchability (%)', 'Cull chicks'],
      rows: [
        ['HRS-2026-001', 'INC-2026-001', '29/04/2026', '21,840', '91.0', '180'],
        ['HRS-2026-002', 'INC-2026-002', '06/05/2026', '21,360', '89.0', '210'],
        ['HRS-2026-003', 'INC-2025-098', '15/03/2026', '22,200', '92.5', '160'],
        ['HRS-2026-004', 'INC-2025-099', '22/03/2026', '21,720', '90.5', '195'],
        ['HRS-2026-005', 'INC-2026-000', '01/04/2026', '22,560', '94.0', '140'],
        ['HRS-2026-006', 'INC-2025-097', '08/03/2026', '20,880', '87.0', '240']
      ]
    },

    /* ---------- Dispatch and Analytics ---------- */
    'dispatches': {
      pattern: 'A', title: 'Dispatches',
      columns: ['Dispatch ID', 'Date', 'Customer', 'Vehicle', 'Total trays', 'Status'],
      rows: [
        ['DSP-0001', '02/05/2026', 'Sultan Center',     'KW-1234', '420',   'Posted'],
        ['DSP-0002', '03/05/2026', 'Lulu Hypermarket',  'KW-1245', '380',   'Posted'],
        ['DSP-0003', '05/05/2026', 'Carrefour Kuwait',  'KW-1256', '510',   'Posted'],
        ['DSP-0004', '06/05/2026', 'City Centre',       'KW-1234', '300',   'Posted'],
        ['DSP-0005', '07/05/2026', 'Co-op Society',     'KW-1267', '240',   'Posted'],
        ['DSP-0006', '08/05/2026', 'Sultan Center',     'KW-1245', '440',   'Picked'],
        ['DSP-0007', '09/05/2026', 'Lulu Hypermarket',  'KW-1256', '395',   'Picked'],
        ['DSP-0008', '10/05/2026', 'Al-Marai Catering', 'KW-1234', '180',   'Draft']
      ]
    },
    'dispatch-lines': {
      pattern: 'A', title: 'Dispatch lines',
      columns: ['Line ID', 'Dispatch', 'Item', 'Quantity', 'UoM', 'Notes'],
      rows: [
        ['DSL-0001', 'DSP-0001', 'Brown eggs grade A', '420',   'Tray', 'Standard order'],
        ['DSL-0002', 'DSP-0002', 'Brown eggs grade A', '380',   'Tray', 'Standard order'],
        ['DSL-0003', 'DSP-0003', 'Brown eggs grade A', '300',   'Tray', 'Promotional'],
        ['DSL-0004', 'DSP-0003', 'Brown eggs grade B', '210',   'Tray', 'Promotional'],
        ['DSL-0005', 'DSP-0004', 'Brown eggs grade A', '300',   'Tray', 'Standard order'],
        ['DSL-0006', 'DSP-0005', 'Brown eggs grade A', '240',   'Tray', 'Standard order'],
        ['DSL-0007', 'DSP-0006', 'Brown eggs grade A', '440',   'Tray', 'Standard order'],
        ['DSL-0008', 'DSP-0007', 'Brown eggs grade A', '395',   'Tray', 'Standard order']
      ]
    },
    'cost-transactions': {
      pattern: 'A', title: 'Cost transactions',
      columns: ['Transaction ID', 'Date', 'Cycle', 'Bucket', 'Amount', 'Status'],
      rows: [
        ['CT-2026-0001', '03/04/2026', 'CYC-2026-001', 'CB-CHICK', '24,000.00', 'Posted'],
        ['CT-2026-0002', '04/04/2026', 'CYC-2026-001', 'CB-FEED',  '1,250.00',  'Posted'],
        ['CT-2026-0003', '10/04/2026', 'CYC-2026-001', 'CB-MED',   '420.00',    'Posted'],
        ['CT-2026-0004', '15/04/2026', 'CYC-2026-002', 'CB-CHICK', '20,000.00', 'Posted'],
        ['CT-2026-0005', '20/04/2026', 'CYC-2026-003', 'CB-FEED',  '3,200.00',  'Posted'],
        ['CT-2026-0006', '01/05/2026', 'CYC-2026-004', 'CB-CHICK', '32,000.00', 'Posted'],
        ['CT-2026-0007', '05/05/2026', 'CYC-2026-001', 'CB-LAB',   '1,800.00',  'Posted'],
        ['CT-2026-0008', '08/05/2026', 'CYC-2026-002', 'CB-UTIL',  '650.00',    'Draft']
      ]
    },
    'kpi-snapshots': {
      pattern: 'A', title: 'KPI snapshots',
      columns: ['KPI name', 'Period', 'Value', 'Benchmark', 'Variance'],
      rows: [
        ['Lay rate (%)',                 'April 2026', '94.8',  '95.0',  '-0.2'],
        ['Mortality (%)',                'April 2026', '2.1',   '2.5',   '-0.4'],
        ['Feed conversion ratio',        'April 2026', '2.04',  '2.10',  '-0.06'],
        ['Hatchability (%)',             'April 2026', '90.5',  '90.0',  '+0.5'],
        ['Egg weight average (g)',       'April 2026', '62.3',  '62.0',  '+0.3'],
        ['Cost per dozen (KWD)',         'April 2026', '0.420', '0.450', '-0.030'],
        ['Lay rate (%)',                 'May 2026',   '95.6',  '95.0',  '+0.6'],
        ['Mortality (%)',                'May 2026',   '1.8',   '2.5',   '-0.7'],
        ['Feed conversion ratio',        'May 2026',   '2.05',  '2.10',  '-0.05']
      ]
    }
  };

  /* ---------- Renderer ---------- */
  var contentEl = null;
  var homeHTML = null;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildBreadcrumb(title) {
    return (
      '<div class="breadcrumb">' +
        '<a class="breadcrumb-home" data-breadcrumb-home href="#">Poultry Management</a>' +
        '<span class="breadcrumb-sep">&gt;</span>' +
        '<span class="breadcrumb-current">' + escapeHtml(title) + '</span>' +
      '</div>'
    );
  }

  function buildActionPane() {
    var html = '<div class="action-pane">';
    for (var i = 0; i < ACTION_BUTTONS.length; i++) {
      var label = ACTION_BUTTONS[i];
      html += '<button type="button" class="action-btn" data-inert>' +
              '<span class="tile">+</span>' + escapeHtml(label) + '</button>';
    }
    html += '</div>';
    return html;
  }

  function buildFilterStrip() {
    return (
      '<div class="filter-strip">' +
        '<span class="filter-label">Filter</span>' +
        '<div class="filter-input">' + SEARCH_SVG +
          '<input type="text" placeholder="Filter this list" data-inert>' +
        '</div>' +
      '</div>'
    );
  }

  function buildListGrid(form) {
    var html = '<table class="list-grid"><thead><tr>';
    html += '<th class="col-check"><input type="checkbox" data-inert></th>';
    for (var i = 0; i < form.columns.length; i++) {
      html += '<th>' + escapeHtml(form.columns[i]) + '</th>';
    }
    html += '</tr></thead><tbody>';
    for (var r = 0; r < form.rows.length; r++) {
      var row = form.rows[r];
      html += '<tr>';
      html += '<td class="col-check"><input type="checkbox" data-inert></td>';
      for (var c = 0; c < row.length; c++) {
        html += '<td>' + escapeHtml(row[c]) + '</td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  function buildFormHeader(form) {
    var h = form.header || {};
    return (
      '<div class="form-header">' +
        '<span class="status-badge">' + escapeHtml(h.status || 'Active') + '</span>' +
        '<span class="field-pair">' +
          '<span class="field-label">Last modified:</span>' +
          '<span>' + escapeHtml(h.lastModified || '') + '</span>' +
        '</span>' +
      '</div>'
    );
  }

  function buildField(field) {
    var html = '<div class="field-row">';
    html += '<label>' + escapeHtml(field.label) + '</label>';
    if (field.type === 'select') {
      html += '<select data-inert>';
      var opts = field.options || [];
      for (var i = 0; i < opts.length; i++) {
        var sel = (opts[i] === field.value) ? ' selected' : '';
        html += '<option' + sel + '>' + escapeHtml(opts[i]) + '</option>';
      }
      html += '</select>';
    } else {
      html += '<input type="text" value="' + escapeHtml(field.value || '') + '" data-inert>';
    }
    html += '</div>';
    return html;
  }

  function buildFastTabs(form) {
    var html = '';
    var tabs = form.fastTabs || [];
    for (var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      var open = (i === 0);
      html += '<div class="fast-tab" data-fast-tab>';
      html += '<button type="button" class="fast-tab-header" data-fast-tab-toggle>';
      html += '<span class="chev">' + (open ? CHEV_DOWN : CHEV_RIGHT) + '</span>';
      html += '<span class="fast-tab-name">' + escapeHtml(tab.name) + '</span>';
      html += '<span class="fast-tab-summary">' + escapeHtml(tab.summary || '') + '</span>';
      html += '</button>';
      html += '<div class="fast-tab-body"' + (open ? '' : ' hidden') + '>';
      for (var f = 0; f < tab.fields.length; f++) {
        html += buildField(tab.fields[f]);
      }
      html += '</div>';
      html += '</div>';
    }
    return html;
  }

  function renderForm(key) {
    var form = FORMS[key];
    if (!form || !contentEl) return;
    if (homeHTML === null) {
      homeHTML = contentEl.innerHTML;
    }
    var html = '<div class="form-view">';
    html += buildBreadcrumb(form.title);
    html += '<div class="form-title">' + escapeHtml(form.title) + '</div>';
    html += buildActionPane();
    if (form.pattern === 'A') {
      html += buildFilterStrip();
      html += buildListGrid(form);
    } else {
      html += buildFormHeader(form);
      html += buildFastTabs(form);
    }
    html += '</div>';
    contentEl.innerHTML = html;
    contentEl.scrollTop = 0;
  }

  function renderHome() {
    if (!contentEl || homeHTML === null) return;
    contentEl.innerHTML = homeHTML;
  }

  /* ---------- Event delegation ---------- */
  document.addEventListener('click', function (e) {
    var formLink = e.target.closest('a[data-form-key]');
    if (formLink) {
      e.preventDefault();
      e.stopPropagation();
      renderForm(formLink.getAttribute('data-form-key'));
      return;
    }
    var home = e.target.closest('[data-breadcrumb-home]');
    if (home) {
      e.preventDefault();
      e.stopPropagation();
      renderHome();
      return;
    }
    var tabBtn = e.target.closest('[data-fast-tab-toggle]');
    if (tabBtn) {
      e.preventDefault();
      var tab = tabBtn.closest('[data-fast-tab]');
      if (!tab) return;
      var body = tab.querySelector('.fast-tab-body');
      var chev = tab.querySelector('.chev');
      var open = !body.hasAttribute('hidden');
      if (open) {
        body.setAttribute('hidden', '');
        chev.innerHTML = CHEV_RIGHT;
      } else {
        body.removeAttribute('hidden');
        chev.innerHTML = CHEV_DOWN;
      }
      return;
    }
    var row = e.target.closest('.list-grid tbody tr');
    if (row) {
      var tbody = row.parentNode;
      var siblings = tbody.querySelectorAll('tr.row-selected');
      for (var i = 0; i < siblings.length; i++) {
        if (siblings[i] !== row) siblings[i].classList.remove('row-selected');
      }
      row.classList.toggle('row-selected');
      return;
    }
  }, true);

  /* Capture the rendered home page after the existing IIFE has drawn chevrons. */
  function init() {
    contentEl = document.querySelector('main.content');
    if (contentEl && homeHTML === null) {
      homeHTML = contentEl.innerHTML;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
