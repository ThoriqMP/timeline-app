/**
 * TimelineFlow - Modern Executive Daily Planner & 1-Year Strategic Roadmap
 * Pure Vanilla JavaScript ES6+ (Zero Dependencies, Ultra Fast)
 */

(() => {
  'use strict';

  // Storage Keys
  const STORAGE_KEY = 'timelineflow_data_v3';
  const THEME_KEY = 'timelineflow_theme';
  
  const DAYS_OF_WEEK = [
    { key: 'senin', label: 'Senin', en: 'Monday' },
    { key: 'selasa', label: 'Selasa', en: 'Tuesday' },
    { key: 'rabu', label: 'Rabu', en: 'Wednesday' },
    { key: 'kamis', label: 'Kamis', en: 'Thursday' },
    { key: 'jumat', label: 'Jumat', en: 'Friday' },
    { key: 'sabtu', label: 'Sabtu', en: 'Saturday' },
    { key: 'minggu', label: 'Minggu', en: 'Sunday' }
  ];

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const QUARTERS_META = {
    Q1: { label: 'Q1 (Kuartal 1)', months: 'Januari - Maret', defaultTarget: 250000000, defaultStart: '2026-01-01', defaultEnd: '2026-03-31' },
    Q2: { label: 'Q2 (Kuartal 2)', months: 'April - Juni', defaultTarget: 350000000, defaultStart: '2026-04-01', defaultEnd: '2026-06-30' },
    Q3: { label: 'Q3 (Kuartal 3)', months: 'Juli - September', defaultTarget: 350000000, defaultStart: '2026-07-01', defaultEnd: '2026-09-30' },
    Q4: { label: 'Q4 (Kuartal 4)', months: 'Oktober - Desember', defaultTarget: 300000000, defaultStart: '2026-10-01', defaultEnd: '2026-12-31' }
  };

  // Time & Date Helpers
  function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return ((h || 0) * 60) + (m || 0);
  }

  function minutesToTime(totalMinutes) {
    const clamped = Math.max(0, Math.min(totalMinutes, 1439));
    const h = String(Math.floor(clamped / 60)).padStart(2, '0');
    const m = String(clamped % 60).padStart(2, '0');
    return `${h}:${m}`;
  }

  function getTodayFormatted(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatRupiah(num) {
    if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parts[0];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${day} ${shortMonths[month] || ''} ${year}`;
  }

  function calculateDaysDuration(startStr, finishStr) {
    if (!startStr || !finishStr) return '';
    const d1 = new Date(startStr);
    const d2 = new Date(finishStr);
    const diffTime = d2 - d1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? `${diffDays} hari` : '1 hari';
  }

  // Initial Seed Data
  const DEFAULT_DATA = {
    activePlanId: 'plan-1',
    currentYear: '2026',
    viewMode: 'daily',
    plans: [
      {
        id: 'plan-1',
        name: 'Work Routine (Utama)',
        days: {
          senin: [
            {
              id: 't1',
              startTime: '08:00',
              endTime: '08:35',
              title: 'Task 1 - Cek Whatsapp & Follow Up Lead',
              category: 'work',
              color: 'blue',
              completed: false,
              items: [
                { id: 'sub-1', text: 'Balas pesan prospek masuk', completed: true },
                { id: 'sub-2', text: 'Kirim penawaran proposal harga', completed: false },
                { id: 'sub-3', text: 'Update database status lead', completed: false }
              ]
            },
            { id: 't2', startTime: '08:40', endTime: '10:00', title: 'Sprint Review & Development', category: 'work', color: 'purple', completed: false },
            { id: 't3', startTime: '10:05', endTime: '11:30', title: 'Client Sync & Demo Fitur', category: 'meeting', color: 'emerald', completed: false }
          ],
          selasa: [
            { id: 't4', startTime: '08:00', endTime: '08:35', title: 'Task 1 - Cek Whatsapp & Follow Up', category: 'work', color: 'blue', completed: false },
            { id: 't5', startTime: '08:40', endTime: '10:00', title: 'Code Refactoring & Testing', category: 'work', color: 'purple', completed: false }
          ],
          rabu: [
            { id: 't6', startTime: '08:00', endTime: '08:35', title: 'Task 1 - Cek Whatsapp & Follow Up', category: 'work', color: 'blue', completed: false },
            { id: 't7', startTime: '08:40', endTime: '10:00', title: 'UI/UX Design & Prototyping', category: 'work', color: 'rose', completed: false }
          ],
          kamis: [
            { id: 't8', startTime: '08:00', endTime: '08:35', title: 'Task 1 - Cek Whatsapp & Email', category: 'work', color: 'blue', completed: false },
            { id: 't9', startTime: '08:40', endTime: '10:00', title: 'Integrasi API & Database', category: 'work', color: 'purple', completed: false }
          ],
          jumat: [
            { id: 't10', startTime: '08:00', endTime: '08:35', title: 'Task 1 - Cek Whatsapp & Follow Up', category: 'work', color: 'blue', completed: false },
            { id: 't11', startTime: '08:40', endTime: '10:00', title: 'Weekly Summary & Deploy Staging', category: 'work', color: 'emerald', completed: false }
          ],
          sabtu: [
            { id: 't12', startTime: '08:00', endTime: '09:00', title: 'Jogging Pagi & Sarapan Sehat', category: 'health', color: 'emerald', completed: false },
            { id: 't13', startTime: '09:05', endTime: '11:00', title: 'Belajar Skill Baru & Coding Session', category: 'study', color: 'purple', completed: false }
          ],
          minggu: [
            { id: 't14', startTime: '09:00', endTime: '11:30', title: 'Family Time & Quality Time', category: 'personal', color: 'rose', completed: false },
            { id: 't15', startTime: '19:00', endTime: '20:30', title: 'Review Target Mingguan & Evaluasi', category: 'personal', color: 'blue', completed: false }
          ]
        }
      },
      {
        id: 'plan-2',
        name: 'Weekend / Focus Plan',
        days: {
          senin: [], selasa: [], rabu: [], kamis: [], jumat: [],
          sabtu: [
            { id: 't16', startTime: '09:00', endTime: '12:00', title: 'Side Project Coding Session', category: 'work', color: 'blue', completed: false }
          ],
          minggu: [
            { id: 't17', startTime: '08:00', endTime: '11:00', title: 'Outdoor Activities & Refreshing', category: 'personal', color: 'amber', completed: false }
          ]
        }
      }
    ],
    goals: [
      {
        id: 'g1',
        title: 'Launching Aplikasi Timeline & Goals',
        date: getTodayFormatted(0),
        priority: 'high',
        description: 'Pastikan seluruh jadwal dan target terekam dengan rapi.',
        completed: false
      },
      {
        id: 'g2',
        title: 'Review Sprint & Evaluasi Waktu',
        date: getTodayFormatted(4),
        priority: 'medium',
        description: 'Menganalisis pencapaian target bulanan dan performa kerja.',
        completed: false
      },
      {
        id: 'g3',
        title: 'Milestone: Rilis Desktop Standalone',
        date: getTodayFormatted(10),
        priority: 'milestone',
        description: 'Bungkus webview desktop tanpa server lokal untuk penggunaan instan.',
        completed: false
      }
    ],
    roadmap: {
      Q1: {
        targetRupiah: 250000000,
        strategy: 'Validasi MVP produk, akuisisi 50 klien B2B pertama, dan setup automasi lead generation.',
        items: [
          {
            id: 'rm-1',
            title: 'Peluncuran Platform V2 & Integrasi Payment Gateway',
            startDate: '2026-01-10',
            finishDate: '2026-02-28',
            targetRupiah: 100000000,
            progress: 80,
            status: 'in_progress',
            strategy: 'Fokus automasi notifikasi WhatsApp, gateway pembayaran instan, dan user onboarding.',
            color: 'purple'
          },
          {
            id: 'rm-2',
            title: 'Penetrasi Pasar B2B & Akuisisi 50 Klien',
            startDate: '2026-02-01',
            finishDate: '2026-03-31',
            targetRupiah: 150000000,
            progress: 45,
            status: 'in_progress',
            strategy: 'Cold outreach terukur via LinkedIn, penawaran paket langganan tahunan, dan webinar demo.',
            color: 'blue'
          }
        ]
      },
      Q2: {
        targetRupiah: 350000000,
        strategy: 'Scale pemasaran berbayar (Meta/Google Ads), rekrutmen tim sales, dan ekspansi ke segmen enterprise.',
        items: [
          {
            id: 'rm-3',
            title: 'Paid Ads Scaling & Funnel Optimization',
            startDate: '2026-04-01',
            finishDate: '2026-05-15',
            targetRupiah: 150000000,
            progress: 20,
            status: 'planned',
            strategy: 'Scale budget iklan ROAS > 3.5, optimasi landing page konversi tinggi, dan retargeting.',
            color: 'emerald'
          },
          {
            id: 'rm-4',
            title: 'Ekspansi Fitur Enterprise & Multi-User Collaboration',
            startDate: '2026-05-01',
            finishDate: '2026-06-30',
            targetRupiah: 200000000,
            progress: 10,
            status: 'planned',
            strategy: 'Menambahkan role & permission, audit logs, dan pelaporan analytics performa tim.',
            color: 'amber'
          }
        ]
      },
      Q3: {
        targetRupiah: 350000000,
        strategy: 'Diversifikasi paket produk dan monetisasi add-on integrasi API pihak ketiga.',
        items: [
          {
            id: 'rm-5',
            title: 'Peluncuran Marketplace Integrasi API & Webhook',
            startDate: '2026-07-01',
            finishDate: '2026-08-31',
            targetRupiah: 175000000,
            progress: 0,
            status: 'planned',
            strategy: 'Membangun ekosistem add-on berbayar dan kerjasama dengan penyedia SaaS lokal.',
            color: 'purple'
          },
          {
            id: 'rm-6',
            title: 'Ekspansi Pasar Regional & Program Partner',
            startDate: '2026-08-15',
            finishDate: '2026-09-30',
            targetRupiah: 175000000,
            progress: 0,
            status: 'planned',
            strategy: 'Program reseller komisi berulang dan ekspansi ke komunitas bisnis di 5 kota besar.',
            color: 'blue'
          }
        ]
      },
      Q4: {
        targetRupiah: 300000000,
        strategy: 'Campaign diskon tahunan akhir tahun, program retensi pelanggan, dan persiapan roadmap tahun depan.',
        items: [
          {
            id: 'rm-7',
            title: 'Year-End Mega Campaign & Annual Subscription Renewal',
            startDate: '2026-10-01',
            finishDate: '2026-12-15',
            targetRupiah: 220000000,
            progress: 0,
            status: 'planned',
            strategy: 'Promo bundling langganan 2 tahun dan insentif upgrade paket tertinggi bagi klien aktif.',
            color: 'rose'
          },
          {
            id: 'rm-8',
            title: 'Annual Performance Review & Strategic Planning 2027',
            startDate: '2026-12-01',
            finishDate: '2026-12-31',
            targetRupiah: 80000000,
            progress: 0,
            status: 'planned',
            strategy: 'Evaluasi pencapaian omset tahunan, audit efisiensi operasional, dan penyusunan OKR baru.',
            color: 'emerald'
          }
        ]
      }
    },
    users: [
      { id: 'u-1', nama: 'Alex Traveler', email: 'alex@traveler.com', role: 'traveler', avatar: '🎒' },
      { id: 'u-admin', nama: 'Admin System', email: 'admin@timelineflow.app', role: 'admin', avatar: '👑' }
    ],
    activeUserId: 'u-1',
    activeTripId: 'trip-1',
    currentItinerarySubView: 'dashboard',
    tripFilter: 'all',
    trips: [
      {
        id: 'trip-1',
        userId: 'u-1',
        title: 'Liburan Eksplorasi Tokyo & Kyoto 🇯🇵',
        startDate: getTodayFormatted(5),
        endDate: getTodayFormatted(11),
        emoji: '🗼',
        tag: 'Wisata & Budaya',
        targetBudget: 25000000,
        notes: 'Pesan e-SIM online, tukar mata uang JPY, booking Shinkansen SmartEX, hotel di Shinjuku & Kyoto Gion.',
        activities: [
          {
            id: 'act-1',
            dayNumber: 1,
            date: getTodayFormatted(5),
            startTime: '10:00',
            endTime: '12:00',
            title: 'Mendarat di Haneda Airport & Penukaran JR Pass',
            category: 'transport',
            cost: 450000,
            notes: 'Ambil pocket Wi-Fi / pasang e-SIM, naik Tokyo Monorail ke stasiun Hamamatsucho.',
            completed: true
          },
          {
            id: 'act-2',
            dayNumber: 1,
            date: getTodayFormatted(5),
            startTime: '13:00',
            endTime: '15:30',
            title: 'Check-in Hotel Shinjuku Granbell & Istirahat Singkat',
            category: 'hotel',
            cost: 3200000,
            notes: 'Taruh koper, charge power bank, ganti outfit kasual santai.',
            completed: false
          },
          {
            id: 'act-3',
            dayNumber: 1,
            date: getTodayFormatted(5),
            startTime: '17:00',
            endTime: '20:30',
            title: 'Eksplor Shinjuku Omoide Yokocho & Santap Ramen Ichiran',
            category: 'culinary',
            cost: 250000,
            notes: 'Mencoba ramen legendaris dengan kuah tonkotsu pedas level 3.',
            completed: false
          },
          {
            id: 'act-4',
            dayNumber: 2,
            date: getTodayFormatted(6),
            startTime: '08:30',
            endTime: '11:30',
            title: 'Kuil Senso-ji Asakusa & Street Food Nakamise',
            category: 'sightseeing',
            cost: 150000,
            notes: 'Foto depan lentera Kaminarimon, coba melonpan hangat dan es krim matcha.',
            completed: false
          },
          {
            id: 'act-5',
            dayNumber: 2,
            date: getTodayFormatted(6),
            startTime: '13:30',
            endTime: '17:00',
            title: 'Kunjungan teamLab Planets Tokyo (Digital Art Exhibition)',
            category: 'activity',
            cost: 420000,
            notes: 'Masuk dengan QR code tiket online jam 14:00, pakai celana yang bisa digulung karena area air.',
            completed: false
          },
          {
            id: 'act-6',
            dayNumber: 2,
            date: getTodayFormatted(6),
            startTime: '18:00',
            endTime: '21:00',
            title: 'Shibuya Sky & Shibuya Crossing Sunset View',
            category: 'sightseeing',
            cost: 280000,
            notes: 'Naik ke observatory deck Shibuya Sky lantai 47 saat golden hour.',
            completed: false
          },
          {
            id: 'act-7',
            dayNumber: 3,
            date: getTodayFormatted(7),
            startTime: '07:30',
            endTime: '10:00',
            title: 'Shinkansen Nozomi Tokyo menuju Stasiun Kyoto',
            category: 'transport',
            cost: 1400000,
            notes: 'Duduk di sisi kanan (kursi E) untuk melihat pemandangan Gunung Fuji dari jendela kereta.',
            completed: false
          },
          {
            id: 'act-8',
            dayNumber: 3,
            date: getTodayFormatted(7),
            startTime: '11:00',
            endTime: '14:00',
            title: 'Fushimi Inari Taisha (Ribuan Gerbang Torii Merah)',
            category: 'sightseeing',
            cost: 0,
            notes: 'Trekking ringan melewati lorong torii, beli souvenir rubah khas Inari.',
            completed: false
          },
          {
            id: 'act-9',
            dayNumber: 3,
            date: getTodayFormatted(7),
            startTime: '15:30',
            endTime: '18:30',
            title: 'Gion District & Menyusuri Sungai Kamo (Kamogawa)',
            category: 'relax',
            cost: 180000,
            notes: 'Menikmati suasana Kyoto klasik tempo dulu, duduk santai di pinggir sungai saat senja.',
            completed: false
          }
        ]
      },
      {
        id: 'trip-2',
        userId: 'u-1',
        title: 'Eksplorasi Labuan Bajo & Pulau Komodo 🏝️',
        startDate: getTodayFormatted(20),
        endDate: getTodayFormatted(23),
        emoji: '🏖️',
        tag: 'Adventure & Alam',
        targetBudget: 12000000,
        notes: 'Sewa kapal phinisi 3D2N liveaboard, bawa kamera underwater, kacamata hitam, & obat anti mabuk laut.',
        activities: [
          {
            id: 'act-10',
            dayNumber: 1,
            date: getTodayFormatted(20),
            startTime: '10:00',
            endTime: '11:30',
            title: 'Tiba di Bandara Komodo Labuan Bajo & Menuju Pelabuhan',
            category: 'transport',
            cost: 100000,
            notes: 'Driver jemput di arrival gate dengan papan nama.',
            completed: false
          },
          {
            id: 'act-11',
            dayNumber: 1,
            date: getTodayFormatted(20),
            startTime: '13:00',
            endTime: '16:30',
            title: 'Berlayar ke Pulau Kelor & Trekking Bukit View 360°',
            category: 'sightseeing',
            cost: 50000,
            notes: 'Trekking bukit curam dengan pemandangan gradasi laut toska yang spektakuler.',
            completed: false
          },
          {
            id: 'act-12',
            dayNumber: 1,
            date: getTodayFormatted(20),
            startTime: '17:30',
            endTime: '19:00',
            title: 'Sunset Kalong Island (Ribuan Kelelawar Terbang Senja)',
            category: 'sightseeing',
            cost: 0,
            notes: 'Kapal berlabuh tenang, ribuan kelelawar keluar menghiasi langit jingga.',
            completed: false
          },
          {
            id: 'act-13',
            dayNumber: 2,
            date: getTodayFormatted(21),
            startTime: '05:30',
            endTime: '08:30',
            title: 'Sunrise Trekking Puncak Pulau Padar',
            category: 'sightseeing',
            cost: 150000,
            notes: 'Naik 800 anak tangga kayu saat fajar, ikon pemandangan tiga teluk warna-warni.',
            completed: false
          },
          {
            id: 'act-14',
            dayNumber: 2,
            date: getTodayFormatted(21),
            startTime: '10:00',
            endTime: '13:00',
            title: 'Pink Beach Snorkeling & Foto Pasir Merah Muda',
            category: 'activity',
            cost: 50000,
            notes: 'Snorkeling melihat terumbu karang warna-warni dan ikan nemo.',
            completed: false
          }
        ]
      }
    ]
  };

  // State
  let state = {
    data: null,
    calCurrentDate: new Date(),
    calSelectedDate: getTodayFormatted(0),
    editingTaskId: null,
    editingGoalId: null,
    editingPlanId: null,
    editingRoadmapId: null,
    editingQuarterKey: null,
    editingTripId: null,
    editingActivityId: null,
    selectedItineraryDay: 'all',
    undoStack: [],
    pendingConfirmAction: null,
    pendingDragAction: null,
    tempTaskItems: []
  };

  let DOM = {};

  function init() {
    cacheDOMElements();
    loadData();
    initTheme();
    initUpdateSystem();
    setupEventListeners();
    renderAll();
  }

  function cacheDOMElements() {
    DOM = {
      // Header Switcher & Stats
      viewModeDailyBtn: document.getElementById('viewModeDailyBtn'),
      viewModeRoadmapBtn: document.getElementById('viewModeRoadmapBtn'),
      viewModeItineraryBtn: document.getElementById('viewModeItineraryBtn'),
      headerStatsDaily: document.getElementById('headerStatsDaily'),
      headerStatsRoadmap: document.getElementById('headerStatsRoadmap'),
      headerStatsItinerary: document.getElementById('headerStatsItinerary'),
      currentPlanLabelBadge: document.getElementById('currentPlanLabelBadge'),
      currentPlanBtn: document.getElementById('currentPlanBtn'),
      totalTasksCount: document.getElementById('totalTasksCount'),
      totalGoalsCount: document.getElementById('totalGoalsCount'),
      totalYearTargetRupiah: document.getElementById('totalYearTargetRupiah'),
      totalRoadmapItemsCount: document.getElementById('totalRoadmapItemsCount'),
      totalTripsCount: document.getElementById('totalTripsCount'),
      totalActivitiesCount: document.getElementById('totalActivitiesCount'),
      totalItineraryExpense: document.getElementById('totalItineraryExpense'),
      headerGoalsBadge: document.getElementById('headerGoalsBadge'),
      openGoalsBtn: document.getElementById('openGoalsBtn'),
      userProfileBtn: document.getElementById('userProfileBtn'),
      navUserAvatar: document.getElementById('navUserAvatar'),
      navUserRoleText: document.getElementById('navUserRoleText'),
      quickPrintNavBtn: document.getElementById('quickPrintNavBtn'),
      exportDataBtn: document.getElementById('exportDataBtn'),
      importDataBtn: document.getElementById('importDataBtn'),
      importFileInput: document.getElementById('importFileInput'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),

      // View Sections
      dailyViewSection: document.getElementById('dailyViewSection'),
      dailySidebarSection: document.getElementById('dailySidebarSection'),
      roadmapViewSection: document.getElementById('roadmapViewSection'),
      itineraryViewSection: document.getElementById('itineraryViewSection'),

      // Daily Schedule
      activePlanHeading: document.getElementById('activePlanHeading'),
      renamePlanBtn: document.getElementById('renamePlanBtn'),
      printDailyPlanBtn: document.getElementById('printDailyPlanBtn'),
      quickAddTaskBtn: document.getElementById('quickAddTaskBtn'),
      clearCompletedBtn: document.getElementById('clearCompletedBtn'),
      daysGrid: document.getElementById('daysGrid'),

      // Sidebar Plans
      addNewPlanBtn: document.getElementById('addNewPlanBtn'),
      plansTabList: document.getElementById('plansTabList'),
      sidebarGoalsPreview: document.getElementById('sidebarGoalsPreview'),
      widgetOpenGoalsBtn: document.getElementById('widgetOpenGoalsBtn'),

      // Roadmap
      roadmapYearSelect: document.getElementById('roadmapYearSelect'),
      addRoadmapItemBtn: document.getElementById('addRoadmapItemBtn'),
      printRoadmapBtn: document.getElementById('printRoadmapBtn'),
      quartersGrid: document.getElementById('quartersGrid'),

      // Print Report Container
      printReportContainer: document.getElementById('printReportContainer'),

      // Itinerary Dashboard & Detail
      itineraryDashboardView: document.getElementById('itineraryDashboardView'),
      itineraryDetailView: document.getElementById('itineraryDetailView'),
      tripSearchInput: document.getElementById('tripSearchInput'),
      tripFilterGroup: document.getElementById('tripFilterGroup'),
      createTripBtn: document.getElementById('createTripBtn'),
      tripsGridContainer: document.getElementById('tripsGridContainer'),

      backToTripsBtn: document.getElementById('backToTripsBtn'),
      breadcrumbTripEmoji: document.getElementById('breadcrumbTripEmoji'),
      breadcrumbTripTitle: document.getElementById('breadcrumbTripTitle'),
      detailTripStatusBadge: document.getElementById('detailTripStatusBadge'),
      detailTripEmoji: document.getElementById('detailTripEmoji'),
      detailTripTag: document.getElementById('detailTripTag'),
      detailTripDuration: document.getElementById('detailTripDuration'),
      detailTripCountdown: document.getElementById('detailTripCountdown'),
      detailTripTitleHeading: document.getElementById('detailTripTitleHeading'),
      detailTripDatesRange: document.getElementById('detailTripDatesRange'),
      detailTripNotes: document.getElementById('detailTripNotes'),
      detailTripTargetBudget: document.getElementById('detailTripTargetBudget'),
      detailTripTotalExpense: document.getElementById('detailTripTotalExpense'),
      detailTripActivitiesCount: document.getElementById('detailTripActivitiesCount'),
      budgetPercentText: document.getElementById('budgetPercentText'),
      budgetRemainingText: document.getElementById('budgetRemainingText'),
      budgetProgressFill: document.getElementById('budgetProgressFill'),
      addActivityBtn: document.getElementById('addActivityBtn'),
      shareTripBtn: document.getElementById('shareTripBtn'),
      printTripBtn: document.getElementById('printTripBtn'),
      editCurrentTripBtn: document.getElementById('editCurrentTripBtn'),
      deleteCurrentTripBtn: document.getElementById('deleteCurrentTripBtn'),
      itineraryDaysTabs: document.getElementById('itineraryDaysTabs'),
      currentDaySummaryPill: document.getElementById('currentDaySummaryPill'),
      itineraryTimelineContent: document.getElementById('itineraryTimelineContent'),

      // Modals
      taskModalOverlay: document.getElementById('taskModalOverlay'),
      taskModalTitle: document.getElementById('taskModalTitle'),
      taskForm: document.getElementById('taskForm'),
      taskEditId: document.getElementById('taskEditId'),
      taskDaySelect: document.getElementById('taskDaySelect'),
      taskStartTime: document.getElementById('taskStartTime'),
      taskEndTime: document.getElementById('taskEndTime'),
      taskTitle: document.getElementById('taskTitle'),
      taskCategory: document.getElementById('taskCategory'),
      taskColor: document.getElementById('taskColor'),
      taskItemsCountBadge: document.getElementById('taskItemsCountBadge'),
      newTaskItemInput: document.getElementById('newTaskItemInput'),
      addTaskItemBtn: document.getElementById('addTaskItemBtn'),
      taskModalItemsList: document.getElementById('taskModalItemsList'),
      closeTaskModalBtn: document.getElementById('closeTaskModalBtn'),
      cancelTaskModalBtn: document.getElementById('cancelTaskModalBtn'),

      // Plan Modal
      planModalOverlay: document.getElementById('planModalOverlay'),
      planModalTitle: document.getElementById('planModalTitle'),
      planForm: document.getElementById('planForm'),
      planEditId: document.getElementById('planEditId'),
      planNameInput: document.getElementById('planNameInput'),
      planTemplateGroup: document.getElementById('planTemplateGroup'),
      planTemplateSelect: document.getElementById('planTemplateSelect'),
      closePlanModalBtn: document.getElementById('closePlanModalBtn'),
      cancelPlanModalBtn: document.getElementById('cancelPlanModalBtn'),

      // Goals Calendar Modal
      goalsModalOverlay: document.getElementById('goalsModalOverlay'),
      closeGoalsModalBtn: document.getElementById('closeGoalsModalBtn'),
      calPrevMonthBtn: document.getElementById('calPrevMonthBtn'),
      calNextMonthBtn: document.getElementById('calNextMonthBtn'),
      calTodayBtn: document.getElementById('calTodayBtn'),
      calMonthYearLabel: document.getElementById('calMonthYearLabel'),
      calendarGrid: document.getElementById('calendarGrid'),
      goalFormHeading: document.getElementById('goalFormHeading'),
      goalForm: document.getElementById('goalForm'),
      goalEditId: document.getElementById('goalEditId'),
      goalTitle: document.getElementById('goalTitle'),
      goalDate: document.getElementById('goalDate'),
      goalPriority: document.getElementById('goalPriority'),
      goalDescription: document.getElementById('goalDescription'),
      resetGoalFormBtn: document.getElementById('resetGoalFormBtn'),
      monthGoalsCount: document.getElementById('monthGoalsCount'),
      goalsListItems: document.getElementById('goalsListItems'),

      // Roadmap Modal
      roadmapItemModalOverlay: document.getElementById('roadmapItemModalOverlay'),
      roadmapModalTitle: document.getElementById('roadmapModalTitle'),
      roadmapItemForm: document.getElementById('roadmapItemForm'),
      roadmapEditId: document.getElementById('roadmapEditId'),
      roadmapQuarterSelect: document.getElementById('roadmapQuarterSelect'),
      roadmapStatusSelect: document.getElementById('roadmapStatusSelect'),
      roadmapTitle: document.getElementById('roadmapTitle'),
      roadmapStartDate: document.getElementById('roadmapStartDate'),
      roadmapFinishDate: document.getElementById('roadmapFinishDate'),
      roadmapTargetRupiah: document.getElementById('roadmapTargetRupiah'),
      formattedRupiahPreview: document.getElementById('formattedRupiahPreview'),
      roadmapProgressRange: document.getElementById('roadmapProgressRange'),
      progressRangeValue: document.getElementById('progressRangeValue'),
      roadmapStrategy: document.getElementById('roadmapStrategy'),
      closeRoadmapItemModalBtn: document.getElementById('closeRoadmapItemModalBtn'),
      cancelRoadmapItemModalBtn: document.getElementById('cancelRoadmapItemModalBtn'),

      // Quarter Meta Modal
      quarterMetaModalOverlay: document.getElementById('quarterMetaModalOverlay'),
      quarterMetaModalTitle: document.getElementById('quarterMetaModalTitle'),
      quarterMetaForm: document.getElementById('quarterMetaForm'),
      quarterMetaKey: document.getElementById('quarterMetaKey'),
      quarterMetaStartDate: document.getElementById('quarterMetaStartDate'),
      quarterMetaEndDate: document.getElementById('quarterMetaEndDate'),
      quarterQ1CascadeHint: document.getElementById('quarterQ1CascadeHint'),
      quarterMetaPeriodLabel: document.getElementById('quarterMetaPeriodLabel'),
      quarterMetaTargetRupiah: document.getElementById('quarterMetaTargetRupiah'),
      quarterRupiahPreview: document.getElementById('quarterRupiahPreview'),
      quarterMetaStrategy: document.getElementById('quarterMetaStrategy'),
      closeQuarterMetaModalBtn: document.getElementById('closeQuarterMetaModalBtn'),
      cancelQuarterMetaModalBtn: document.getElementById('cancelQuarterMetaModalBtn'),

      // Trip Modal
      tripModalOverlay: document.getElementById('tripModalOverlay'),
      tripModalTitle: document.getElementById('tripModalTitle'),
      tripForm: document.getElementById('tripForm'),
      tripEditId: document.getElementById('tripEditId'),
      tripEmojiSelect: document.getElementById('tripEmojiSelect'),
      tripTitle: document.getElementById('tripTitle'),
      tripStartDate: document.getElementById('tripStartDate'),
      tripEndDate: document.getElementById('tripEndDate'),
      tripCategorySelect: document.getElementById('tripCategorySelect'),
      tripTargetBudget: document.getElementById('tripTargetBudget'),
      tripBudgetRupiahPreview: document.getElementById('tripBudgetRupiahPreview'),
      tripNotes: document.getElementById('tripNotes'),
      closeTripModalBtn: document.getElementById('closeTripModalBtn'),
      cancelTripModalBtn: document.getElementById('cancelTripModalBtn'),

      // Activity Modal
      activityModalOverlay: document.getElementById('activityModalOverlay'),
      activityModalTitle: document.getElementById('activityModalTitle'),
      activityForm: document.getElementById('activityForm'),
      activityEditId: document.getElementById('activityEditId'),
      activityTripId: document.getElementById('activityTripId'),
      activityDaySelect: document.getElementById('activityDaySelect'),
      activityStartTime: document.getElementById('activityStartTime'),
      activityEndTime: document.getElementById('activityEndTime'),
      activityTitle: document.getElementById('activityTitle'),
      activityCategory: document.getElementById('activityCategory'),
      activityCost: document.getElementById('activityCost'),
      activityCostPreview: document.getElementById('activityCostPreview'),
      activityNotes: document.getElementById('activityNotes'),
      closeActivityModalBtn: document.getElementById('closeActivityModalBtn'),
      cancelActivityModalBtn: document.getElementById('cancelActivityModalBtn'),

      // Share Modal
      shareTripModalOverlay: document.getElementById('shareTripModalOverlay'),
      shareTripTextPreview: document.getElementById('shareTripTextPreview'),
      copyShareTextBtn: document.getElementById('copyShareTextBtn'),
      printFromShareBtn: document.getElementById('printFromShareBtn'),
      closeShareTripModalBtn: document.getElementById('closeShareTripModalBtn'),

      // User Profile Modal
      userProfileModalOverlay: document.getElementById('userProfileModalOverlay'),
      userProfileForm: document.getElementById('userProfileForm'),
      userRoleSelect: document.getElementById('userRoleSelect'),
      userNameInput: document.getElementById('userNameInput'),
      userEmailInput: document.getElementById('userEmailInput'),
      closeUserProfileModalBtn: document.getElementById('closeUserProfileModalBtn'),
      cancelUserProfileModalBtn: document.getElementById('cancelUserProfileModalBtn'),

      // Custom Confirmation Modal
      confirmModalOverlay: document.getElementById('confirmModalOverlay'),
      confirmModalIcon: document.getElementById('confirmModalIcon'),
      confirmModalTitle: document.getElementById('confirmModalTitle'),
      confirmModalMessage: document.getElementById('confirmModalMessage'),
      cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),
      okConfirmBtn: document.getElementById('okConfirmBtn'),

      // Drag & Drop Action Choice Modal
      dragActionModalOverlay: document.getElementById('dragActionModalOverlay'),
      dragTaskHighlight: document.getElementById('dragTaskHighlight'),
      dragTargetDayName: document.getElementById('dragTargetDayName'),
      dragMoveBtn: document.getElementById('dragMoveBtn'),
      dragDuplicateBtn: document.getElementById('dragDuplicateBtn'),
      cancelDragActionBtn: document.getElementById('cancelDragActionBtn'),

      // Tooltip & Toast
      calendarTooltip: document.getElementById('calendarTooltip'),
      tooltipHeader: document.getElementById('tooltipHeader'),
      tooltipBody: document.getElementById('tooltipBody'),
      toastContainer: document.getElementById('toastContainer'),

      // System Update & App Info
      appInfoNavBtn: document.getElementById('appInfoNavBtn'),
      profileAppInfoBtn: document.getElementById('profileAppInfoBtn'),
      appInfoModalOverlay: document.getElementById('appInfoModalOverlay'),
      closeAppInfoModalBtn: document.getElementById('closeAppInfoModalBtn'),
      closeAppInfoBtn: document.getElementById('closeAppInfoBtn'),
      appInfoCheckUpdateBtn: document.getElementById('appInfoCheckUpdateBtn'),
      appInfoVersionBadge: document.getElementById('appInfoVersionBadge'),
      appInfoVerText: document.getElementById('appInfoVerText'),
      appInfoPlatformText: document.getElementById('appInfoPlatformText'),
      appInfoWaLink: document.getElementById('appInfoWaLink'),

      // System Update Modal
      checkUpdateNavBtn: document.getElementById('checkUpdateNavBtn'),
      profileCheckUpdateBtn: document.getElementById('profileCheckUpdateBtn'),
      profileAppVersionText: document.getElementById('profileAppVersionText'),
      updateModalOverlay: document.getElementById('updateModalOverlay'),
      closeUpdateModalTopBtn: document.getElementById('closeUpdateModalTopBtn'),
      updateModalHeading: document.getElementById('updateModalHeading'),
      updateModalSubheading: document.getElementById('updateModalSubheading'),
      updateStateChecking: document.getElementById('updateStateChecking'),
      updateStateAvailable: document.getElementById('updateStateAvailable'),
      updateStateDownloading: document.getElementById('updateStateDownloading'),
      updateStateReady: document.getElementById('updateStateReady'),
      updateStateLatest: document.getElementById('updateStateLatest'),
      updateStateError: document.getElementById('updateStateError'),
      updateCurrentVersionText: document.getElementById('updateCurrentVersionText'),
      updateNewVersionText: document.getElementById('updateNewVersionText'),
      updateReleaseNotesList: document.getElementById('updateReleaseNotesList'),
      btnCancelUpdateAvailable: document.getElementById('btnCancelUpdateAvailable'),
      btnStartUpdateDownload: document.getElementById('btnStartUpdateDownload'),
      updateProgressBarFill: document.getElementById('updateProgressBarFill'),
      updateProgressPercentText: document.getElementById('updateProgressPercentText'),
      updateProgressSpeedText: document.getElementById('updateProgressSpeedText'),
      updateDownloadingNotice: document.getElementById('updateDownloadingNotice'),
      btnLaterInstall: document.getElementById('btnLaterInstall'),
      btnRestartAndInstall: document.getElementById('btnRestartAndInstall'),
      latestVersionBadge: document.getElementById('latestVersionBadge'),
      btnCloseUpdateLatest: document.getElementById('btnCloseUpdateLatest'),
      updateErrorDetailText: document.getElementById('updateErrorDetailText'),
      btnRetryUpdateCheck: document.getElementById('btnRetryUpdateCheck'),
      btnCloseUpdateError: document.getElementById('btnCloseUpdateError')
    };
  }

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.data = JSON.parse(stored);
      } else {
        const oldStored = localStorage.getItem('timelineflow_data_v2') || localStorage.getItem('timelineflow_data_v1');
        if (oldStored) {
          const parsed = JSON.parse(oldStored);
          state.data = {
            ...JSON.parse(JSON.stringify(DEFAULT_DATA)),
            plans: parsed.plans || DEFAULT_DATA.plans,
            goals: parsed.goals || DEFAULT_DATA.goals
          };
        } else {
          state.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
        saveData();
      }
    } catch (e) {
      console.error('Error loading data', e);
      state.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
    }

    // Safety fallbacks for features
    if (!state.data.users || state.data.users.length === 0) {
      state.data.users = JSON.parse(JSON.stringify(DEFAULT_DATA.users));
    }
    if (!state.data.activeUserId) {
      state.data.activeUserId = 'u-1';
    }
    if (!state.data.trips || state.data.trips.length === 0) {
      state.data.trips = JSON.parse(JSON.stringify(DEFAULT_DATA.trips));
    }
    if (!state.data.activeTripId && state.data.trips[0]) {
      state.data.activeTripId = state.data.trips[0].id;
    }
    if (!state.data.currentItinerarySubView) {
      state.data.currentItinerarySubView = 'dashboard';
    }
    if (!state.data.tripFilter) {
      state.data.tripFilter = 'all';
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
    showToast(`Beralih ke mode ${next === 'dark' ? 'Gelap' : 'Terang'}`);
  }

  function getActivePlan() {
    if (!state.data || !state.data.plans || state.data.plans.length === 0) {
      const newPlan = {
        id: 'plan-' + Date.now(),
        name: 'Plan Utama',
        days: { senin: [], selasa: [], rabu: [], kamis: [], jumat: [], sabtu: [], minggu: [] }
      };
      state.data.plans = [newPlan];
      state.data.activePlanId = newPlan.id;
      return newPlan;
    }
    let plan = state.data.plans.find(p => p.id === state.data.activePlanId);
    if (!plan) {
      plan = state.data.plans[0];
      state.data.activePlanId = plan.id;
    }
    return plan;
  }

  function getTodayDayKey() {
    const dayIndex = new Date().getDay();
    const map = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return map[dayIndex];
  }

  function getDayLabel(key) {
    const found = DAYS_OF_WEEK.find(d => d.key === key);
    return found ? found.label : key;
  }

  function generateId(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).substr(2, 8) + '_' + Date.now();
  }

  function getCategoryLabel(cat) {
    const map = {
      work: 'Work',
      study: 'Study',
      health: 'Health',
      meeting: 'Meeting',
      personal: 'Personal',
      break: 'Break'
    };
    return map[cat] || cat;
  }

  // ==========================================================================
  // SMART TIME SLOT ALLOCATION & 5-MINUTE REST GAP VALIDATION
  // ==========================================================================

  function getSuggestedNextTimeSlot(dayKey, excludeTaskId = null) {
    const activePlan = getActivePlan();
    const tasks = (activePlan.days && activePlan.days[dayKey])
      ? activePlan.days[dayKey].filter(t => t.id !== excludeTaskId)
      : [];

    if (tasks.length === 0) {
      return { startTime: '08:00', endTime: '08:35' };
    }

    const sorted = [...tasks].sort((a, b) => timeToMinutes(a.endTime) - timeToMinutes(b.endTime));
    const latestTask = sorted[sorted.length - 1];
    const latestEndMins = timeToMinutes(latestTask.endTime);

    const nextStartMins = latestEndMins + 5;
    
    let nextEndMins = nextStartMins + 35;
    if (nextEndMins > 1435) {
      nextEndMins = 1439;
    }

    if (nextStartMins >= 1435) {
      return { startTime: '08:00', endTime: '08:35' };
    }

    return {
      startTime: minutesToTime(nextStartMins),
      endTime: minutesToTime(nextEndMins)
    };
  }

  function validateTaskTimeSlot(dayKey, startTimeStr, endTimeStr, excludeTaskId = null) {
    const startMins = timeToMinutes(startTimeStr);
    const endMins = timeToMinutes(endTimeStr);

    if (startMins >= endMins) {
      return {
        valid: false,
        message: 'Waktu mulai harus lebih awal dari waktu selesai!'
      };
    }

    if (endMins - startMins < 5) {
      return {
        valid: false,
        message: 'Durasi tugas minimal adalah 5 menit!'
      };
    }

    const activePlan = getActivePlan();
    const existingTasks = (activePlan.days && activePlan.days[dayKey])
      ? activePlan.days[dayKey].filter(t => t.id !== excludeTaskId)
      : [];

    for (const task of existingTasks) {
      const existStart = timeToMinutes(task.startTime);
      const existEnd = timeToMinutes(task.endTime);

      if (startMins < existEnd && endMins > existStart) {
        return {
          valid: false,
          message: `Jam tersebut sudah dipakai untuk tugas "${task.title}" (${task.startTime} - ${task.endTime})!`
        };
      }

      if (startMins >= existEnd && startMins < (existEnd + 5)) {
        const requiredStart = minutesToTime(existEnd + 5);
        return {
          valid: false,
          message: `Wajib jeda istirahat 5 menit setelah "${task.title}" (${task.startTime} - ${task.endTime}). Tugas baru dapat dimulai pukul ${requiredStart}!`
        };
      }

      if (endMins <= existStart && endMins > (existStart - 5)) {
        const requiredEnd = minutesToTime(existStart - 5);
        return {
          valid: false,
          message: `Wajib jeda istirahat 5 menit sebelum "${task.title}" (${task.startTime} - ${task.endTime}). Tugas harus selesai paling lambat pukul ${requiredEnd}!`
        };
      }
    }

    return { valid: true };
  }

  // ==========================================================================
  // VIEW MODE SWITCHER
  // ==========================================================================

  function switchViewMode(mode) {
    state.data.viewMode = mode;
    saveData();

    if (mode === 'roadmap') {
      DOM.viewModeRoadmapBtn.classList.add('active');
      DOM.viewModeDailyBtn.classList.remove('active');
      if (DOM.viewModeItineraryBtn) DOM.viewModeItineraryBtn.classList.remove('active');
      DOM.dailyViewSection.style.display = 'none';
      DOM.dailySidebarSection.style.display = 'none';
      DOM.roadmapViewSection.style.display = 'flex';
      if (DOM.itineraryViewSection) DOM.itineraryViewSection.style.display = 'none';
      DOM.headerStatsDaily.style.display = 'none';
      DOM.headerStatsRoadmap.style.display = 'flex';
      if (DOM.headerStatsItinerary) DOM.headerStatsItinerary.style.display = 'none';
      renderRoadmapBoard();
    } else if (mode === 'itinerary') {
      if (DOM.viewModeItineraryBtn) DOM.viewModeItineraryBtn.classList.add('active');
      DOM.viewModeDailyBtn.classList.remove('active');
      DOM.viewModeRoadmapBtn.classList.remove('active');
      DOM.dailyViewSection.style.display = 'none';
      DOM.dailySidebarSection.style.display = 'none';
      DOM.roadmapViewSection.style.display = 'none';
      if (DOM.itineraryViewSection) DOM.itineraryViewSection.style.display = 'flex';
      DOM.headerStatsDaily.style.display = 'none';
      DOM.headerStatsRoadmap.style.display = 'none';
      if (DOM.headerStatsItinerary) DOM.headerStatsItinerary.style.display = 'flex';
      renderItineraryPlanner();
    } else {
      DOM.viewModeDailyBtn.classList.add('active');
      DOM.viewModeRoadmapBtn.classList.remove('active');
      if (DOM.viewModeItineraryBtn) DOM.viewModeItineraryBtn.classList.remove('active');
      DOM.dailyViewSection.style.display = 'flex';
      DOM.dailySidebarSection.style.display = 'flex';
      DOM.roadmapViewSection.style.display = 'none';
      if (DOM.itineraryViewSection) DOM.itineraryViewSection.style.display = 'none';
      DOM.headerStatsDaily.style.display = 'flex';
      DOM.headerStatsRoadmap.style.display = 'none';
      if (DOM.headerStatsItinerary) DOM.headerStatsItinerary.style.display = 'none';
      renderTimelineGrid();
      renderPlanTabs();
    }
    renderHeaderStats();
    renderUserProfileNav();
  }

  // ==========================================================================
  // CUSTOM CONFIRMATION DIALOG MODAL
  // ==========================================================================

  function showConfirmDialog({
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan?',
    icon = 'fa-solid fa-triangle-exclamation',
    confirmText = 'Ya, Hapus',
    isDanger = true,
    onConfirm
  }) {
    if (!DOM.confirmModalOverlay) return;

    if (DOM.confirmModalTitle) DOM.confirmModalTitle.textContent = title;
    if (DOM.confirmModalMessage) DOM.confirmModalMessage.textContent = message;
    if (DOM.confirmModalIcon) {
      if (typeof icon === 'string' && icon.startsWith('fa-')) {
        DOM.confirmModalIcon.innerHTML = `<i class="${icon}"></i>`;
      } else if (typeof icon === 'string' && icon.includes('<i ')) {
        DOM.confirmModalIcon.innerHTML = icon;
      } else {
        DOM.confirmModalIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>`;
      }
    }
    if (DOM.okConfirmBtn) {
      DOM.okConfirmBtn.textContent = confirmText;
      DOM.okConfirmBtn.className = isDanger ? 'btn-danger' : 'btn-primary';
    }

    state.pendingConfirmAction = onConfirm;
    DOM.confirmModalOverlay.classList.add('is-active');
  }

  function closeConfirmDialog() {
    if (DOM.confirmModalOverlay) {
      DOM.confirmModalOverlay.classList.remove('is-active');
    }
    state.pendingConfirmAction = null;
  }

  // ==========================================================================
  // DRAG AND DROP ACTION CHOICE MODAL (Move vs Duplicate)
  // ==========================================================================

  function openDragActionModal(sourceDayKey, targetDayKey, taskId) {
    const activePlan = getActivePlan();
    const task = (activePlan.days[sourceDayKey] || []).find(t => t.id === taskId);
    if (!task) return;

    state.pendingDragAction = { type: 'task', sourceDayKey, targetDayKey, taskId, task };

    if (DOM.dragTaskHighlight) {
      DOM.dragTaskHighlight.textContent = `${task.startTime}-${task.endTime} : ${task.title}`;
    }
    if (DOM.dragTargetDayName) {
      DOM.dragTargetDayName.textContent = `Hari ${getDayLabel(targetDayKey)}`;
    }

    if (DOM.dragActionModalOverlay) {
      DOM.dragActionModalOverlay.classList.add('is-active');
    }
  }

  function openRoadmapDragActionModal(sourceQuarterKey, targetQuarterKey, roadmapItemId) {
    if (!state.data.roadmap || !state.data.roadmap[sourceQuarterKey]) return;
    const item = (state.data.roadmap[sourceQuarterKey].items || []).find(i => i.id === roadmapItemId);
    if (!item) return;

    state.pendingDragAction = {
      type: 'roadmap',
      sourceQuarterKey,
      targetQuarterKey,
      roadmapItemId,
      item
    };

    if (DOM.dragTaskHighlight) {
      DOM.dragTaskHighlight.textContent = `Inisiatif: ${item.title}`;
    }
    if (DOM.dragTargetDayName) {
      DOM.dragTargetDayName.textContent = `Kuartal ${targetQuarterKey}`;
    }

    if (DOM.dragActionModalOverlay) {
      DOM.dragActionModalOverlay.classList.add('is-active');
    }
  }

  function closeDragActionModal() {
    if (DOM.dragActionModalOverlay) {
      DOM.dragActionModalOverlay.classList.remove('is-active');
    }
    state.pendingDragAction = null;
  }

  function executeDragMove() {
    if (!state.pendingDragAction) return;

    if (state.pendingDragAction.type === 'roadmap') {
      const { sourceQuarterKey, targetQuarterKey, roadmapItemId } = state.pendingDragAction;
      moveRoadmapItem(sourceQuarterKey, targetQuarterKey, roadmapItemId);
      closeDragActionModal();
      return;
    }

    const { sourceDayKey, targetDayKey, taskId, task } = state.pendingDragAction;
    const activePlan = getActivePlan();

    if (!activePlan.days[targetDayKey]) activePlan.days[targetDayKey] = [];

    if (sourceDayKey === targetDayKey) {
      showToast('Tugas berada di hari yang sama');
      closeDragActionModal();
      return;
    }

    let finalStartTime = task.startTime;
    let finalEndTime = task.endTime;
    const validation = validateTaskTimeSlot(targetDayKey, finalStartTime, finalEndTime);

    if (!validation.valid) {
      const suggested = getSuggestedNextTimeSlot(targetDayKey);
      finalStartTime = suggested.startTime;
      finalEndTime = suggested.endTime;
    }

    activePlan.days[sourceDayKey] = activePlan.days[sourceDayKey].filter(t => t.id !== taskId);
    activePlan.days[targetDayKey].push({
      ...task,
      startTime: finalStartTime,
      endTime: finalEndTime
    });

    saveData();
    renderAll();
    closeDragActionModal();
    showToast(`Tugas dipindahkan ke ${getDayLabel(targetDayKey)} (${finalStartTime} - ${finalEndTime})`);
  }

  function executeDragDuplicate() {
    if (!state.pendingDragAction) return;

    if (state.pendingDragAction.type === 'roadmap') {
      const { sourceQuarterKey, targetQuarterKey, roadmapItemId } = state.pendingDragAction;
      duplicateRoadmapItem(sourceQuarterKey, roadmapItemId, targetQuarterKey);
      closeDragActionModal();
      return;
    }

    const { targetDayKey, task } = state.pendingDragAction;
    const activePlan = getActivePlan();

    if (!activePlan.days[targetDayKey]) activePlan.days[targetDayKey] = [];

    let finalStartTime = task.startTime;
    let finalEndTime = task.endTime;
    const validation = validateTaskTimeSlot(targetDayKey, finalStartTime, finalEndTime);

    if (!validation.valid) {
      const suggested = getSuggestedNextTimeSlot(targetDayKey);
      finalStartTime = suggested.startTime;
      finalEndTime = suggested.endTime;
    }

    const clonedTask = {
      ...task,
      id: generateId('task'),
      startTime: finalStartTime,
      endTime: finalEndTime,
      completed: false,
      items: task.items ? task.items.map(it => ({ ...it, id: generateId('item'), completed: false })) : []
    };

    activePlan.days[targetDayKey].push(clonedTask);

    saveData();
    renderAll();
    closeDragActionModal();
    showToast(`Tugas diduplikat ke ${getDayLabel(targetDayKey)} (${finalStartTime} - ${finalEndTime})`);
  }

  function duplicateTask(dayKey, taskId) {
    const activePlan = getActivePlan();
    const tasks = activePlan.days[dayKey] || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const suggested = getSuggestedNextTimeSlot(dayKey);
    const clonedTask = {
      ...task,
      id: generateId('task'),
      title: `${task.title} (Copy)`,
      startTime: suggested.startTime,
      endTime: suggested.endTime,
      completed: false,
      items: task.items ? task.items.map(it => ({ ...it, id: generateId('item'), completed: false })) : []
    };

    tasks.push(clonedTask);
    saveData();
    renderTimelineGrid();
    renderHeaderStats();
    showToast(`Tugas "${task.title}" diduplikat (${suggested.startTime} - ${suggested.endTime})`);
  }

  function duplicateRoadmapItem(sourceQKey, itemId, targetQKey = null) {
    if (!state.data.roadmap || !state.data.roadmap[sourceQKey]) return;
    const sourceItems = state.data.roadmap[sourceQKey].items || [];
    const item = sourceItems.find(it => it.id === itemId);
    if (!item) return;

    const destQKey = targetQKey || sourceQKey;
    if (!state.data.roadmap[destQKey]) {
      const meta = QUARTERS_META[destQKey];
      state.data.roadmap[destQKey] = {
        targetRupiah: meta.defaultTarget,
        strategy: '',
        startDate: meta.defaultStart,
        endDate: meta.defaultEnd,
        periodLabel: '',
        items: []
      };
    }
    if (!state.data.roadmap[destQKey].items) {
      state.data.roadmap[destQKey].items = [];
    }

    const clonedItem = {
      ...item,
      id: generateId('rm'),
      title: destQKey === sourceQKey ? `${item.title} (Copy)` : item.title,
      progress: 0,
      status: 'planned'
    };

    state.data.roadmap[destQKey].items.push(clonedItem);
    saveData();
    renderRoadmapBoard();
    renderHeaderStats();
    showToast(`Inisiatif "${clonedItem.title}" diduplikat ke ${destQKey}`);
  }

  // ==========================================================================
  // RENDERING ALL
  // ==========================================================================

  function renderAll() {
    renderHeaderStats();
    renderPlanTabs();
    renderTimelineGrid();
    renderSidebarGoalsPreview();
    renderRoadmapBoard();
    renderCalendar();
    renderGoalsList();
    renderItineraryPlanner();
    renderUserProfileNav();

    if (state.data.viewMode === 'roadmap') {
      switchViewMode('roadmap');
    } else if (state.data.viewMode === 'itinerary') {
      switchViewMode('itinerary');
    } else {
      switchViewMode('daily');
    }
  }

  function renderHeaderStats() {
    const activePlan = getActivePlan();
    let totalTasks = 0;
    if (activePlan.days) {
      Object.values(activePlan.days).forEach(tasks => {
        totalTasks += (tasks || []).length;
      });
    }
    const totalGoals = (state.data.goals || []).length;

    let totalYearTarget = 0;
    let totalRoadmapItems = 0;
    if (state.data.roadmap) {
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach(q => {
        const qData = state.data.roadmap[q];
        if (qData) {
          totalYearTarget += (qData.targetRupiah || 0);
          totalRoadmapItems += (qData.items || []).length;
        }
      });
    }

    let totalTrips = (state.data.trips || []).length;
    let totalActivities = 0;
    let totalExpense = 0;
    (state.data.trips || []).forEach(trip => {
      (trip.activities || []).forEach(act => {
        totalActivities++;
        totalExpense += (act.cost || 0);
      });
    });

    if (DOM.currentPlanLabelBadge) DOM.currentPlanLabelBadge.textContent = `Plan: ${activePlan.name}`;
    if (DOM.activePlanHeading) DOM.activePlanHeading.textContent = activePlan.name;
    if (DOM.totalTasksCount) DOM.totalTasksCount.textContent = totalTasks;
    if (DOM.totalGoalsCount) DOM.totalGoalsCount.textContent = totalGoals;
    if (DOM.headerGoalsBadge) DOM.headerGoalsBadge.textContent = totalGoals;
    if (DOM.totalYearTargetRupiah) DOM.totalYearTargetRupiah.textContent = formatRupiah(totalYearTarget);
    if (DOM.totalRoadmapItemsCount) DOM.totalRoadmapItemsCount.textContent = totalRoadmapItems;
    if (DOM.totalTripsCount) DOM.totalTripsCount.textContent = totalTrips;
    if (DOM.totalActivitiesCount) DOM.totalActivitiesCount.textContent = totalActivities;
    if (DOM.totalItineraryExpense) DOM.totalItineraryExpense.textContent = formatRupiah(totalExpense);
  }

  // ==========================================================================
  // DAILY TIMELINE RENDERING (With 5-Minute Break Indicators)
  // ==========================================================================

  function renderTimelineGrid() {
    if (!DOM.daysGrid) return;
    DOM.daysGrid.innerHTML = '';
    const activePlan = getActivePlan();
    const todayKey = getTodayDayKey();

    DAYS_OF_WEEK.forEach(day => {
      const isToday = day.key === todayKey;
      const tasks = (activePlan.days && activePlan.days[day.key]) ? activePlan.days[day.key] : [];

      tasks.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

      const colEl = document.createElement('div');
      colEl.className = `day-column ${isToday ? 'is-today' : ''}`;
      colEl.dataset.day = day.key;

      colEl.innerHTML = `
        <div class="day-col-header">
          <div class="day-col-title-wrap">
            <span class="day-col-name">${day.label}</span>
            ${isToday ? '<span class="day-pill-today">Hari Ini</span>' : ''}
          </div>
          <div class="day-col-actions">
            <span class="day-task-count-pill">${tasks.length} tugas</span>
            <button class="btn-day-add" title="Tambah Tugas di ${day.label}">+</button>
          </div>
        </div>
        <div class="day-col-body" id="colBody-${day.key}">
          <!-- Tasks & Rest Indicators -->
        </div>
      `;

      const colBody = colEl.querySelector(`#colBody-${day.key}`);

      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        colEl.classList.add('is-drag-target');
      });

      colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          colEl.classList.remove('is-drag-target');
        }
      });

      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('is-drag-target');
        try {
          const raw = e.dataTransfer.getData('text/plain');
          if (raw) {
            const dragData = JSON.parse(raw);
            if (dragData && dragData.taskId && dragData.sourceDayKey) {
              openDragActionModal(dragData.sourceDayKey, day.key, dragData.taskId);
            }
          }
        } catch (err) {
          console.error('Drop parse error', err);
        }
      });

      if (tasks.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'empty-day-state';
        emptyEl.innerHTML = `<span>+ Tambah Jadwal</span>`;
        emptyEl.addEventListener('click', () => openTaskModal(day.key));
        colBody.appendChild(emptyEl);
      } else {
        tasks.forEach((task, idx) => {
          // Check if there is a rest break before this task
          if (idx > 0) {
            const prevTask = tasks[idx - 1];
            const prevEndMins = timeToMinutes(prevTask.endTime);
            const curStartMins = timeToMinutes(task.startTime);
            const breakGap = curStartMins - prevEndMins;

            if (breakGap >= 5) {
              const breakEl = document.createElement('div');
              breakEl.className = 'break-indicator';
              breakEl.innerHTML = `
                <span><i class="fa-solid fa-mug-hot"></i> Istirahat ${breakGap} mnt</span>
                <span class="break-time-range">(${prevTask.endTime} - ${task.startTime})</span>
              `;
              colBody.appendChild(breakEl);
            }
          }

          const subitems = task.items && Array.isArray(task.items) ? task.items : [];
          const totalSubitems = subitems.length;
          const completedSubitems = subitems.filter(it => it.completed).length;
          const allSubitemsDone = totalSubitems > 0 && completedSubitems === totalSubitems;
          const subitemsPct = totalSubitems > 0 ? Math.round((completedSubitems / totalSubitems) * 100) : 0;

          let subitemsHtml = '';
          if (totalSubitems > 0) {
            subitemsHtml = `
              <div class="task-subitems-summary">
                <span class="task-subitems-badge ${allSubitemsDone ? 'all-done' : ''}">
                  <i class="fa-solid fa-list-check"></i> ${completedSubitems}/${totalSubitems} sub-item
                </span>
                <div class="task-subitems-track">
                  <div class="task-subitems-fill ${allSubitemsDone ? 'all-done' : ''}" style="width: ${subitemsPct}%"></div>
                </div>
              </div>
              <div class="task-subitems-list">
                ${subitems.map(sub => `
                  <div class="task-subitem-item ${sub.completed ? 'is-done' : ''}">
                    <input type="checkbox" class="subitem-checkbox" ${sub.completed ? 'checked' : ''} data-sub-id="${escapeHtml(sub.id)}" />
                    <span class="subitem-text">${escapeHtml(sub.text)}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }

          const card = document.createElement('div');
          card.className = `task-card color-${task.color || 'blue'} ${task.completed ? 'is-completed' : ''}`;
          card.dataset.taskId = task.id;
          card.dataset.day = day.key;
          card.setAttribute('draggable', 'true');
          card.title = 'Drag kartu ini ke hari lain untuk memindahkan / menduplikat';

          card.innerHTML = `
            <div class="task-card-top">
              <span class="task-time-pill">${escapeHtml(task.startTime)} - ${escapeHtml(task.endTime)}</span>
              <div class="task-hover-tools">
                <button class="tool-btn btn-dup-t" title="Duplikat Tugas"><i class="fa-regular fa-clone"></i></button>
                <button class="tool-btn btn-edit-t" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="tool-btn btn-del-t" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
            <div class="task-card-content">
              <input type="checkbox" class="custom-checkbox" ${task.completed ? 'checked' : ''} title="Tandai Selesai" />
              <span class="task-text">${escapeHtml(task.title)}</span>
            </div>
            ${subitemsHtml}
            <div class="task-card-footer">
              <span class="task-tag">${getCategoryLabel(task.category)}</span>
            </div>
          `;

          card.querySelectorAll('.subitem-checkbox').forEach(subChk => {
            subChk.addEventListener('click', (e) => e.stopPropagation());
            subChk.addEventListener('change', (e) => {
              e.stopPropagation();
              const subId = subChk.dataset.subId;
              toggleSubitemCompleted(day.key, task.id, subId, e.target.checked);
            });
          });

          card.addEventListener('dragstart', (e) => {
            card.classList.add('is-dragging');
            const payload = JSON.stringify({
              taskId: task.id,
              sourceDayKey: day.key
            });
            e.dataTransfer.setData('text/plain', payload);
            e.dataTransfer.effectAllowed = 'copyMove';
          });

          card.addEventListener('dragend', () => {
            card.classList.remove('is-dragging');
            document.querySelectorAll('.day-column').forEach(col => col.classList.remove('is-drag-target'));
          });

          const chk = card.querySelector('.custom-checkbox');
          chk.addEventListener('change', (e) => {
            toggleTaskCompleted(day.key, task.id, e.target.checked);
          });

          card.querySelector('.btn-dup-t').addEventListener('click', (e) => {
            e.stopPropagation();
            duplicateTask(day.key, task.id);
          });

          card.querySelector('.btn-edit-t').addEventListener('click', (e) => {
            e.stopPropagation();
            openTaskModal(day.key, task.id);
          });

          card.querySelector('.btn-del-t').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(day.key, task.id, task.title);
          });

          colBody.appendChild(card);
        });
      }

      colEl.querySelector('.btn-day-add').addEventListener('click', () => openTaskModal(day.key));
      DOM.daysGrid.appendChild(colEl);
    });
  }

  // ==========================================================================
  // TASK CRUD & SUB-ITEMS (1 Task : N Items)
  // ==========================================================================

  function renderModalTaskItems() {
    if (!DOM.taskModalItemsList) return;
    DOM.taskModalItemsList.innerHTML = '';
    const items = state.tempTaskItems || [];

    if (DOM.taskItemsCountBadge) {
      DOM.taskItemsCountBadge.textContent = `${items.length} item`;
    }

    if (items.length === 0) {
      DOM.taskModalItemsList.innerHTML = `
        <div style="text-align:center; padding: 12px 6px; color: var(--text-dim); font-size: 0.74rem;">
          Belum ada sub-item pekerjaan. Ketik di atas lalu klik Tambah.
        </div>
      `;
      return;
    }

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'task-modal-item-row';
      row.innerHTML = `
        <div class="task-modal-item-left">
          <input type="checkbox" class="subitem-checkbox" ${item.completed ? 'checked' : ''} title="Status Selesai" />
          <span class="task-modal-item-text ${item.completed ? 'is-done' : ''}">${escapeHtml(item.text)}</span>
        </div>
        <button type="button" class="btn-del-item" title="Hapus Sub-item"><i class="fa-solid fa-trash-can"></i></button>
      `;

      const chk = row.querySelector('.subitem-checkbox');
      chk.addEventListener('change', (e) => {
        item.completed = e.target.checked;
        renderModalTaskItems();
      });

      const delBtn = row.querySelector('.btn-del-item');
      delBtn.addEventListener('click', () => {
        state.tempTaskItems.splice(idx, 1);
        renderModalTaskItems();
      });

      DOM.taskModalItemsList.appendChild(row);
    });
  }

  function handleAddModalTaskItem() {
    if (!DOM.newTaskItemInput) return;
    const text = DOM.newTaskItemInput.value.trim();
    if (!text) return;

    if (!state.tempTaskItems) state.tempTaskItems = [];
    state.tempTaskItems.push({
      id: generateId('item'),
      text: text,
      completed: false
    });

    DOM.newTaskItemInput.value = '';
    renderModalTaskItems();
    DOM.newTaskItemInput.focus();
  }

  function openTaskModal(dayKey, taskId = null) {
    state.editingTaskId = taskId;
    DOM.taskEditId.value = taskId || '';
    DOM.taskDaySelect.value = dayKey || 'senin';

    if (taskId) {
      DOM.taskModalTitle.textContent = 'Edit Tugas Jadwal';
      const activePlan = getActivePlan();
      const task = (activePlan.days[dayKey] || []).find(t => t.id === taskId);
      if (task) {
        DOM.taskStartTime.value = task.startTime || '08:00';
        DOM.taskEndTime.value = task.endTime || '08:35';
        DOM.taskTitle.value = task.title || '';
        DOM.taskCategory.value = task.category || 'work';
        DOM.taskColor.value = task.color || 'blue';
        state.tempTaskItems = task.items && Array.isArray(task.items) ? JSON.parse(JSON.stringify(task.items)) : [];
      } else {
        state.tempTaskItems = [];
      }
    } else {
      DOM.taskModalTitle.textContent = 'Tambah Tugas Baru';
      const suggested = getSuggestedNextTimeSlot(dayKey);
      DOM.taskStartTime.value = suggested.startTime;
      DOM.taskEndTime.value = suggested.endTime;
      DOM.taskTitle.value = '';
      DOM.taskCategory.value = 'work';
      DOM.taskColor.value = 'blue';
      state.tempTaskItems = [];
    }

    if (DOM.newTaskItemInput) DOM.newTaskItemInput.value = '';
    renderModalTaskItems();

    DOM.taskModalOverlay.classList.add('is-active');
    setTimeout(() => DOM.taskTitle.focus(), 50);
  }

  function closeTaskModal() {
    DOM.taskModalOverlay.classList.remove('is-active');
    DOM.taskForm.reset();
    state.editingTaskId = null;
    state.tempTaskItems = [];
  }

  function handleTaskFormSubmit(e) {
    e.preventDefault();
    const activePlan = getActivePlan();
    const dayKey = DOM.taskDaySelect.value;
    const taskId = DOM.taskEditId.value;
    const startTime = DOM.taskStartTime.value;
    const endTime = DOM.taskEndTime.value;

    const validation = validateTaskTimeSlot(dayKey, startTime, endTime, taskId || null);
    if (!validation.valid) {
      showToast(validation.message, 'error');
      DOM.taskStartTime.focus();
      return;
    }

    const existingTask = taskId ? (activePlan.days[dayKey] || []).find(t => t.id === taskId) : null;
    const taskObj = {
      id: taskId || generateId('task'),
      startTime: startTime,
      endTime: endTime,
      title: DOM.taskTitle.value.trim(),
      category: DOM.taskCategory.value,
      color: DOM.taskColor.value,
      completed: existingTask ? existingTask.completed : false,
      items: (state.tempTaskItems || []).slice()
    };

    if (!activePlan.days[dayKey]) {
      activePlan.days[dayKey] = [];
    }

    if (taskId) {
      DAYS_OF_WEEK.forEach(d => {
        if (activePlan.days[d.key]) {
          activePlan.days[d.key] = activePlan.days[d.key].filter(t => t.id !== taskId);
        }
      });
      activePlan.days[dayKey].push(taskObj);
      showToast('Tugas berhasil diperbarui');
    } else {
      activePlan.days[dayKey].push(taskObj);
      showToast(`Tugas dijadwalkan pukul ${startTime} - ${endTime}`);
    }

    saveData();
    closeTaskModal();
    renderAll();
  }

  function deleteTask(dayKey, taskId, taskTitle = 'Tugas') {
    showConfirmDialog({
      title: 'Hapus Tugas?',
      message: `Apakah Anda yakin ingin menghapus "${escapeHtml(taskTitle)}"?`,
      icon: 'fa-solid fa-trash-can',
      confirmText: 'Ya, Hapus',
      isDanger: true,
      onConfirm: () => {
        const activePlan = getActivePlan();
        if (activePlan.days && activePlan.days[dayKey]) {
          activePlan.days[dayKey] = activePlan.days[dayKey].filter(t => t.id !== taskId);
          saveData();
          renderAll();
          showToast('Tugas berhasil dihapus');
        }
      }
    });
  }

  function toggleTaskCompleted(dayKey, taskId, isCompleted) {
    const activePlan = getActivePlan();
    if (activePlan.days && activePlan.days[dayKey]) {
      const task = activePlan.days[dayKey].find(t => t.id === taskId);
      if (task) {
        task.completed = isCompleted;
        if (task.items && Array.isArray(task.items)) {
          task.items.forEach(it => { it.completed = isCompleted; });
        }
        saveData();
        renderTimelineGrid();
        renderHeaderStats();
      }
    }
  }

  function toggleSubitemCompleted(dayKey, taskId, subitemId, isCompleted) {
    const activePlan = getActivePlan();
    if (!activePlan || !activePlan.days || !activePlan.days[dayKey]) return;
    const task = activePlan.days[dayKey].find(t => t.id === taskId);
    if (!task || !task.items) return;

    const subitem = task.items.find(it => it.id === subitemId);
    if (!subitem) return;

    subitem.completed = isCompleted;

    const allDone = task.items.length > 0 && task.items.every(it => it.completed);
    if (allDone && !task.completed) {
      task.completed = true;
      showToast(`Semua sub-item "${task.title}" selesai!`);
    } else if (!allDone && task.completed && !isCompleted) {
      task.completed = false;
    }

    saveData();
    renderTimelineGrid();
    renderHeaderStats();
  }

  function clearCompletedTasks() {
    const activePlan = getActivePlan();
    let completedCount = 0;
    DAYS_OF_WEEK.forEach(day => {
      if (activePlan.days[day.key]) {
        activePlan.days[day.key].forEach(t => {
          if (t.completed) {
            t.completed = false;
            if (t.items && Array.isArray(t.items)) {
              t.items.forEach(it => { it.completed = false; });
            }
            completedCount++;
          }
        });
      }
    });

    if (completedCount === 0) {
      showToast('Tidak ada tugas berstatus selesai');
      return;
    }

    showConfirmDialog({
      title: 'Reset Status Tugas?',
      message: `Hapus tanda centang selesai dari ${completedCount} tugas terjadwal?`,
      icon: 'fa-solid fa-broom',
      confirmText: 'Ya, Reset',
      isDanger: false,
      onConfirm: () => {
        DAYS_OF_WEEK.forEach(day => {
          if (activePlan.days[day.key]) {
            activePlan.days[day.key].forEach(t => {
              t.completed = false;
            });
          }
        });
        saveData();
        renderTimelineGrid();
        showToast(`Status ${completedCount} tugas di-reset`);
      }
    });
  }

  // ==========================================================================
  // MULTI-PLAN MANAGEMENT
  // ==========================================================================

  function renderPlanTabs() {
    if (!DOM.plansTabList) return;
    DOM.plansTabList.innerHTML = '';
    const activePlan = getActivePlan();

    state.data.plans.forEach((plan, index) => {
      let taskCount = 0;
      if (plan.days) {
        Object.values(plan.days).forEach(arr => taskCount += (arr || []).length);
      }

      const isActive = plan.id === activePlan.id;
      const itemEl = document.createElement('div');
      itemEl.className = `plan-item ${isActive ? 'active' : ''}`;
      itemEl.dataset.planId = plan.id;

      itemEl.innerHTML = `
        <div class="plan-item-info">
          <span class="plan-item-icon">${index === 0 ? '<i class="fa-solid fa-thumbtack"></i>' : '<i class="fa-solid fa-folder-closed"></i>'}</span>
          <span class="plan-item-name" title="${escapeHtml(plan.name)}">${escapeHtml(plan.name)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="plan-item-badge">${taskCount}</span>
          <div class="plan-item-tools">
            <button class="tool-btn btn-edit-plan" title="Ubah Nama Plan"><i class="fa-solid fa-pen-to-square"></i></button>
            ${state.data.plans.length > 1 ? `<button class="tool-btn btn-delete-plan" title="Hapus Plan"><i class="fa-solid fa-trash-can"></i></button>` : ''}
          </div>
        </div>
      `;

      itemEl.addEventListener('click', (e) => {
        if (e.target.closest('.tool-btn')) return;
        switchPlan(plan.id);
      });

      const editBtn = itemEl.querySelector('.btn-edit-plan');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditPlanModal(plan.id);
        });
      }

      const delBtn = itemEl.querySelector('.btn-delete-plan');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deletePlan(plan.id);
        });
      }

      DOM.plansTabList.appendChild(itemEl);
    });
  }

  function switchPlan(planId) {
    state.data.activePlanId = planId;
    saveData();
    renderAll();
    showToast(`Plan aktif: ${getActivePlan().name}`);
  }

  function openNewPlanModal() {
    state.editingPlanId = null;
    DOM.planEditId.value = '';
    DOM.planModalTitle.textContent = 'Buat Plan Baru';
    DOM.planNameInput.value = '';
    DOM.planTemplateGroup.style.display = 'block';

    DOM.planTemplateSelect.innerHTML = '<option value="blank">Kosong (Mulai dari awal)</option>';
    state.data.plans.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `Salin dari: ${p.name}`;
      DOM.planTemplateSelect.appendChild(opt);
    });

    DOM.planModalOverlay.classList.add('is-active');
    setTimeout(() => DOM.planNameInput.focus(), 50);
  }

  function openEditPlanModal(planId) {
    const plan = state.data.plans.find(p => p.id === planId);
    if (!plan) return;

    state.editingPlanId = planId;
    DOM.planEditId.value = planId;
    DOM.planModalTitle.textContent = 'Ubah Nama Plan';
    DOM.planNameInput.value = plan.name;
    DOM.planTemplateGroup.style.display = 'none';

    DOM.planModalOverlay.classList.add('is-active');
    setTimeout(() => DOM.planNameInput.focus(), 50);
  }

  function closePlanModal() {
    DOM.planModalOverlay.classList.remove('is-active');
    DOM.planForm.reset();
    state.editingPlanId = null;
  }

  function handlePlanFormSubmit(e) {
    e.preventDefault();
    const planName = DOM.planNameInput.value.trim();
    const planId = DOM.planEditId.value;

    if (!planName) return;

    if (planId) {
      const plan = state.data.plans.find(p => p.id === planId);
      if (plan) {
        plan.name = planName;
        showToast('Nama plan diperbarui');
      }
    } else {
      const templateId = DOM.planTemplateSelect.value;
      let newDays = { senin: [], selasa: [], rabu: [], kamis: [], jumat: [], sabtu: [], minggu: [] };

      if (templateId !== 'blank') {
        const sourcePlan = state.data.plans.find(p => p.id === templateId);
        if (sourcePlan && sourcePlan.days) {
          newDays = JSON.parse(JSON.stringify(sourcePlan.days));
          Object.keys(newDays).forEach(day => {
            newDays[day].forEach(task => {
              task.id = generateId('task');
              task.completed = false;
            });
          });
        }
      }

      const newPlan = {
        id: generateId('plan'),
        name: planName,
        days: newDays
      };

      state.data.plans.push(newPlan);
      state.data.activePlanId = newPlan.id;
      showToast(`Plan "${planName}" dibuat!`);
    }

    saveData();
    closePlanModal();
    renderAll();
  }

  function deletePlan(planId) {
    if (state.data.plans.length <= 1) {
      showToast('Minimal harus ada 1 plan!', 'error');
      return;
    }
    const plan = state.data.plans.find(p => p.id === planId);
    const planName = plan ? plan.name : '';

    showConfirmDialog({
      title: 'Hapus Plan Timeline?',
      message: `Seluruh jadwal di dalam plan "${escapeHtml(planName)}" akan dihapus permanen. Lanjutkan?`,
      icon: 'fa-solid fa-trash-can',
      confirmText: 'Ya, Hapus Plan',
      isDanger: true,
      onConfirm: () => {
        state.data.plans = state.data.plans.filter(p => p.id !== planId);
        if (state.data.activePlanId === planId) {
          state.data.activePlanId = state.data.plans[0].id;
        }
        saveData();
        renderAll();
        showToast('Plan berhasil dihapus');
      }
    });
  }

  // ==========================================================================
  // 1-YEAR ROADMAP 4-QUARTER BOARD ENGINE
  // ==========================================================================

  function renderRoadmapBoard() {
    if (!DOM.quartersGrid) return;
    DOM.quartersGrid.innerHTML = '';

    if (!state.data.roadmap) {
      state.data.roadmap = JSON.parse(JSON.stringify(DEFAULT_DATA.roadmap));
      saveData();
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentQKey = currentMonth <= 3 ? 'Q1' : currentMonth <= 6 ? 'Q2' : currentMonth <= 9 ? 'Q3' : 'Q4';

    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(qKey => {
      const meta = QUARTERS_META[qKey];
      const qData = state.data.roadmap[qKey] || { targetRupiah: meta.defaultTarget, strategy: '', items: [] };
      const isCurrentQ = qKey === currentQKey;
      const items = qData.items || [];

      items.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

      const displayMonths = qData.periodLabel || (qData.startDate && qData.endDate ? `${formatDateIndo(qData.startDate)} - ${formatDateIndo(qData.endDate)}` : meta.months);

      const colEl = document.createElement('div');
      colEl.className = `quarter-column ${isCurrentQ ? 'is-current-q' : ''}`;
      colEl.dataset.quarter = qKey;

      colEl.innerHTML = `
        <div class="quarter-col-header">
          <div class="quarter-top-info">
            <div class="quarter-title-wrap">
              <span class="quarter-title">${meta.label}</span>
              ${isCurrentQ ? '<span class="day-pill-today">Aktif</span>' : ''}
              <span class="quarter-months-badge is-clickable" title="Klik untuk ubah tanggal & target kuartal">${escapeHtml(displayMonths)}</span>
            </div>
            <button class="btn-edit-quarter" title="Edit Target & Tanggal Kuartal"><i class="fa-solid fa-pen-to-square"></i> Target</button>
          </div>

          <div class="quarter-financial-pill">
            <span class="financial-label"><i class="fa-solid fa-bullseye"></i> Target Goals (Rupiah):</span>
            <span class="financial-value">${formatRupiah(qData.targetRupiah || 0)}</span>
          </div>

          <div class="quarter-strategy-box">
            <span class="strategy-box-label"><i class="fa-solid fa-clipboard-list"></i> Snapshot Rencana & Strategi</span>
            <span class="strategy-box-text">${escapeHtml(qData.strategy || 'Belum ada catatan strategi untuk kuartal ini.')}</span>
          </div>
        </div>

        <div class="quarter-col-body" id="qBody-${qKey}">
          <!-- Milestones and Initiatives -->
        </div>
      `;

      // Drag over and drop on quarter column
      colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        colEl.classList.add('is-drag-target');
      });

      colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          colEl.classList.remove('is-drag-target');
        }
      });

      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('is-drag-target');
        try {
          const raw = e.dataTransfer.getData('text/plain');
          if (raw) {
            const dragData = JSON.parse(raw);
            if (dragData && dragData.roadmapItemId && dragData.sourceQuarterKey) {
              if (dragData.sourceQuarterKey === qKey) {
                duplicateRoadmapItem(dragData.sourceQuarterKey, dragData.roadmapItemId);
              } else {
                openRoadmapDragActionModal(dragData.sourceQuarterKey, qKey, dragData.roadmapItemId);
              }
            }
          }
        } catch (err) {
          console.error('Roadmap drop error:', err);
        }
      });

      const qBody = colEl.querySelector(`#qBody-${qKey}`);

      if (items.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'empty-day-state';
        emptyEl.innerHTML = `<span>+ Tambah Inisiatif di ${qKey}</span>`;
        emptyEl.addEventListener('click', () => openRoadmapItemModal(qKey));
        qBody.appendChild(emptyEl);
      } else {
        items.forEach(item => {
          const card = document.createElement('div');
          card.className = `roadmap-card status-${item.status || 'planned'}`;
          card.dataset.itemId = item.id;
          card.dataset.quarterKey = qKey;
          card.setAttribute('draggable', 'true');
          card.title = 'Drag inisiatif ini ke kuartal lain untuk memindahkan / menduplikat';

          const durationText = calculateDaysDuration(item.startDate, item.finishDate);
          const statusLabels = {
            planned: '<i class="fa-regular fa-calendar-days"></i> Planned',
            in_progress: '<i class="fa-solid fa-person-running"></i> In Progress',
            completed: '<i class="fa-regular fa-circle-check"></i> Completed'
          };

          card.innerHTML = `
            <div class="roadmap-card-top">
              <span class="roadmap-card-title">${escapeHtml(item.title)}</span>
              <div class="roadmap-card-actions">
                <button class="tool-btn btn-dup-rm" title="Duplikat Inisiatif"><i class="fa-regular fa-clone"></i></button>
                <button class="tool-btn btn-edit-rm" title="Edit Inisiatif"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="tool-btn btn-del-rm" title="Hapus Inisiatif"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </div>

            <div class="roadmap-timeframe-bar">
              <div class="timeframe-range">
                <span><i class="fa-regular fa-calendar-plus"></i> ${formatDateIndo(item.startDate)}</span>
                <span class="timeframe-arrow">&rarr;</span>
                <span><i class="fa-regular fa-calendar-check"></i> ${formatDateIndo(item.finishDate)}</span>
              </div>
              <span class="timeframe-duration">${durationText}</span>
            </div>

            <div class="progress-info-row">
              <span class="roadmap-target-val"><i class="fa-solid fa-sack-dollar"></i> ${formatRupiah(item.targetRupiah || 0)}</span>
              <span class="status-badge ${item.status || 'planned'}">${statusLabels[item.status] || item.status} (${item.progress || 0}%)</span>
            </div>

            <div class="progress-track">
              <div class="progress-bar-fill ${item.progress >= 100 ? 'fill-completed' : ''}" style="width: ${item.progress || 0}%"></div>
            </div>

            ${item.strategy ? `
              <div class="roadmap-strategy-snippet">
                <strong>Pilar Eksekusi:</strong> ${escapeHtml(item.strategy)}
              </div>
            ` : ''}
          `;

          // Roadmap Card Drag and Drop
          card.addEventListener('dragstart', (e) => {
            card.classList.add('is-dragging');
            const payload = JSON.stringify({
              roadmapItemId: item.id,
              sourceQuarterKey: qKey
            });
            e.dataTransfer.setData('text/plain', payload);
            e.dataTransfer.effectAllowed = 'copyMove';
          });

          card.addEventListener('dragend', () => {
            card.classList.remove('is-dragging');
            document.querySelectorAll('.quarter-column').forEach(col => col.classList.remove('is-drag-target'));
          });

          card.querySelector('.btn-dup-rm').addEventListener('click', (e) => {
            e.stopPropagation();
            duplicateRoadmapItem(qKey, item.id);
          });

          card.querySelector('.btn-edit-rm').addEventListener('click', (e) => {
            e.stopPropagation();
            openRoadmapItemModal(qKey, item.id);
          });

          card.querySelector('.btn-del-rm').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteRoadmapItem(qKey, item.id, item.title);
          });

          qBody.appendChild(card);
        });

        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-quarter-item';
        addBtn.innerHTML = `<span>+ Tambah Inisiatif ${qKey}</span>`;
        addBtn.addEventListener('click', () => openRoadmapItemModal(qKey));
        qBody.appendChild(addBtn);
      }

      colEl.querySelector('.btn-edit-quarter').addEventListener('click', () => {
        openQuarterMetaModal(qKey);
      });

      const badge = colEl.querySelector('.quarter-months-badge');
      if (badge) {
        badge.addEventListener('click', () => openQuarterMetaModal(qKey));
      }

      DOM.quartersGrid.appendChild(colEl);
    });
  }

  function moveRoadmapItem(sourceQKey, targetQKey, itemId) {
    if (!state.data.roadmap || !state.data.roadmap[sourceQKey]) return;
    if (sourceQKey === targetQKey) return;

    const sourceItems = state.data.roadmap[sourceQKey].items || [];
    const itemIdx = sourceItems.findIndex(it => it.id === itemId);
    if (itemIdx === -1) return;

    const [item] = sourceItems.splice(itemIdx, 1);

    if (!state.data.roadmap[targetQKey]) {
      const meta = QUARTERS_META[targetQKey];
      state.data.roadmap[targetQKey] = {
        targetRupiah: meta.defaultTarget,
        strategy: '',
        startDate: meta.defaultStart,
        endDate: meta.defaultEnd,
        periodLabel: '',
        items: []
      };
    }
    if (!state.data.roadmap[targetQKey].items) {
      state.data.roadmap[targetQKey].items = [];
    }

    state.data.roadmap[targetQKey].items.push(item);

    saveData();
    renderRoadmapBoard();
    renderHeaderStats();
    showToast(`Inisiatif "${item.title}" dipindahkan ke ${targetQKey}`);
  }

  function openRoadmapItemModal(quarterKey = 'Q1', itemId = null) {
    state.editingRoadmapId = itemId;
    state.editingQuarterKey = quarterKey;

    DOM.roadmapEditId.value = itemId || '';
    DOM.roadmapQuarterSelect.value = quarterKey;

    if (itemId) {
      DOM.roadmapModalTitle.textContent = 'Edit Inisiatif Roadmap';
      const qData = state.data.roadmap[quarterKey];
      const item = (qData.items || []).find(i => i.id === itemId);
      if (item) {
        DOM.roadmapTitle.value = item.title || '';
        DOM.roadmapStartDate.value = item.startDate || '';
        DOM.roadmapFinishDate.value = item.finishDate || '';
        DOM.roadmapTargetRupiah.value = item.targetRupiah || 0;
        DOM.formattedRupiahPreview.textContent = formatRupiah(item.targetRupiah || 0);
        DOM.roadmapProgressRange.value = item.progress || 0;
        DOM.progressRangeValue.textContent = `${item.progress || 0}%`;
        DOM.roadmapStatusSelect.value = item.status || 'in_progress';
        DOM.roadmapStrategy.value = item.strategy || '';
      }
    } else {
      DOM.roadmapModalTitle.textContent = 'Tambah Inisiatif Roadmap';
      DOM.roadmapTitle.value = '';
      DOM.roadmapStartDate.value = getTodayFormatted(0);
      DOM.roadmapFinishDate.value = getTodayFormatted(30);
      DOM.roadmapTargetRupiah.value = 100000000;
      DOM.formattedRupiahPreview.textContent = formatRupiah(100000000);
      DOM.roadmapProgressRange.value = 50;
      DOM.progressRangeValue.textContent = '50%';
      DOM.roadmapStatusSelect.value = 'in_progress';
      DOM.roadmapStrategy.value = '';
    }

    DOM.roadmapItemModalOverlay.classList.add('is-active');
    setTimeout(() => DOM.roadmapTitle.focus(), 50);
  }

  function closeRoadmapItemModal() {
    DOM.roadmapItemModalOverlay.classList.remove('is-active');
    DOM.roadmapItemForm.reset();
    state.editingRoadmapId = null;
  }

  function handleRoadmapItemFormSubmit(e) {
    e.preventDefault();
    const qKey = DOM.roadmapQuarterSelect.value;
    const itemId = DOM.roadmapEditId.value;
    const oldQKey = state.editingQuarterKey;

    const itemObj = {
      id: itemId || generateId('rm'),
      title: DOM.roadmapTitle.value.trim(),
      startDate: DOM.roadmapStartDate.value,
      finishDate: DOM.roadmapFinishDate.value,
      targetRupiah: parseFloat(DOM.roadmapTargetRupiah.value) || 0,
      progress: parseInt(DOM.roadmapProgressRange.value, 10) || 0,
      status: DOM.roadmapStatusSelect.value,
      strategy: DOM.roadmapStrategy.value.trim(),
      color: 'purple'
    };

    if (!state.data.roadmap[qKey]) {
      state.data.roadmap[qKey] = { targetRupiah: 250000000, strategy: '', items: [] };
    }

    if (itemId) {
      if (oldQKey && oldQKey !== qKey && state.data.roadmap[oldQKey]) {
        state.data.roadmap[oldQKey].items = state.data.roadmap[oldQKey].items.filter(i => i.id !== itemId);
      }
      state.data.roadmap[qKey].items = state.data.roadmap[qKey].items.filter(i => i.id !== itemId);
      state.data.roadmap[qKey].items.push(itemObj);
      showToast('Inisiatif roadmap diperbarui');
    } else {
      state.data.roadmap[qKey].items.push(itemObj);
      showToast('Inisiatif baru ditambahkan');
    }

    saveData();
    closeRoadmapItemModal();
    renderAll();
  }

  function deleteRoadmapItem(qKey, itemId, itemTitle = 'Inisiatif') {
    showConfirmDialog({
      title: 'Hapus Inisiatif Roadmap?',
      message: `Hapus inisiatif "${escapeHtml(itemTitle)}" dari ${qKey}?`,
      icon: 'fa-solid fa-trash-can',
      confirmText: 'Ya, Hapus',
      isDanger: true,
      onConfirm: () => {
        if (state.data.roadmap[qKey] && state.data.roadmap[qKey].items) {
          state.data.roadmap[qKey].items = state.data.roadmap[qKey].items.filter(i => i.id !== itemId);
          saveData();
          renderAll();
          showToast('Inisiatif roadmap dihapus');
        }
      }
    });
  }

  function openQuarterMetaModal(qKey) {
    state.editingQuarterKey = qKey;
    const meta = QUARTERS_META[qKey];
    const qData = state.data.roadmap[qKey] || { targetRupiah: meta.defaultTarget, strategy: '', items: [] };

    DOM.quarterMetaKey.value = qKey;
    DOM.quarterMetaModalTitle.textContent = `Target & Periode ${meta.label}`;
    DOM.quarterMetaTargetRupiah.value = qData.targetRupiah || 0;
    DOM.quarterRupiahPreview.textContent = formatRupiah(qData.targetRupiah || 0);
    DOM.quarterMetaStrategy.value = qData.strategy || '';

    // Dynamic Quarter Dates
    if (DOM.quarterMetaStartDate) {
      DOM.quarterMetaStartDate.value = qData.startDate || meta.defaultStart || '';
    }
    if (DOM.quarterMetaEndDate) {
      DOM.quarterMetaEndDate.value = qData.endDate || meta.defaultEnd || '';
    }
    if (DOM.quarterMetaPeriodLabel) {
      DOM.quarterMetaPeriodLabel.value = qData.periodLabel || '';
    }

    // Toggle cascade hint for Q1
    if (DOM.quarterQ1CascadeHint) {
      DOM.quarterQ1CascadeHint.style.display = (qKey === 'Q1') ? 'block' : 'none';
    }

    DOM.quarterMetaModalOverlay.classList.add('is-active');
    setTimeout(() => DOM.quarterMetaTargetRupiah.focus(), 50);
  }

  function closeQuarterMetaModal() {
    DOM.quarterMetaModalOverlay.classList.remove('is-active');
    DOM.quarterMetaForm.reset();
    state.editingQuarterKey = null;
  }

  // Sequential Cascade: Automatically adjust Q2, Q3, and Q4 dates from Q1
  function cascadeQuarterDatesFromQ1(q1Start, q1End) {
    if (!q1Start || !q1End) return;
    const s1 = new Date(q1Start + 'T00:00:00');
    const e1 = new Date(q1End + 'T00:00:00');
    if (isNaN(s1.getTime()) || isNaN(e1.getTime()) || e1 <= s1) return;

    const diffMs = e1.getTime() - s1.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    const toISO = (d) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const s2 = new Date(e1.getTime() + dayMs);
    const e2 = new Date(s2.getTime() + diffMs);

    const s3 = new Date(e2.getTime() + dayMs);
    const e3 = new Date(s3.getTime() + diffMs);

    const s4 = new Date(e3.getTime() + dayMs);
    const e4 = new Date(s4.getTime() + diffMs);

    const cascades = [
      { key: 'Q2', start: toISO(s2), end: toISO(e2) },
      { key: 'Q3', start: toISO(s3), end: toISO(e3) },
      { key: 'Q4', start: toISO(s4), end: toISO(e4) }
    ];

    cascades.forEach(({ key, start, end }) => {
      if (!state.data.roadmap[key]) {
        const meta = QUARTERS_META[key];
        state.data.roadmap[key] = {
          targetRupiah: meta.defaultTarget,
          strategy: '',
          startDate: start,
          endDate: end,
          periodLabel: '',
          items: []
        };
      } else {
        state.data.roadmap[key].startDate = start;
        state.data.roadmap[key].endDate = end;
      }
    });
  }

  function handleQuarterMetaFormSubmit(e) {
    e.preventDefault();
    const qKey = DOM.quarterMetaKey.value;
    if (!state.data.roadmap[qKey]) {
      const meta = QUARTERS_META[qKey];
      state.data.roadmap[qKey] = {
        targetRupiah: meta.defaultTarget,
        strategy: '',
        startDate: meta.defaultStart,
        endDate: meta.defaultEnd,
        periodLabel: '',
        items: []
      };
    }

    state.data.roadmap[qKey].targetRupiah = parseFloat(DOM.quarterMetaTargetRupiah.value) || 0;
    state.data.roadmap[qKey].strategy = DOM.quarterMetaStrategy.value.trim();

    if (DOM.quarterMetaStartDate) {
      state.data.roadmap[qKey].startDate = DOM.quarterMetaStartDate.value;
    }
    if (DOM.quarterMetaEndDate) {
      state.data.roadmap[qKey].endDate = DOM.quarterMetaEndDate.value;
    }
    if (DOM.quarterMetaPeriodLabel) {
      state.data.roadmap[qKey].periodLabel = DOM.quarterMetaPeriodLabel.value.trim();
    }

    let cascadeMsg = '';
    if (qKey === 'Q1') {
      const q1Start = DOM.quarterMetaStartDate ? DOM.quarterMetaStartDate.value : null;
      const q1End = DOM.quarterMetaEndDate ? DOM.quarterMetaEndDate.value : null;
      if (q1Start && q1End) {
        cascadeQuarterDatesFromQ1(q1Start, q1End);
        cascadeMsg = ' (Jadwal Kuartal 2, 3, dan 4 telah diselaraskan otomatis)';
      }
    }

    saveData();
    closeQuarterMetaModal();
    renderAll();
    showToast(`Target & tanggal ${qKey} berhasil disimpan!${cascadeMsg}`);
  }

  // ==========================================================================
  // GOALS & CALENDAR ENGINE
  // ==========================================================================

  function renderSidebarGoalsPreview() {
    if (!DOM.sidebarGoalsPreview) return;
    DOM.sidebarGoalsPreview.innerHTML = '';
    const goals = (state.data.goals || []).slice(0, 4);

    if (goals.length === 0) {
      DOM.sidebarGoalsPreview.innerHTML = `
        <div style="font-size:0.72rem; color:var(--text-dim); text-align:center; padding:10px;">
          Belum ada target aktif
        </div>
      `;
      return;
    }

    goals.forEach(g => {
      const el = document.createElement('div');
      el.className = 'mini-goal-item';
      el.innerHTML = `
        <span class="p-dot dot-${g.priority}"></span>
        <span class="mini-goal-title" title="${escapeHtml(g.title)}">${escapeHtml(g.title)}</span>
        <span class="mini-goal-date">${g.date.slice(5)}</span>
      `;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        state.calSelectedDate = g.date;
        openGoalsModal();
      });
      DOM.sidebarGoalsPreview.appendChild(el);
    });
  }

  function renderCalendar() {
    if (!DOM.calendarGrid) return;
    const year = state.calCurrentDate.getFullYear();
    const month = state.calCurrentDate.getMonth();

    if (DOM.calMonthYearLabel) {
      DOM.calMonthYearLabel.textContent = `${MONTH_NAMES[month]} ${year}`;
    }
    DOM.calendarGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const todayStr = getTodayFormatted(0);

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dateNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dateNum);
      const dateStr = formatDateToISO(prevDate);
      DOM.calendarGrid.appendChild(createCalCell(dateNum, dateStr, true));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const curDate = new Date(year, month, day);
      const dateStr = formatDateToISO(curDate);
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === state.calSelectedDate;
      DOM.calendarGrid.appendChild(createCalCell(day, dateStr, false, isToday, isSelected));
    }

    const totalCells = DOM.calendarGrid.children.length;
    const remaining = (totalCells <= 35 ? 35 : 42) - totalCells;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = formatDateToISO(nextDate);
      DOM.calendarGrid.appendChild(createCalCell(i, dateStr, true));
    }
  }

  function createCalCell(dayNum, dateStr, isOutside, isToday = false, isSelected = false) {
    const cell = document.createElement('div');
    cell.className = `cal-day-cell ${isOutside ? 'is-outside' : ''} ${isToday ? 'is-today-cell' : ''} ${isSelected ? 'is-selected-cell' : ''}`;
    cell.dataset.date = dateStr;

    const goalsOnDate = (state.data.goals || []).filter(g => g.date === dateStr);

    let dotsHtml = '';
    if (goalsOnDate.length > 0) {
      dotsHtml = `<div class="cal-dots-row">` +
        goalsOnDate.slice(0, 3).map(g => `<span class="p-dot dot-${g.priority || 'medium'}"></span>`).join('') +
        (goalsOnDate.length > 3 ? `<span style="font-size:7px; color:var(--text-dim);">+</span>` : '') +
        `</div>`;
    }

    cell.innerHTML = `
      <span class="cal-num">${dayNum}</span>
      ${dotsHtml}
    `;

    cell.addEventListener('click', () => {
      state.calSelectedDate = dateStr;
      if (DOM.goalDate) DOM.goalDate.value = dateStr;
      renderCalendar();
      renderGoalsList();
    });

    if (goalsOnDate.length > 0) {
      cell.addEventListener('mouseenter', (e) => showPopover(e, dateStr, goalsOnDate));
      cell.addEventListener('mousemove', (e) => updatePopoverPos(e));
      cell.addEventListener('mouseleave', () => hidePopover());
    }

    return cell;
  }

  function showPopover(e, dateStr, goals) {
    if (!DOM.calendarTooltip) return;
    const dateObj = new Date(dateStr + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    if (DOM.tooltipHeader) DOM.tooltipHeader.innerHTML = `<i class="fa-solid fa-bullseye"></i> ${formattedDate}`;
    
    let contentHtml = '';
    goals.forEach(goal => {
      contentHtml += `
        <div class="popover-goal-item">
          <div class="popover-goal-name">
            <span class="p-dot dot-${goal.priority}"></span>
            <span>${escapeHtml(goal.title)}</span>
          </div>
          ${goal.description ? `<div class="popover-goal-desc">${escapeHtml(goal.description)}</div>` : ''}
        </div>
      `;
    });

    if (DOM.tooltipBody) DOM.tooltipBody.innerHTML = contentHtml;
    DOM.calendarTooltip.classList.add('is-visible');
    updatePopoverPos(e);
  }

  function updatePopoverPos(e) {
    const tooltip = DOM.calendarTooltip;
    if (!tooltip) return;
    const padding = 12;
    let x = e.clientX + padding;
    let y = e.clientY + padding;

    if (x + 280 > window.innerWidth) {
      x = e.clientX - 280 - padding;
    }
    if (y + 160 > window.innerHeight) {
      y = e.clientY - 160 - padding;
    }

    tooltip.style.left = `${Math.max(10, x)}px`;
    tooltip.style.top = `${Math.max(10, y)}px`;
  }

  function hidePopover() {
    if (DOM.calendarTooltip) DOM.calendarTooltip.classList.remove('is-visible');
  }

  function renderGoalsList() {
    if (!DOM.goalsListItems) return;
    DOM.goalsListItems.innerHTML = '';
    const goals = state.data.goals || [];
    goals.sort((a, b) => a.date.localeCompare(b.date));

    if (DOM.monthGoalsCount) DOM.monthGoalsCount.textContent = `${goals.length} target`;

    if (goals.length === 0) {
      DOM.goalsListItems.innerHTML = `
        <div style="text-align:center; padding: 15px; color: var(--text-dim); font-size: 0.76rem;">
          Belum ada target yang dibuat
        </div>
      `;
      return;
    }

    goals.forEach(goal => {
      const itemEl = document.createElement('div');
      itemEl.className = 'goal-record-card';
      if (goal.date === state.calSelectedDate) {
        itemEl.style.borderColor = 'var(--primary)';
      }

      itemEl.innerHTML = `
        <div class="record-left">
          <span class="p-dot dot-${goal.priority}"></span>
          <div class="record-text">
            <span class="record-title" title="${escapeHtml(goal.title)}">${escapeHtml(goal.title)}</span>
            <span class="record-date"><i class="fa-regular fa-calendar-days"></i> ${goal.date}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <button class="tool-btn btn-edit-g" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="tool-btn btn-del-g" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      itemEl.querySelector('.btn-edit-g').addEventListener('click', () => openEditGoal(goal));
      itemEl.querySelector('.btn-del-g').addEventListener('click', () => deleteGoal(goal.id, goal.title));

      DOM.goalsListItems.appendChild(itemEl);
    });
  }

  function openGoalsModal() {
    if (DOM.goalDate) DOM.goalDate.value = state.calSelectedDate || getTodayFormatted(0);
    resetGoalForm();
    if (DOM.goalsModalOverlay) DOM.goalsModalOverlay.classList.add('is-active');
    renderCalendar();
    renderGoalsList();
  }

  function closeGoalsModal() {
    if (DOM.goalsModalOverlay) DOM.goalsModalOverlay.classList.remove('is-active');
    hidePopover();
  }

  function resetGoalForm() {
    state.editingGoalId = null;
    if (DOM.goalEditId) DOM.goalEditId.value = '';
    if (DOM.goalTitle) DOM.goalTitle.value = '';
    if (DOM.goalDescription) DOM.goalDescription.value = '';
    if (DOM.goalPriority) DOM.goalPriority.value = 'medium';
    if (DOM.goalFormHeading) DOM.goalFormHeading.innerHTML = '<i class="fa-solid fa-sparkles"></i> Tambah Target / Goal';
    const submitBtn = document.getElementById('saveGoalBtn');
    if (submitBtn) submitBtn.textContent = 'Simpan Target';
  }

  function openEditGoal(goal) {
    state.editingGoalId = goal.id;
    if (DOM.goalEditId) DOM.goalEditId.value = goal.id;
    if (DOM.goalTitle) DOM.goalTitle.value = goal.title;
    if (DOM.goalDate) DOM.goalDate.value = goal.date;
    if (DOM.goalPriority) DOM.goalPriority.value = goal.priority;
    if (DOM.goalDescription) DOM.goalDescription.value = goal.description || '';
    if (DOM.goalFormHeading) DOM.goalFormHeading.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Target';
    const submitBtn = document.getElementById('saveGoalBtn');
    if (submitBtn) submitBtn.textContent = 'Perbarui Target';
    if (DOM.goalTitle) DOM.goalTitle.focus();
  }

  function handleGoalFormSubmit(e) {
    e.preventDefault();
    const title = DOM.goalTitle.value.trim();
    const date = DOM.goalDate.value;
    const priority = DOM.goalPriority.value;
    const description = DOM.goalDescription.value.trim();
    const goalId = DOM.goalEditId.value;

    if (!title || !date) return;
    if (!state.data.goals) state.data.goals = [];

    if (goalId) {
      const goal = state.data.goals.find(g => g.id === goalId);
      if (goal) {
        goal.title = title;
        goal.date = date;
        goal.priority = priority;
        goal.description = description;
        showToast('Target diperbarui');
      }
    } else {
      const newGoal = {
        id: generateId('goal'),
        title,
        date,
        priority,
        description,
        completed: false
      };
      state.data.goals.push(newGoal);
      showToast('Target baru ditambahkan');
    }

    saveData();
    resetGoalForm();
    renderAll();
  }

  function deleteGoal(goalId, goalTitle = 'Target') {
    showConfirmDialog({
      title: 'Hapus Target?',
      message: `Hapus target "${escapeHtml(goalTitle)}" dari kalender goals?`,
      icon: 'fa-solid fa-bullseye',
      confirmText: 'Ya, Hapus',
      isDanger: true,
      onConfirm: () => {
        state.data.goals = (state.data.goals || []).filter(g => g.id !== goalId);
        saveData();
        renderAll();
        showToast('Target berhasil dihapus');
      }
    });
  }

  // ==========================================================================
  // ITINERARY PLANNER & TRAVEL LOGIC (TRIPS, DAYS, ACTIVITIES, SHARE & UNDO)
  // ==========================================================================

  function getDaysBetweenDates(startStr, endStr) {
    if (!startStr || !endStr) return [];
    const start = new Date(startStr);
    const end = new Date(endStr);
    const days = [];
    let current = new Date(start);
    let dayNum = 1;

    while (current <= end) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayIndex = current.getDay();
      const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayIndex];
      
      days.push({
        dayNumber: dayNum,
        date: dateStr,
        dayName: dayName,
        formattedDate: formatDateIndo(dateStr)
      });

      current.setDate(current.getDate() + 1);
      dayNum++;
    }
    return days;
  }

  function getTripStatus(startStr, endStr) {
    const today = getTodayFormatted(0);
    if (today < startStr) return 'upcoming';
    if (today > endStr) return 'completed';
    return 'ongoing';
  }

  function getTripStatusMeta(status) {
    switch (status) {
      case 'ongoing':
        return { label: 'Sedang Berjalan', className: 'status-ongoing' };
      case 'completed':
        return { label: 'Selesai', className: 'status-completed' };
      default:
        return { label: 'Mendatang', className: 'status-upcoming' };
    }
  }

  function getTripIconHTML(iconKey) {
    const map = {
      'business': '<i class="fa-solid fa-briefcase"></i>',
      'plane': '<i class="fa-solid fa-plane-departure"></i>',
      'beach': '<i class="fa-solid fa-umbrella-beach"></i>',
      'city': '<i class="fa-solid fa-city"></i>',
      'mountain': '<i class="fa-solid fa-mountain-sun"></i>',
      'culture': '<i class="fa-solid fa-torii-gate"></i>',
      'roadtrip': '<i class="fa-solid fa-car-side"></i>',
      'culinary': '<i class="fa-solid fa-utensils"></i>',
      'hotel': '<i class="fa-solid fa-hotel"></i>',
      'island': '<i class="fa-solid fa-sailboat"></i>',
      'camping': '<i class="fa-solid fa-campground"></i>',
      'themepark': '<i class="fa-solid fa-ticket"></i>',
      // Legacy emoji mappings
      '💼': '<i class="fa-solid fa-briefcase"></i>',
      '🏖️': '<i class="fa-solid fa-umbrella-beach"></i>',
      '🗼': '<i class="fa-solid fa-city"></i>',
      '🏔️': '<i class="fa-solid fa-mountain-sun"></i>',
      '⛩️': '<i class="fa-solid fa-torii-gate"></i>',
      '🌴': '<i class="fa-solid fa-sailboat"></i>',
      '⛺': '<i class="fa-solid fa-campground"></i>',
      '🚗': '<i class="fa-solid fa-car-side"></i>',
      '🍜': '<i class="fa-solid fa-utensils"></i>',
      '🏰': '<i class="fa-solid fa-landmark"></i>',
      '✈️': '<i class="fa-solid fa-plane-departure"></i>',
      '🎡': '<i class="fa-solid fa-ticket"></i>'
    };
    return map[iconKey] || '<i class="fa-solid fa-plane-departure"></i>';
  }

  function getTripCountdownText(startStr, endStr) {
    const today = new Date(getTodayFormatted(0));
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (today < start) {
      const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
      return `<i class="fa-solid fa-hourglass-half"></i> ${diff} Hari Lagi`;
    } else if (today > end) {
      return `<i class="fa-regular fa-circle-check"></i> Selesai`;
    } else {
      return `<i class="fa-solid fa-person-walking-luggage"></i> Berlangsung`;
    }
  }

  function getCategoryMeta(cat) {
    const map = {
      sightseeing: { label: 'Wisata & Alam', icon: '<i class="fa-solid fa-torii-gate"></i>', className: 'cat-sightseeing' },
      culinary: { label: 'Kuliner & Kafe', icon: '<i class="fa-solid fa-utensils"></i>', className: 'cat-culinary' },
      transport: { label: 'Transportasi', icon: '<i class="fa-solid fa-train-subway"></i>', className: 'cat-transport' },
      hotel: { label: 'Hotel & Inap', icon: '<i class="fa-solid fa-hotel"></i>', className: 'cat-hotel' },
      shopping: { label: 'Belanja', icon: '<i class="fa-solid fa-bag-shopping"></i>', className: 'cat-shopping' },
      activity: { label: 'Atraksi & Wahana', icon: '<i class="fa-solid fa-ticket"></i>', className: 'cat-activity' },
      relax: { label: 'Santai & Bebas', icon: '<i class="fa-solid fa-mug-hot"></i>', className: 'cat-relax' }
    };
    return map[cat] || { label: 'Aktivitas', icon: '<i class="fa-solid fa-location-dot"></i>', className: 'cat-activity' };
  }

  function calculateDurationMinutes(start, end) {
    if (!start || !end) return '';
    const diff = timeToMinutes(end) - timeToMinutes(start);
    if (diff <= 0) return '';
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h > 0 && m > 0) return `${h} jam ${m} mnt`;
    if (h > 0) return `${h} jam`;
    return `${m} menit`;
  }

  function renderItineraryPlanner() {
    if (!state.data.trips) state.data.trips = [];

    if (state.data.currentItinerarySubView === 'detail' && state.data.activeTripId) {
      const trip = state.data.trips.find(t => t.id === state.data.activeTripId);
      if (trip) {
        if (DOM.itineraryDashboardView) DOM.itineraryDashboardView.style.display = 'none';
        if (DOM.itineraryDetailView) DOM.itineraryDetailView.style.display = 'flex';
        renderTripDetail(trip);
        return;
      }
    }

    if (DOM.itineraryDashboardView) DOM.itineraryDashboardView.style.display = 'flex';
    if (DOM.itineraryDetailView) DOM.itineraryDetailView.style.display = 'none';
    renderTripsDashboard();
  }

  function renderTripsDashboard() {
    if (!DOM.tripsGridContainer) return;
    DOM.tripsGridContainer.innerHTML = '';

    const filter = state.data.tripFilter || 'all';
    const searchQuery = (DOM.tripSearchInput ? DOM.tripSearchInput.value : '').toLowerCase().trim();

    let filteredTrips = (state.data.trips || []).filter(trip => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      if (filter !== 'all' && status !== filter) return false;

      if (searchQuery) {
        const titleMatch = (trip.title || '').toLowerCase().includes(searchQuery);
        const tagMatch = (trip.tag || '').toLowerCase().includes(searchQuery);
        const notesMatch = (trip.notes || '').toLowerCase().includes(searchQuery);
        const activityMatch = (trip.activities || []).some(a => (a.title || '').toLowerCase().includes(searchQuery));
        if (!titleMatch && !tagMatch && !notesMatch && !activityMatch) return false;
      }

      return true;
    });

    if (filteredTrips.length === 0) {
      DOM.tripsGridContainer.innerHTML = `
        <div class="trips-empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-plane-circle-exclamation" style="color: var(--primary);"></i></div>
          <h3 class="empty-state-title">Belum ada perjalanan yang cocok</h3>
          <p class="empty-state-desc">Mulai rencanakan liburan impian Anda dengan membuat jadwal perjalanan baru lengkap dengan rute harian dan alokasi budget.</p>
          <button class="btn-primary btn-gradient-travel" id="emptyCreateTripBtn">
            <i class="fa-solid fa-plus"></i>
            <span>Buat Perjalanan Baru</span>
          </button>
        </div>
      `;
      const emptyBtn = document.getElementById('emptyCreateTripBtn');
      if (emptyBtn) emptyBtn.addEventListener('click', () => openTripModal());
      return;
    }

    filteredTrips.forEach(trip => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      const statusMeta = getTripStatusMeta(status);
      const countdown = getTripCountdownText(trip.startDate, trip.endDate);
      const daysCount = calculateDaysDuration(trip.startDate, trip.endDate);

      let totalExpense = 0;
      (trip.activities || []).forEach(a => { totalExpense += (a.cost || 0); });
      const targetBudget = trip.targetBudget || 0;
      const budgetPct = targetBudget > 0 ? Math.min(100, Math.round((totalExpense / targetBudget) * 100)) : 0;

      const card = document.createElement('div');
      card.className = 'trip-card';
      card.innerHTML = `
        <div class="trip-card-top-banner">
          <span class="trip-card-status-badge ${statusMeta.className}">${statusMeta.label}</span>
          <div class="trip-card-emoji-wrap">${getTripIconHTML(trip.emoji)}</div>
        </div>
        <div class="trip-card-body">
          <h3 class="trip-card-title">${escapeHtml(trip.title)}</h3>
          <div class="trip-card-dates">
            <span><i class="fa-regular fa-calendar-days"></i> ${formatDateIndo(trip.startDate)} - ${formatDateIndo(trip.endDate)}</span>
          </div>

          <div class="trip-card-tags-row">
            <span class="trip-pill-duration"><i class="fa-regular fa-clock"></i> ${daysCount}</span>
            <span class="trip-pill-tag"><i class="fa-solid fa-tag"></i> ${escapeHtml(trip.tag || 'Wisata')}</span>
            <span class="trip-pill-tag">${countdown}</span>
          </div>

          <div class="trip-card-budget-box">
            <div class="trip-card-budget-labels">
              <span>Est. Biaya: ${formatRupiah(totalExpense)}</span>
              <span>Target: ${formatRupiah(targetBudget)} (${budgetPct}%)</span>
            </div>
            <div class="trip-mini-progress">
              <div class="trip-mini-progress-fill" style="width: ${budgetPct}%;"></div>
            </div>
          </div>

          <div class="trip-card-footer">
            <div class="trip-activities-counter">
              <span><i class="fa-solid fa-location-dot"></i> ${(trip.activities || []).length} Destinasi</span>
            </div>
            <div class="trip-card-actions">
              <button class="tool-btn btn-edit-trip" title="Edit Trip"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="tool-btn btn-del-trip" title="Hapus Trip"><i class="fa-solid fa-trash-can"></i></button>
              <button class="btn-open-trip btn-view-trip">
                <span>Buka Itinerary</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      card.querySelector('.btn-view-trip').addEventListener('click', (e) => {
        e.stopPropagation();
        openTripDetail(trip.id);
      });
      card.querySelector('.btn-edit-trip').addEventListener('click', (e) => {
        e.stopPropagation();
        openTripModal(trip.id);
      });
      card.querySelector('.btn-del-trip').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTrip(trip.id, trip.title);
      });
      card.addEventListener('click', () => openTripDetail(trip.id));

      DOM.tripsGridContainer.appendChild(card);
    });
  }

  function openTripDetail(tripId) {
    state.data.activeTripId = tripId;
    state.data.currentItinerarySubView = 'detail';
    state.selectedItineraryDay = 'all';
    saveData();
    renderItineraryPlanner();
    renderHeaderStats();
  }

  function backToTripsDashboard() {
    state.data.currentItinerarySubView = 'dashboard';
    saveData();
    renderItineraryPlanner();
  }

  function renderTripDetail(trip) {
    if (!trip) return;

    const daysList = getDaysBetweenDates(trip.startDate, trip.endDate);
    const status = getTripStatus(trip.startDate, trip.endDate);
    const statusMeta = getTripStatusMeta(status);
    const countdown = getTripCountdownText(trip.startDate, trip.endDate);
    const daysDuration = calculateDaysDuration(trip.startDate, trip.endDate);

    let totalExpense = 0;
    (trip.activities || []).forEach(a => { totalExpense += (a.cost || 0); });
    const targetBudget = trip.targetBudget || 0;
    const budgetPct = targetBudget > 0 ? Math.min(100, Math.round((totalExpense / targetBudget) * 100)) : 0;
    const remainingBudget = targetBudget - totalExpense;

    if (DOM.breadcrumbTripEmoji) DOM.breadcrumbTripEmoji.innerHTML = getTripIconHTML(trip.emoji);
    if (DOM.breadcrumbTripTitle) DOM.breadcrumbTripTitle.textContent = trip.title;
    if (DOM.detailTripStatusBadge) {
      DOM.detailTripStatusBadge.textContent = statusMeta.label;
      DOM.detailTripStatusBadge.className = `badge-status-pill ${statusMeta.className}`;
    }

    if (DOM.detailTripEmoji) DOM.detailTripEmoji.innerHTML = getTripIconHTML(trip.emoji);
    if (DOM.detailTripTag) DOM.detailTripTag.innerHTML = `<i class="fa-solid fa-tag"></i> ${escapeHtml(trip.tag || 'Wisata & Budaya')}`;
    if (DOM.detailTripDuration) DOM.detailTripDuration.innerHTML = `<i class="fa-regular fa-clock"></i> ${daysDuration}`;
    if (DOM.detailTripCountdown) DOM.detailTripCountdown.innerHTML = countdown;
    if (DOM.detailTripTitleHeading) DOM.detailTripTitleHeading.textContent = trip.title;
    if (DOM.detailTripDatesRange) DOM.detailTripDatesRange.innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${formatDateIndo(trip.startDate)} - ${formatDateIndo(trip.endDate)}`;
    if (DOM.detailTripNotes) DOM.detailTripNotes.textContent = trip.notes || 'Rencanakan perjalanan dengan teliti dan nikmati setiap momen petualangan!';

    if (DOM.detailTripTargetBudget) DOM.detailTripTargetBudget.textContent = formatRupiah(targetBudget);
    if (DOM.detailTripTotalExpense) DOM.detailTripTotalExpense.textContent = formatRupiah(totalExpense);
    if (DOM.detailTripActivitiesCount) DOM.detailTripActivitiesCount.textContent = `${(trip.activities || []).length} Destinasi`;

    if (DOM.budgetPercentText) DOM.budgetPercentText.textContent = `${budgetPct}%`;
    if (DOM.budgetRemainingText) {
      DOM.budgetRemainingText.textContent = remainingBudget >= 0 ? `Sisa: ${formatRupiah(remainingBudget)}` : `Over: ${formatRupiah(Math.abs(remainingBudget))}`;
      DOM.budgetRemainingText.style.color = remainingBudget >= 0 ? 'var(--priority-low)' : 'var(--priority-high)';
    }
    if (DOM.budgetProgressFill) {
      DOM.budgetProgressFill.style.width = `${budgetPct}%`;
      DOM.budgetProgressFill.style.background = remainingBudget >= 0 ? 'var(--gradient-travel)' : 'var(--priority-high)';
    }

    if (DOM.itineraryDaysTabs) {
      DOM.itineraryDaysTabs.innerHTML = '';

      const allTab = document.createElement('button');
      allTab.className = `day-tab-btn ${state.selectedItineraryDay === 'all' ? 'active' : ''}`;
      allTab.innerHTML = `<span><i class="fa-solid fa-star"></i> Semua Hari</span> <span class="day-tab-badge">${(trip.activities || []).length}</span>`;
      allTab.addEventListener('click', () => {
        state.selectedItineraryDay = 'all';
        renderTripDetail(trip);
      });
      DOM.itineraryDaysTabs.appendChild(allTab);

      daysList.forEach(day => {
        const dayActs = (trip.activities || []).filter(a => a.dayNumber === day.dayNumber);
        const dayTab = document.createElement('button');
        dayTab.className = `day-tab-btn ${state.selectedItineraryDay === String(day.dayNumber) ? 'active' : ''}`;
        dayTab.innerHTML = `<span><i class="fa-regular fa-calendar-check"></i> Day ${day.dayNumber} (${day.formattedDate.split(' ')[0]} ${day.formattedDate.split(' ')[1] || ''})</span> <span class="day-tab-badge">${dayActs.length}</span>`;
        dayTab.addEventListener('click', () => {
          state.selectedItineraryDay = String(day.dayNumber);
          renderTripDetail(trip);
        });
        DOM.itineraryDaysTabs.appendChild(dayTab);
      });
    }

    if (DOM.currentDaySummaryPill) {
      if (state.selectedItineraryDay === 'all') {
        DOM.currentDaySummaryPill.innerHTML = `<i class="fa-solid fa-chart-pie"></i> Semua Hari &bull; ${(trip.activities || []).length} Destinasi &bull; Total: ${formatRupiah(totalExpense)}`;
      } else {
        const dNum = parseInt(state.selectedItineraryDay, 10);
        const dayActs = (trip.activities || []).filter(a => a.dayNumber === dNum);
        let dayCost = 0;
        dayActs.forEach(a => { dayCost += (a.cost || 0); });
        DOM.currentDaySummaryPill.innerHTML = `<i class="fa-solid fa-chart-pie"></i> Day ${dNum} &bull; ${dayActs.length} Destinasi &bull; Est. Biaya: ${formatRupiah(dayCost)}`;
      }
    }

    if (DOM.itineraryTimelineContent) {
      DOM.itineraryTimelineContent.innerHTML = '';

      const daysToRender = state.selectedItineraryDay === 'all'
        ? daysList
        : daysList.filter(d => String(d.dayNumber) === state.selectedItineraryDay);

      if (daysToRender.length === 0 && daysList.length === 0) {
        DOM.itineraryTimelineContent.innerHTML = `<div class="trips-empty-state"><p>Rentang tanggal perjalanan belum diatur.</p></div>`;
        return;
      }

      daysToRender.forEach(day => {
        const dayActivities = (trip.activities || []).filter(a => a.dayNumber === day.dayNumber);
        dayActivities.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

        let daySubtotal = 0;
        dayActivities.forEach(a => { daySubtotal += (a.cost || 0); });

        const group = document.createElement('div');
        group.className = 'day-timeline-group';

        group.innerHTML = `
          <div class="day-timeline-heading">
            <div class="day-title-badge-group">
              <span class="day-number-tag">DAY ${day.dayNumber}</span>
              <span class="day-date-text">${day.dayName}, ${day.formattedDate}</span>
            </div>
            <span class="day-cost-subtotal">Subtotal: ${formatRupiah(daySubtotal)}</span>
          </div>
          <div class="activities-list" id="dayList-${day.dayNumber}"></div>
        `;

        const listEl = group.querySelector(`#dayList-${day.dayNumber}`);

        if (dayActivities.length === 0) {
          listEl.innerHTML = `
            <div style="padding: 14px; text-align: center; color: var(--text-dim); font-size: 0.76rem; border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm);">
              Belum ada aktivitas yang dijadwalkan untuk hari ini.
              <button class="btn-text-action" style="margin-left: 8px;" id="addActDayBtn-${day.dayNumber}">
                <i class="fa-solid fa-plus"></i> Tambah Aktivitas
              </button>
            </div>
          `;
          listEl.querySelector(`#addActDayBtn-${day.dayNumber}`).addEventListener('click', () => {
            openActivityModal(trip.id, null, day.dayNumber);
          });
        } else {
          dayActivities.forEach(act => {
            const catMeta = getCategoryMeta(act.category);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.title)}`;

            const card = document.createElement('div');
            card.className = `activity-card ${act.completed ? 'is-completed' : ''}`;
            card.innerHTML = `
              <div class="activity-time-col">
                <span class="activity-time-pill"><i class="fa-regular fa-clock"></i> ${escapeHtml(act.startTime || '00:00')} - ${escapeHtml(act.endTime || '00:00')}</span>
                <span class="activity-duration-tag">${calculateDurationMinutes(act.startTime, act.endTime)}</span>
              </div>
              <div class="activity-content-col">
                <div class="activity-top-row">
                  <span class="activity-cat-tag ${catMeta.className}">${catMeta.icon} <span>${catMeta.label}</span></span>
                  <span class="activity-title-text">${escapeHtml(act.title)}</span>
                </div>
                ${act.notes ? `<div class="activity-notes-box">${escapeHtml(act.notes)}</div>` : ''}
                <div class="activity-meta-bottom">
                  <span class="activity-cost-badge"><i class="fa-solid fa-receipt"></i> ${formatRupiah(act.cost || 0)}</span>
                  <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="activity-maps-link" title="Buka Lokasi di Google Maps">
                    <i class="fa-solid fa-location-arrow"></i>
                    <span>Google Maps</span>
                    <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7em;"></i>
                  </a>
                </div>
              </div>
              <div class="activity-actions-col">
                <button class="activity-check-btn ${act.completed ? 'checked' : ''}" title="${act.completed ? 'Tandai Belum Selesai' : 'Tandai Selesai'}"><i class="fa-solid fa-check"></i></button>
                <button class="tool-btn btn-edit-act" title="Edit Destinasi"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="tool-btn btn-del-act" title="Hapus Destinasi"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            `;

            card.querySelector('.activity-check-btn').addEventListener('click', () => {
              toggleActivityCompleted(trip.id, act.id);
            });
            card.querySelector('.btn-edit-act').addEventListener('click', () => {
              openActivityModal(trip.id, act.id, day.dayNumber);
            });
            card.querySelector('.btn-del-act').addEventListener('click', () => {
              deleteActivity(trip.id, act.id, act.title);
            });

            listEl.appendChild(card);
          });
        }

        DOM.itineraryTimelineContent.appendChild(group);
      });
    }
  }

  // --- Trip Modal (Add / Edit) ---
  function openTripModal(tripId = null) {
    state.editingTripId = tripId;
    if (tripId) {
      const trip = (state.data.trips || []).find(t => t.id === tripId);
      if (!trip) return;
      if (DOM.tripModalTitle) DOM.tripModalTitle.textContent = 'Edit Perjalanan';
      if (DOM.tripEditId) DOM.tripEditId.value = trip.id;
      if (DOM.tripEmojiSelect) DOM.tripEmojiSelect.value = trip.emoji || 'beach';
      if (DOM.tripTitle) DOM.tripTitle.value = trip.title || '';
      if (DOM.tripStartDate) DOM.tripStartDate.value = trip.startDate || '';
      if (DOM.tripEndDate) DOM.tripEndDate.value = trip.endDate || '';
      if (DOM.tripCategorySelect) DOM.tripCategorySelect.value = trip.tag || 'Wisata & Budaya';
      if (DOM.tripTargetBudget) DOM.tripTargetBudget.value = trip.targetBudget || 0;
      if (DOM.tripBudgetRupiahPreview) DOM.tripBudgetRupiahPreview.textContent = formatRupiah(trip.targetBudget || 0);
      if (DOM.tripNotes) DOM.tripNotes.value = trip.notes || '';
    } else {
      if (DOM.tripModalTitle) DOM.tripModalTitle.textContent = 'Buat Perjalanan Baru';
      if (DOM.tripEditId) DOM.tripEditId.value = '';
      if (DOM.tripEmojiSelect) DOM.tripEmojiSelect.value = 'beach';
      if (DOM.tripTitle) DOM.tripTitle.value = '';
      if (DOM.tripStartDate) DOM.tripStartDate.value = getTodayFormatted(3);
      if (DOM.tripEndDate) DOM.tripEndDate.value = getTodayFormatted(7);
      if (DOM.tripCategorySelect) DOM.tripCategorySelect.value = 'Wisata & Budaya';
      if (DOM.tripTargetBudget) DOM.tripTargetBudget.value = '15000000';
      if (DOM.tripBudgetRupiahPreview) DOM.tripBudgetRupiahPreview.textContent = formatRupiah(15000000);
      if (DOM.tripNotes) DOM.tripNotes.value = '';
    }

    if (DOM.tripModalOverlay) DOM.tripModalOverlay.classList.add('is-active');
  }

  function closeTripModal() {
    if (DOM.tripModalOverlay) DOM.tripModalOverlay.classList.remove('is-active');
    state.editingTripId = null;
  }

  function handleTripFormSubmit(e) {
    e.preventDefault();
    const tripId = DOM.tripEditId.value;
    const title = DOM.tripTitle.value.trim();
    const startDate = DOM.tripStartDate.value;
    const endDate = DOM.tripEndDate.value;
    const emoji = DOM.tripEmojiSelect.value;
    const tag = DOM.tripCategorySelect.value;
    const targetBudget = parseFloat(DOM.tripTargetBudget.value) || 0;
    const notes = DOM.tripNotes.value.trim();

    if (!title || !startDate || !endDate) return;

    if (startDate > endDate) {
      showToast('Tanggal mulai tidak boleh lebih dari tanggal selesai!', 'error');
      return;
    }

    if (tripId) {
      const trip = (state.data.trips || []).find(t => t.id === tripId);
      if (trip) {
        trip.title = title;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.emoji = emoji;
        trip.tag = tag;
        trip.targetBudget = targetBudget;
        trip.notes = notes;
        showToast('Rincian perjalanan berhasil diperbarui');
      }
    } else {
      const newTrip = {
        id: generateId('trip'),
        userId: state.data.activeUserId || 'u-1',
        title,
        startDate,
        endDate,
        emoji,
        tag,
        targetBudget,
        notes,
        activities: []
      };
      if (!state.data.trips) state.data.trips = [];
      state.data.trips.unshift(newTrip);
      state.data.activeTripId = newTrip.id;
      state.data.currentItinerarySubView = 'detail';
      showToast('Perjalanan baru berhasil dibuat!');
    }

    saveData();
    closeTripModal();
    renderAll();
  }

  function deleteTrip(tripId, tripTitle = 'Perjalanan') {
    const tripIndex = (state.data.trips || []).findIndex(t => t.id === tripId);
    if (tripIndex === -1) return;

    showConfirmDialog({
      title: 'Hapus Perjalanan?',
      message: `Apakah Anda yakin ingin menghapus "${escapeHtml(tripTitle)}" beserta seluruh daftar destinasi di dalamnya?`,
      icon: 'fa-solid fa-trash-can',
      confirmText: 'Ya, Hapus Trip',
      isDanger: true,
      onConfirm: () => {
        const deletedTrip = state.data.trips[tripIndex];
        state.data.trips.splice(tripIndex, 1);
        if (state.data.activeTripId === tripId) {
          state.data.activeTripId = state.data.trips[0] ? state.data.trips[0].id : null;
          state.data.currentItinerarySubView = 'dashboard';
        }
        saveData();
        renderAll();

        showToastWithUndo(`Perjalanan "${tripTitle}" dihapus`, () => {
          state.data.trips.splice(tripIndex, 0, deletedTrip);
          state.data.activeTripId = deletedTrip.id;
          saveData();
          renderAll();
        });
      }
    });
  }

  // --- Activity Modal (Add / Edit) ---
  function openActivityModal(tripId, activityId = null, defaultDayNumber = 1) {
    const trip = (state.data.trips || []).find(t => t.id === tripId);
    if (!trip) return;

    state.editingActivityId = activityId;
    if (DOM.activityTripId) DOM.activityTripId.value = tripId;

    const daysList = getDaysBetweenDates(trip.startDate, trip.endDate);
    if (DOM.activityDaySelect) {
      DOM.activityDaySelect.innerHTML = '';
      daysList.forEach(day => {
        const opt = document.createElement('option');
        opt.value = day.dayNumber;
        opt.textContent = `Day ${day.dayNumber} - ${day.dayName} (${day.formattedDate})`;
        DOM.activityDaySelect.appendChild(opt);
      });
    }

    if (activityId) {
      const act = (trip.activities || []).find(a => a.id === activityId);
      if (!act) return;
      if (DOM.activityModalTitle) DOM.activityModalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Destinasi / Aktivitas';
      if (DOM.activityEditId) DOM.activityEditId.value = act.id;
      if (DOM.activityDaySelect) DOM.activityDaySelect.value = act.dayNumber || 1;
      if (DOM.activityStartTime) DOM.activityStartTime.value = act.startTime || '09:00';
      if (DOM.activityEndTime) DOM.activityEndTime.value = act.endTime || '11:30';
      if (DOM.activityTitle) DOM.activityTitle.value = act.title || '';
      if (DOM.activityCategory) DOM.activityCategory.value = act.category || 'sightseeing';
      if (DOM.activityCost) DOM.activityCost.value = act.cost || 0;
      if (DOM.activityCostPreview) DOM.activityCostPreview.textContent = formatRupiah(act.cost || 0);
      if (DOM.activityNotes) DOM.activityNotes.value = act.notes || '';
    } else {
      if (DOM.activityModalTitle) DOM.activityModalTitle.innerHTML = '<i class="fa-solid fa-plus"></i> Tambah Destinasi / Aktivitas';
      if (DOM.activityEditId) DOM.activityEditId.value = '';
      if (DOM.activityDaySelect) DOM.activityDaySelect.value = defaultDayNumber || 1;
      if (DOM.activityStartTime) DOM.activityStartTime.value = '09:00';
      if (DOM.activityEndTime) DOM.activityEndTime.value = '11:30';
      if (DOM.activityTitle) DOM.activityTitle.value = '';
      if (DOM.activityCategory) DOM.activityCategory.value = 'sightseeing';
      if (DOM.activityCost) DOM.activityCost.value = '';
      if (DOM.activityCostPreview) DOM.activityCostPreview.textContent = 'Rp 0 (Gratis/Termasuk)';
      if (DOM.activityNotes) DOM.activityNotes.value = '';
    }

    if (DOM.activityModalOverlay) DOM.activityModalOverlay.classList.add('is-active');
  }

  function closeActivityModal() {
    if (DOM.activityModalOverlay) DOM.activityModalOverlay.classList.remove('is-active');
    state.editingActivityId = null;
  }

  function handleActivityFormSubmit(e) {
    e.preventDefault();
    const tripId = DOM.activityTripId.value;
    const actId = DOM.activityEditId.value;
    const dayNumber = parseInt(DOM.activityDaySelect.value, 10) || 1;
    const startTime = DOM.activityStartTime.value;
    const endTime = DOM.activityEndTime.value;
    const title = DOM.activityTitle.value.trim();
    const category = DOM.activityCategory.value;
    const cost = parseFloat(DOM.activityCost.value) || 0;
    const notes = DOM.activityNotes.value.trim();

    if (!tripId || !title || !startTime || !endTime) return;

    const trip = (state.data.trips || []).find(t => t.id === tripId);
    if (!trip) return;
    if (!trip.activities) trip.activities = [];

    const daysList = getDaysBetweenDates(trip.startDate, trip.endDate);
    const dayObj = daysList.find(d => d.dayNumber === dayNumber);
    const dateStr = dayObj ? dayObj.date : trip.startDate;

    if (actId) {
      const act = trip.activities.find(a => a.id === actId);
      if (act) {
        act.dayNumber = dayNumber;
        act.date = dateStr;
        act.startTime = startTime;
        act.endTime = endTime;
        act.title = title;
        act.category = category;
        act.cost = cost;
        act.notes = notes;
        showToast('Destinasi diperbarui');
      }
    } else {
      const newAct = {
        id: generateId('act'),
        dayNumber,
        date: dateStr,
        startTime,
        endTime,
        title,
        category,
        cost,
        notes,
        completed: false
      };
      trip.activities.push(newAct);
      showToast('Destinasi baru ditambahkan ke itinerary!');
    }

    saveData();
    closeActivityModal();
    renderAll();
  }

  function toggleActivityCompleted(tripId, actId) {
    const trip = (state.data.trips || []).find(t => t.id === tripId);
    if (!trip || !trip.activities) return;
    const act = trip.activities.find(a => a.id === actId);
    if (act) {
      act.completed = !act.completed;
      saveData();
      renderAll();
    }
  }

  function deleteActivity(tripId, actId, actTitle = 'Aktivitas') {
    const trip = (state.data.trips || []).find(t => t.id === tripId);
    if (!trip || !trip.activities) return;
    const actIndex = trip.activities.findIndex(a => a.id === actId);
    if (actIndex === -1) return;

    const deletedAct = trip.activities[actIndex];
    trip.activities.splice(actIndex, 1);
    saveData();
    renderAll();

    showToastWithUndo(`Destinasi "${actTitle}" dihapus`, () => {
      trip.activities.splice(actIndex, 0, deletedAct);
      saveData();
      renderAll();
    });
  }

  // --- Share & Print Generator ---
  function openShareTripModal() {
    const trip = (state.data.trips || []).find(t => t.id === state.data.activeTripId);
    if (!trip) return;

    const text = generateItineraryShareText(trip);
    if (DOM.shareTripTextPreview) DOM.shareTripTextPreview.value = text;
    if (DOM.shareTripModalOverlay) DOM.shareTripModalOverlay.classList.add('is-active');
  }

  function closeShareTripModal() {
    if (DOM.shareTripModalOverlay) DOM.shareTripModalOverlay.classList.remove('is-active');
  }

  function generateItineraryShareText(trip) {
    const daysList = getDaysBetweenDates(trip.startDate, trip.endDate);
    let totalExpense = 0;
    (trip.activities || []).forEach(a => { totalExpense += (a.cost || 0); });

    let lines = [];
    lines.push(`✈️ *ITINERARY PERJALANAN* ✈️`);
    lines.push(`*${trip.title}* ${trip.emoji || ''}`);
    lines.push(`📅 Periode: ${formatDateIndo(trip.startDate)} s.d ${formatDateIndo(trip.endDate)}`);
    lines.push(`🏷️ Kategori: ${trip.tag || 'Wisata'}`);
    lines.push(`💰 Target Budget: ${formatRupiah(trip.targetBudget || 0)} (Est. Biaya: ${formatRupiah(totalExpense)})`);
    if (trip.notes) {
      lines.push(`📝 Catatan: ${trip.notes}`);
    }
    lines.push(``);
    lines.push(`==============================`);
    lines.push(``);

    daysList.forEach(day => {
      lines.push(`*🗓️ DAY ${day.dayNumber} - ${day.dayName}, ${day.formattedDate}*`);
      const dayActs = (trip.activities || []).filter(a => a.dayNumber === day.dayNumber);
      dayActs.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

      if (dayActs.length === 0) {
        lines.push(`  - (Jadwal santai / belum ada destinasi)`);
      } else {
        dayActs.forEach(act => {
          const cat = getCategoryMeta(act.category);
          const costStr = act.cost > 0 ? ` [${formatRupiah(act.cost)}]` : '';
          lines.push(`  • ${act.startTime} - ${act.endTime} | ${cat.icon} *${act.title}*${costStr}`);
          if (act.notes) {
            lines.push(`    ↳ _${act.notes}_`);
          }
        });
      }
      lines.push(``);
    });

    lines.push(`✨ Disusun dengan TimelineFlow App`);
    return lines.join('\n');
  }

  function copyShareText() {
    if (!DOM.shareTripTextPreview) return;
    DOM.shareTripTextPreview.select();
    navigator.clipboard.writeText(DOM.shareTripTextPreview.value)
      .then(() => {
        showToast('Format WhatsApp berhasil disalin ke clipboard!');
      })
      .catch(() => {
        document.execCommand('copy');
        showToast('Format WhatsApp berhasil disalin ke clipboard!');
      });
  }

  // ==========================================================================
  // COMPREHENSIVE & IMMERSIVE PRINT REPORT GENERATOR (PDF READY)
  // ==========================================================================

  function printDailyPlanReport() {
    if (!DOM.printReportContainer) return;
    DOM.printReportContainer.innerHTML = generateDailyPlanReportHTML();
    setTimeout(() => {
      window.print();
    }, 50);
  }

  function printRoadmapReport() {
    if (!DOM.printReportContainer) return;
    DOM.printReportContainer.innerHTML = generateRoadmapReportHTML();
    setTimeout(() => {
      window.print();
    }, 50);
  }

  function printItineraryReport() {
    if (!DOM.printReportContainer) return;
    closeShareTripModal();
    DOM.printReportContainer.innerHTML = generateItineraryReportHTML();
    setTimeout(() => {
      window.print();
    }, 50);
  }

  function printTripItinerary() {
    printItineraryReport();
  }

  function printActiveViewReport() {
    const view = state.data.viewMode || 'daily';
    if (view === 'roadmap') {
      printRoadmapReport();
    } else if (view === 'itinerary') {
      printItineraryReport();
    } else {
      printDailyPlanReport();
    }
  }

  function generateDailyPlanReportHTML() {
    const plan = (state.data.plans || []).find(p => p.id === state.data.activePlanId) || (state.data.plans && state.data.plans[0]) || { title: 'Work Routine (Utama)', days: {} };
    const daysOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    
    let totalTasks = 0;
    let completedTasks = 0;
    let totalItems = 0;
    let totalMinutes = 0;

    daysOrder.forEach(day => {
      const tasks = (plan.days && plan.days[day]) || [];
      tasks.forEach(t => {
        totalTasks++;
        if (t.completed) completedTasks++;
        if (t.items && Array.isArray(t.items)) {
          totalItems += t.items.length;
        }
        totalMinutes += Math.max(0, timeToMinutes(t.endTime) - timeToMinutes(t.startTime));
      });
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalHours = (totalMinutes / 60).toFixed(1);
    const dateFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let daysHtml = '';
    daysOrder.forEach(day => {
      const tasks = (plan.days && plan.days[day]) || [];
      if (tasks.length === 0) return;

      let taskRows = '';
      tasks.forEach(t => {
        const statusBadge = t.completed ? '<span class="print-badge" style="color:#10b981; border-color:#10b981;">✓ Selesai</span>' : '<span class="print-badge" style="color:#4f46e5;">• Terjadwal</span>';
        const priorityBadge = `<span class="print-badge" style="text-transform: capitalize;">${escapeHtml(t.priority || 'Medium')}</span>`;
        
        let subitemsList = '';
        if (t.items && t.items.length > 0) {
          subitemsList = '<ul class="print-subitems-list">';
          t.items.forEach(item => {
            const check = item.completed ? '☑' : '☐';
            subitemsList += `<li>${check} ${escapeHtml(item.title || '')}</li>`;
          });
          subitemsList += '</ul>';
        }

        taskRows += `
          <tr>
            <td style="font-family: monospace; font-weight: 700; width: 110px;">${escapeHtml(t.startTime || '')} - ${escapeHtml(t.endTime || '')}</td>
            <td>
              <strong>${escapeHtml(t.title || '')}</strong>
              <div style="font-size: 7.5pt; color: #64748b; margin-top: 2px;">Kategori: ${escapeHtml(t.category || 'Work')}</div>
            </td>
            <td style="width: 85px;">${priorityBadge}</td>
            <td>${subitemsList || '<span style="color:#94a3b8; font-size:8pt;">-</span>'}</td>
            <td style="width: 85px; text-align: center;">${statusBadge}</td>
          </tr>
        `;
      });

      daysHtml += `
        <div class="print-section">
          <div class="print-section-title">
            <span>📅 ${day}</span>
            <span style="font-size: 8.5pt; font-weight: normal; color: #64748b;">${tasks.length} Agenda Tugas</span>
          </div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Aktivitas & Kategori</th>
                <th>Prioritas</th>
                <th>Checklist Sub-Pekerjaan</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${taskRows}
            </tbody>
          </table>
        </div>
      `;
    });

    if (!daysHtml) {
      daysHtml = '<p style="text-align: center; color: #64748b; padding: 20px;">Belum ada tugas atau jadwal pada plan ini.</p>';
    }

    return `
      <div class="print-header">
        <div class="print-brand-col">
          <div class="print-brand-badge">TimelineFlow • Productivity Planner</div>
          <h1 class="print-doc-title">Laporan Rencana Kerja & Jadwal Rutin</h1>
          <p class="print-doc-subtitle">Plan: <strong>${escapeHtml(plan.title || 'Work Routine')}</strong> — Evaluasi Alokasi Waktu Mingguan</p>
        </div>
        <div class="print-meta-col">
          <div>Tanggal Laporan: <strong>${dateFormatted}</strong></div>
          <div>Dokumen: <strong>Official Schedule Report</strong></div>
        </div>
      </div>

      <div class="print-kpi-grid">
        <div class="print-kpi-card">
          <div class="print-kpi-label">Total Agenda Tugas</div>
          <div class="print-kpi-val">${totalTasks}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Tugas Terselesaikan</div>
          <div class="print-kpi-val" style="color: #10b981;">${completedTasks} <span style="font-size: 9pt; font-weight: normal;">(${completionRate}%)</span></div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Alokasi Waktu Kerja</div>
          <div class="print-kpi-val">${totalHours} <span style="font-size: 9pt; font-weight: normal;">Jam</span></div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Sub-Item Checklist</div>
          <div class="print-kpi-val">${totalItems}</div>
        </div>
      </div>

      ${daysHtml}

      <div class="print-footer">
        <span>TimelineFlow Desktop App • Laporan Rencana Harian</span>
        <span>Halaman 1 • Dicetak dari Sistem TimelineFlow</span>
      </div>
    `;
  }

  function generateRoadmapReportHTML() {
    const year = state.data.roadmapYear || 2026;
    const roadmap = state.data.roadmap || {};
    const qKeys = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    let totalTargetRupiah = 0;
    let totalInitiatives = 0;
    let completedInitiatives = 0;

    qKeys.forEach(k => {
      const q = roadmap[k] || {};
      totalTargetRupiah += Number(q.targetRupiah || 0);
      const items = q.items || [];
      totalInitiatives += items.length;
      completedInitiatives += items.filter(i => (i.progress || 0) >= 100).length;
    });

    const dateFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let qSummaryRows = '';
    qKeys.forEach(k => {
      const meta = QUARTERS_META[k];
      const q = roadmap[k] || {};
      const target = q.targetRupiah || meta.defaultTarget || 0;
      const period = q.periodLabel || (q.startDate && q.endDate ? `${formatDateIndo(q.startDate)} - ${formatDateIndo(q.endDate)}` : meta.months);
      const itemsCount = (q.items || []).length;
      const strategy = q.strategy || '-';

      qSummaryRows += `
        <tr>
          <td style="font-weight: 800; color: #4f46e5;">${meta.label}</td>
          <td>${escapeHtml(period)}</td>
          <td style="font-weight: 700; font-family: monospace;">${formatRupiah(target)}</td>
          <td>${escapeHtml(strategy)}</td>
          <td style="text-align: center; font-weight: 700;">${itemsCount}</td>
        </tr>
      `;
    });

    let qDetailSections = '';
    qKeys.forEach(k => {
      const meta = QUARTERS_META[k];
      const q = roadmap[k] || {};
      const items = q.items || [];
      const period = q.periodLabel || (q.startDate && q.endDate ? `${formatDateIndo(q.startDate)} - ${formatDateIndo(q.endDate)}` : meta.months);

      let itemRows = '';
      if (items.length > 0) {
        items.forEach(item => {
          let subitemsHtml = '';
          if (item.items && item.items.length > 0) {
            subitemsHtml = '<ul class="print-subitems-list">';
            item.items.forEach(sub => {
              const chk = sub.completed ? '☑' : '☐';
              subitemsHtml += `<li>${chk} ${escapeHtml(sub.title || '')}</li>`;
            });
            subitemsHtml += '</ul>';
          }

          const dateRange = (item.startDate && item.endDate) ? `${formatDateIndo(item.startDate)} - ${formatDateIndo(item.endDate)}` : (item.date || '-');
          const targetRp = item.targetRupiah ? formatRupiah(item.targetRupiah) : '-';
          const progress = Number(item.progress || 0);
          const progBadge = progress >= 100 
            ? '<span class="print-badge" style="color:#10b981; border-color:#10b981;">100% Selesai</span>'
            : `<span class="print-badge" style="color:#4f46e5;">${progress}%</span>`;

          itemRows += `
            <tr>
              <td>
                <strong>${escapeHtml(item.title || '')}</strong>
                ${item.description ? `<div style="font-size:7.5pt; color:#64748b; margin-top:2px;">${escapeHtml(item.description)}</div>` : ''}
              </td>
              <td><span class="print-badge">${escapeHtml(item.category || 'Strategic')}</span></td>
              <td style="font-size:8pt;">${escapeHtml(dateRange)}</td>
              <td style="font-family: monospace; font-weight: 600;">${targetRp}</td>
              <td>${subitemsHtml || '<span style="color:#94a3b8; font-size:8pt;">-</span>'}</td>
              <td style="text-align: center;">${progBadge}</td>
            </tr>
          `;
        });
      } else {
        itemRows = `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:12px;">Belum ada inisiatif terdaftar pada ${meta.label}.</td></tr>`;
      }

      qDetailSections += `
        <div class="print-section">
          <div class="print-section-title">
            <span>🎯 ${meta.label} (${escapeHtml(period)})</span>
            <span style="font-size: 8.5pt; font-weight: normal; color: #4f46e5; font-weight: 700;">Target: ${formatRupiah(q.targetRupiah || meta.defaultTarget || 0)}</span>
          </div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Inisiatif / Milestone</th>
                <th style="width: 80px;">Kategori</th>
                <th style="width: 140px;">Target Jadwal</th>
                <th style="width: 120px;">Target Finansial</th>
                <th>Checklist Sub-Item</th>
                <th style="width: 80px; text-align: center;">Progress</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
        </div>
      `;
    });

    return `
      <div class="print-header">
        <div class="print-brand-col">
          <div class="print-brand-badge">TimelineFlow • Strategic Roadmap</div>
          <h1 class="print-doc-title">Laporan Roadmap Tahunan & Target Kuartal (${year})</h1>
          <p class="print-doc-subtitle">Pemetaan Target Finansial, Milestone Strategis & Eksekusi Kuartal 1 - 4</p>
        </div>
        <div class="print-meta-col">
          <div>Tanggal Laporan: <strong>${dateFormatted}</strong></div>
          <div>Tahun Strategis: <strong>${year}</strong></div>
        </div>
      </div>

      <div class="print-kpi-grid">
        <div class="print-kpi-card">
          <div class="print-kpi-label">Total Target Omset Tahunan</div>
          <div class="print-kpi-val" style="color: #4f46e5; font-size: 11pt;">${formatRupiah(totalTargetRupiah)}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Total Inisiatif Strategis</div>
          <div class="print-kpi-val">${totalInitiatives}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Inisiatif Tuntas (100%)</div>
          <div class="print-kpi-val" style="color: #10b981;">${completedInitiatives}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Rata-rata Target / Kuartal</div>
          <div class="print-kpi-val" style="font-size: 11pt;">${formatRupiah(Math.round(totalTargetRupiah / 4))}</div>
        </div>
      </div>

      <div class="print-section">
        <div class="print-section-title">
          <span>📊 Ringkasan Eksekutif 4 Kuartal (${year})</span>
        </div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 130px;">Kuartal</th>
              <th style="width: 170px;">Periode Waktu</th>
              <th style="width: 150px;">Target Omset</th>
              <th>Fokus & Snapshot Strategi</th>
              <th style="width: 70px; text-align: center;">Inisiatif</th>
            </tr>
          </thead>
          <tbody>
            ${qSummaryRows}
          </tbody>
        </table>
      </div>

      ${qDetailSections}

      <div class="print-footer">
        <span>TimelineFlow Desktop App • Laporan Roadmap Tahunan</span>
        <span>Halaman 1 • Dicetak dari Sistem TimelineFlow</span>
      </div>
    `;
  }

  function generateItineraryReportHTML() {
    const trip = (state.data.trips || []).find(t => t.id === state.data.activeTripId) || (state.data.trips && state.data.trips[0]);
    const dateFormatted = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (!trip) {
      return `
        <div class="print-header">
          <div class="print-brand-col">
            <h1 class="print-doc-title">Laporan Itinerary Perjalanan</h1>
            <p class="print-doc-subtitle">Belum ada trip perjalanan yang dipilih.</p>
          </div>
        </div>
      `;
    }

    const activities = (state.data.activities || []).filter(a => a.tripId === trip.id);
    let totalExpense = 0;
    activities.forEach(a => { totalExpense += Number(a.cost || 0); });

    const targetBudget = Number(trip.targetBudget || 0);
    const budgetDiff = targetBudget - totalExpense;
    const diffColor = budgetDiff >= 0 ? '#10b981' : '#f43f5e';
    const diffText = budgetDiff >= 0 ? `Sisa ${formatRupiah(budgetDiff)}` : `Over ${formatRupiah(Math.abs(budgetDiff))}`;

    const dayGroups = {};
    activities.forEach(a => {
      const d = a.day || 'Hari 1';
      if (!dayGroups[d]) dayGroups[d] = [];
      dayGroups[d].push(a);
    });

    let daySections = '';
    const sortedDays = Object.keys(dayGroups).sort();
    sortedDays.forEach(dayName => {
      const dayActs = dayGroups[dayName].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      let actRows = '';
      let dayTotalCost = 0;

      dayActs.forEach(act => {
        dayTotalCost += Number(act.cost || 0);
        const costStr = Number(act.cost) > 0 ? formatRupiah(act.cost) : 'Gratis';
        actRows += `
          <tr>
            <td style="font-family: monospace; font-weight: 700; width: 85px;">${escapeHtml(act.time || '-')}</td>
            <td>
              <strong>${escapeHtml(act.title || '')}</strong>
              ${act.notes ? `<div style="font-size:7.5pt; color:#64748b; margin-top:2px;">${escapeHtml(act.notes)}</div>` : ''}
            </td>
            <td>${escapeHtml(act.location || '-')}</td>
            <td><span class="print-badge">${escapeHtml(act.category || 'Wisata')}</span></td>
            <td style="font-family: monospace; font-weight: 600; text-align: right;">${costStr}</td>
          </tr>
        `;
      });

      daySections += `
        <div class="print-section">
          <div class="print-section-title">
            <span>📍 ${escapeHtml(dayName)}</span>
            <span style="font-size: 8.5pt; font-weight: normal; color: #64748b;">Subtotal: ${formatRupiah(dayTotalCost)}</span>
          </div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Aktivitas & Keterangan</th>
                <th>Lokasi Destinasi</th>
                <th style="width: 85px;">Kategori</th>
                <th style="width: 120px; text-align: right;">Estimasi Biaya</th>
              </tr>
            </thead>
            <tbody>
              ${actRows}
            </tbody>
          </table>
        </div>
      `;
    });

    if (!daySections) {
      daySections = '<p style="text-align: center; color: #64748b; padding: 20px;">Belum ada aktivitas terdaftar pada trip ini.</p>';
    }

    return `
      <div class="print-header">
        <div class="print-brand-col">
          <div class="print-brand-badge">TimelineFlow • Travel & Itinerary Planner</div>
          <h1 class="print-doc-title">Laporan Rencana Perjalanan & Estimasi Anggaran</h1>
          <p class="print-doc-subtitle">Trip: <strong>${escapeHtml(trip.title || 'Trip')}</strong> • Periode: ${formatDateIndo(trip.startDate)} s.d. ${formatDateIndo(trip.endDate)}</p>
        </div>
        <div class="print-meta-col">
          <div>Tanggal Laporan: <strong>${dateFormatted}</strong></div>
          <div>Kategori: <strong>${escapeHtml(trip.category || 'Wisata')}</strong></div>
        </div>
      </div>

      <div class="print-kpi-grid">
        <div class="print-kpi-card">
          <div class="print-kpi-label">Target Anggaran (Budget)</div>
          <div class="print-kpi-val" style="color: #0284c7; font-size: 11pt;">${formatRupiah(targetBudget)}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Total Estimasi Biaya</div>
          <div class="print-kpi-val" style="font-size: 11pt;">${formatRupiah(totalExpense)}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Status Anggaran</div>
          <div class="print-kpi-val" style="color: ${diffColor}; font-size: 11pt;">${diffText}</div>
        </div>
        <div class="print-kpi-card">
          <div class="print-kpi-label">Total Aktivitas Agenda</div>
          <div class="print-kpi-val">${activities.length}</div>
        </div>
      </div>

      ${daySections}

      <div class="print-footer">
        <span>TimelineFlow Desktop App • Laporan Rencana Perjalanan</span>
        <span>Halaman 1 • Dicetak dari Sistem TimelineFlow</span>
      </div>
    `;
  }

  // --- User Profile & Role Switcher ---
  function openUserProfileModal() {
    const user = (state.data.users || []).find(u => u.id === state.data.activeUserId) || state.data.users[0];
    if (user) {
      if (DOM.userRoleSelect) DOM.userRoleSelect.value = user.role || 'traveler';
      if (DOM.userNameInput) DOM.userNameInput.value = user.nama || 'Alex Traveler';
      if (DOM.userEmailInput) DOM.userEmailInput.value = user.email || 'alex@traveler.com';
    }
    if (DOM.userProfileModalOverlay) DOM.userProfileModalOverlay.classList.add('is-active');
  }

  function closeUserProfileModal() {
    if (DOM.userProfileModalOverlay) DOM.userProfileModalOverlay.classList.remove('is-active');
  }

  function handleUserProfileFormSubmit(e) {
    e.preventDefault();
    const role = DOM.userRoleSelect.value;
    const nama = DOM.userNameInput.value.trim();
    const email = DOM.userEmailInput.value.trim();

    let user = (state.data.users || []).find(u => u.id === state.data.activeUserId);
    if (!user) {
      user = { id: generateId('u'), nama, email, role, avatar: role === 'admin' ? '👑' : '🎒' };
      state.data.users.push(user);
    } else {
      user.nama = nama;
      user.email = email;
      user.role = role;
      user.avatar = role === 'admin' ? '👑' : '🎒';
    }

    saveData();
    closeUserProfileModal();
    renderUserProfileNav();
    showToast(`Profil pengguna diperbarui (${role === 'admin' ? 'Admin Mode' : 'Traveler Mode'})`);
  }

  function renderUserProfileNav() {
    const user = (state.data.users || []).find(u => u.id === state.data.activeUserId) || (state.data.users && state.data.users[0]);
    if (user) {
      if (DOM.navUserAvatar) {
        DOM.navUserAvatar.innerHTML = user.role === 'admin'
          ? '<i class="fa-solid fa-crown" style="color:#f59e0b;"></i>'
          : '<i class="fa-solid fa-user-astronaut" style="color:var(--primary);"></i>';
      }
      if (DOM.navUserRoleText) DOM.navUserRoleText.textContent = user.role === 'admin' ? 'Admin Mode' : `${user.nama || 'Traveler'}`;
    }
  }

  // --- Forgiving Design: Toast with Undo Button ---
  function showToastWithUndo(msg, onUndo) {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <span><i class="fa-solid fa-trash-can" style="color: var(--priority-high);"></i></span>
      <span>${escapeHtml(msg)}</span>
      <button class="toast-undo-btn"><i class="fa-solid fa-rotate-left"></i> Batalkan (Undo)</button>
    `;

    const undoBtn = toast.querySelector('.toast-undo-btn');
    undoBtn.addEventListener('click', () => {
      if (typeof onUndo === 'function') onUndo();
      toast.remove();
      showToast('Aksi berhasil dibatalkan');
    });

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 200);
    }, 5500);
  }

  // ==========================================================================
  // BACKUP EXPORT & IMPORT
  // ==========================================================================

  function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.data, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `TimelineFlow_Backup_${state.data.currentYear || '2026'}_${getTodayFormatted(0)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Backup data berhasil diunduh');
  }

  function triggerImport() {
    if (DOM.importFileInput) DOM.importFileInput.click();
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData && (importedData.plans || importedData.roadmap)) {
          state.data = {
            ...JSON.parse(JSON.stringify(DEFAULT_DATA)),
            ...importedData
          };
          saveData();
          renderAll();
          showToast('Data berhasil dipulihkan dari backup!');
        } else {
          showToast('Format JSON tidak sesuai', 'error');
        }
      } catch (err) {
        showToast('Gagal membaca file JSON', 'error');
      }
      DOM.importFileInput.value = '';
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // EVENT LISTENERS SETUP
  // ==========================================================================

  function setupEventListeners() {
    // Plan Pill Button
    if (DOM.currentPlanBtn) {
      DOM.currentPlanBtn.addEventListener('click', () => openPlanModal());
    }

    // Mode Switcher Listeners
    if (DOM.viewModeDailyBtn) {
      DOM.viewModeDailyBtn.addEventListener('click', () => switchViewMode('daily'));
    }
    if (DOM.viewModeRoadmapBtn) {
      DOM.viewModeRoadmapBtn.addEventListener('click', () => switchViewMode('roadmap'));
    }
    if (DOM.viewModeItineraryBtn) {
      DOM.viewModeItineraryBtn.addEventListener('click', () => switchViewMode('itinerary'));
    }

    // User Profile Button
    if (DOM.userProfileBtn) DOM.userProfileBtn.addEventListener('click', openUserProfileModal);
    if (DOM.closeUserProfileModalBtn) DOM.closeUserProfileModalBtn.addEventListener('click', closeUserProfileModal);
    if (DOM.cancelUserProfileModalBtn) DOM.cancelUserProfileModalBtn.addEventListener('click', closeUserProfileModal);
    if (DOM.userProfileForm) DOM.userProfileForm.addEventListener('submit', handleUserProfileFormSubmit);

    // Itinerary Dashboard Actions
    if (DOM.createTripBtn) DOM.createTripBtn.addEventListener('click', () => openTripModal());
    if (DOM.tripSearchInput) DOM.tripSearchInput.addEventListener('input', () => renderTripsDashboard());
    
    // Filter Pills
    const filterPills = document.querySelectorAll('#tripFilterGroup .filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.data.tripFilter = pill.getAttribute('data-filter') || 'all';
        saveData();
        renderTripsDashboard();
      });
    });

    // Trip Detail Actions
    if (DOM.backToTripsBtn) DOM.backToTripsBtn.addEventListener('click', backToTripsDashboard);
    if (DOM.addActivityBtn) DOM.addActivityBtn.addEventListener('click', () => openActivityModal(state.data.activeTripId));
    if (DOM.shareTripBtn) DOM.shareTripBtn.addEventListener('click', openShareTripModal);
    if (DOM.printTripBtn) DOM.printTripBtn.addEventListener('click', printTripItinerary);
    if (DOM.editCurrentTripBtn) DOM.editCurrentTripBtn.addEventListener('click', () => openTripModal(state.data.activeTripId));
    if (DOM.deleteCurrentTripBtn) {
      DOM.deleteCurrentTripBtn.addEventListener('click', () => {
        const trip = (state.data.trips || []).find(t => t.id === state.data.activeTripId);
        if (trip) deleteTrip(trip.id, trip.title);
      });
    }

    // Trip Modal Actions
    if (DOM.closeTripModalBtn) DOM.closeTripModalBtn.addEventListener('click', closeTripModal);
    if (DOM.cancelTripModalBtn) DOM.cancelTripModalBtn.addEventListener('click', closeTripModal);
    if (DOM.tripForm) DOM.tripForm.addEventListener('submit', handleTripFormSubmit);
    if (DOM.tripTargetBudget) {
      DOM.tripTargetBudget.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        if (DOM.tripBudgetRupiahPreview) DOM.tripBudgetRupiahPreview.textContent = formatRupiah(val);
      });
    }

    // Activity Modal Actions
    if (DOM.closeActivityModalBtn) DOM.closeActivityModalBtn.addEventListener('click', closeActivityModal);
    if (DOM.cancelActivityModalBtn) DOM.cancelActivityModalBtn.addEventListener('click', closeActivityModal);
    if (DOM.activityForm) DOM.activityForm.addEventListener('submit', handleActivityFormSubmit);
    if (DOM.activityCost) {
      DOM.activityCost.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        if (DOM.activityCostPreview) {
          DOM.activityCostPreview.textContent = val > 0 ? formatRupiah(val) : 'Rp 0 (Gratis/Termasuk)';
        }
      });
    }

    // Share Modal Actions
    if (DOM.closeShareTripModalBtn) DOM.closeShareTripModalBtn.addEventListener('click', closeShareTripModal);
    if (DOM.copyShareTextBtn) DOM.copyShareTextBtn.addEventListener('click', copyShareText);
    if (DOM.printFromShareBtn) DOM.printFromShareBtn.addEventListener('click', printTripItinerary);

    // Print Actions across all views
    if (DOM.printDailyPlanBtn) DOM.printDailyPlanBtn.addEventListener('click', printDailyPlanReport);
    if (DOM.printRoadmapBtn) DOM.printRoadmapBtn.addEventListener('click', printRoadmapReport);
    if (DOM.quickPrintNavBtn) DOM.quickPrintNavBtn.addEventListener('click', printActiveViewReport);

    // Dynamic Time Slot update when day select changes in Task Modal
    if (DOM.taskDaySelect) {
      DOM.taskDaySelect.addEventListener('change', (e) => {
        if (!state.editingTaskId) {
          const suggested = getSuggestedNextTimeSlot(e.target.value);
          DOM.taskStartTime.value = suggested.startTime;
          DOM.taskEndTime.value = suggested.endTime;
        }
      });
    }

    // Year Selector
    if (DOM.roadmapYearSelect) {
      DOM.roadmapYearSelect.addEventListener('change', (e) => {
        state.data.currentYear = e.target.value;
        saveData();
        renderAll();
        showToast(`Beralih ke tahun ${e.target.value}`);
      });
    }

    // Roadmap Milestone Modal
    if (DOM.addRoadmapItemBtn) {
      DOM.addRoadmapItemBtn.addEventListener('click', () => openRoadmapItemModal('Q1'));
    }
    if (DOM.closeRoadmapItemModalBtn) {
      DOM.closeRoadmapItemModalBtn.addEventListener('click', closeRoadmapItemModal);
    }
    if (DOM.cancelRoadmapItemModalBtn) {
      DOM.cancelRoadmapItemModalBtn.addEventListener('click', closeRoadmapItemModal);
    }
    if (DOM.roadmapItemForm) {
      DOM.roadmapItemForm.addEventListener('submit', handleRoadmapItemFormSubmit);
    }

    if (DOM.roadmapTargetRupiah) {
      DOM.roadmapTargetRupiah.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        if (DOM.formattedRupiahPreview) DOM.formattedRupiahPreview.textContent = formatRupiah(val);
      });
    }

    if (DOM.roadmapProgressRange) {
      DOM.roadmapProgressRange.addEventListener('input', (e) => {
        if (DOM.progressRangeValue) DOM.progressRangeValue.textContent = `${e.target.value}%`;
      });
    }

    // Quarter Meta Modal
    if (DOM.closeQuarterMetaModalBtn) {
      DOM.closeQuarterMetaModalBtn.addEventListener('click', closeQuarterMetaModal);
    }
    if (DOM.cancelQuarterMetaModalBtn) {
      DOM.cancelQuarterMetaModalBtn.addEventListener('click', closeQuarterMetaModal);
    }
    if (DOM.quarterMetaForm) {
      DOM.quarterMetaForm.addEventListener('submit', handleQuarterMetaFormSubmit);
    }
    if (DOM.quarterMetaTargetRupiah) {
      DOM.quarterMetaTargetRupiah.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        if (DOM.quarterRupiahPreview) DOM.quarterRupiahPreview.textContent = formatRupiah(val);
      });
    }

    // Theme & Goals
    if (DOM.themeToggleBtn) DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    if (DOM.openGoalsBtn) DOM.openGoalsBtn.addEventListener('click', openGoalsModal);
    if (DOM.widgetOpenGoalsBtn) DOM.widgetOpenGoalsBtn.addEventListener('click', openGoalsModal);
    if (DOM.closeGoalsModalBtn) DOM.closeGoalsModalBtn.addEventListener('click', closeGoalsModal);

    // Calendar navigation
    if (DOM.calPrevMonthBtn) {
      DOM.calPrevMonthBtn.addEventListener('click', () => {
        state.calCurrentDate.setMonth(state.calCurrentDate.getMonth() - 1);
        renderCalendar();
      });
    }

    if (DOM.calNextMonthBtn) {
      DOM.calNextMonthBtn.addEventListener('click', () => {
        state.calCurrentDate.setMonth(state.calCurrentDate.getMonth() + 1);
        renderCalendar();
      });
    }

    if (DOM.calTodayBtn) {
      DOM.calTodayBtn.addEventListener('click', () => {
        state.calCurrentDate = new Date();
        state.calSelectedDate = getTodayFormatted(0);
        renderCalendar();
        renderGoalsList();
      });
    }

    if (DOM.goalForm) DOM.goalForm.addEventListener('submit', handleGoalFormSubmit);
    if (DOM.resetGoalFormBtn) DOM.resetGoalFormBtn.addEventListener('click', resetGoalForm);

    // Task Daily Actions
    if (DOM.quickAddTaskBtn) DOM.quickAddTaskBtn.addEventListener('click', () => openTaskModal(getTodayDayKey()));
    if (DOM.closeTaskModalBtn) DOM.closeTaskModalBtn.addEventListener('click', closeTaskModal);
    if (DOM.cancelTaskModalBtn) DOM.cancelTaskModalBtn.addEventListener('click', closeTaskModal);
    if (DOM.taskForm) DOM.taskForm.addEventListener('submit', handleTaskFormSubmit);
    if (DOM.clearCompletedBtn) DOM.clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    if (DOM.addTaskItemBtn) DOM.addTaskItemBtn.addEventListener('click', handleAddModalTaskItem);
    if (DOM.newTaskItemInput) {
      DOM.newTaskItemInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddModalTaskItem();
        }
      });
    }

    // Plan Actions
    if (DOM.addNewPlanBtn) DOM.addNewPlanBtn.addEventListener('click', openNewPlanModal);
    if (DOM.renamePlanBtn) DOM.renamePlanBtn.addEventListener('click', () => openEditPlanModal(state.data.activePlanId));
    if (DOM.closePlanModalBtn) DOM.closePlanModalBtn.addEventListener('click', closePlanModal);
    if (DOM.cancelPlanModalBtn) DOM.cancelPlanModalBtn.addEventListener('click', closePlanModal);
    if (DOM.planForm) DOM.planForm.addEventListener('submit', handlePlanFormSubmit);

    // Export / Import
    if (DOM.exportDataBtn) DOM.exportDataBtn.addEventListener('click', exportData);
    if (DOM.importDataBtn) DOM.importDataBtn.addEventListener('click', triggerImport);
    if (DOM.importFileInput) DOM.importFileInput.addEventListener('change', handleImportFile);

    // Desktop Native IPC Event Handlers (Electron)
    if (window.electronAPI && typeof window.electronAPI.onMenuTrigger === 'function') {
      window.electronAPI.onMenuTrigger('menu-goals', () => openGoalsModal());
      window.electronAPI.onMenuTrigger('menu-new-task', () => openTaskModal(getTodayDayKey()));
      window.electronAPI.onMenuTrigger('menu-export', () => exportData());
      window.electronAPI.onMenuTrigger('menu-import', () => triggerImport());
    }

    // Confirmation dialog actions
    if (DOM.cancelConfirmBtn) DOM.cancelConfirmBtn.addEventListener('click', closeConfirmDialog);
    if (DOM.okConfirmBtn) {
      DOM.okConfirmBtn.addEventListener('click', () => {
        if (typeof state.pendingConfirmAction === 'function') {
          state.pendingConfirmAction();
        }
        closeConfirmDialog();
      });
    }

    // Drag & Drop Modal Actions
    if (DOM.dragMoveBtn) DOM.dragMoveBtn.addEventListener('click', executeDragMove);
    if (DOM.dragDuplicateBtn) DOM.dragDuplicateBtn.addEventListener('click', executeDragDuplicate);
    if (DOM.cancelDragActionBtn) DOM.cancelDragActionBtn.addEventListener('click', closeDragActionModal);

    // App Info Modal Actions
    if (DOM.appInfoNavBtn) DOM.appInfoNavBtn.addEventListener('click', openAppInfoModal);
    if (DOM.profileAppInfoBtn) DOM.profileAppInfoBtn.addEventListener('click', openAppInfoModal);
    if (DOM.closeAppInfoModalBtn) DOM.closeAppInfoModalBtn.addEventListener('click', closeAppInfoModal);
    if (DOM.closeAppInfoBtn) DOM.closeAppInfoBtn.addEventListener('click', closeAppInfoModal);
    if (DOM.appInfoCheckUpdateBtn) DOM.appInfoCheckUpdateBtn.addEventListener('click', (e) => {
      closeAppInfoModal();
      triggerCheckForUpdates(e);
    });

    // Update Modal Actions
    if (DOM.checkUpdateNavBtn) DOM.checkUpdateNavBtn.addEventListener('click', triggerCheckForUpdates);
    if (DOM.profileCheckUpdateBtn) DOM.profileCheckUpdateBtn.addEventListener('click', triggerCheckForUpdates);
    if (DOM.closeUpdateModalTopBtn) DOM.closeUpdateModalTopBtn.addEventListener('click', closeUpdateModal);
    if (DOM.btnCancelUpdateAvailable) DOM.btnCancelUpdateAvailable.addEventListener('click', closeUpdateModal);
    if (DOM.btnStartUpdateDownload) DOM.btnStartUpdateDownload.addEventListener('click', startDownloadUpdate);
    if (DOM.btnLaterInstall) DOM.btnLaterInstall.addEventListener('click', closeUpdateModal);
    if (DOM.btnRestartAndInstall) DOM.btnRestartAndInstall.addEventListener('click', installAndRestart);
    if (DOM.btnCloseUpdateLatest) DOM.btnCloseUpdateLatest.addEventListener('click', closeUpdateModal);
    if (DOM.btnRetryUpdateCheck) DOM.btnRetryUpdateCheck.addEventListener('click', triggerCheckForUpdates);
    if (DOM.btnCloseUpdateError) DOM.btnCloseUpdateError.addEventListener('click', closeUpdateModal);

    // Click outside to close modals
    [
      DOM.taskModalOverlay,
      DOM.planModalOverlay,
      DOM.goalsModalOverlay,
      DOM.confirmModalOverlay,
      DOM.dragActionModalOverlay,
      DOM.roadmapItemModalOverlay,
      DOM.quarterMetaModalOverlay,
      DOM.tripModalOverlay,
      DOM.activityModalOverlay,
      DOM.shareTripModalOverlay,
      DOM.userProfileModalOverlay,
      DOM.appInfoModalOverlay,
      DOM.updateModalOverlay
    ].forEach(overlay => {
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.classList.remove('is-active');
            if (overlay === DOM.confirmModalOverlay) state.pendingConfirmAction = null;
            if (overlay === DOM.dragActionModalOverlay) state.pendingDragAction = null;
            hidePopover();
          }
        });
      }
    });

    // Escape key listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        [
          DOM.roadmapItemModalOverlay,
          DOM.quarterMetaModalOverlay,
          DOM.dragActionModalOverlay,
          DOM.confirmModalOverlay,
          DOM.taskModalOverlay,
          DOM.planModalOverlay,
          DOM.goalsModalOverlay,
          DOM.tripModalOverlay,
          DOM.activityModalOverlay,
          DOM.shareTripModalOverlay,
          DOM.userProfileModalOverlay,
          DOM.appInfoModalOverlay,
          DOM.updateModalOverlay
        ].forEach(ov => {
          if (ov && ov.classList.contains('is-active')) {
            ov.classList.remove('is-active');
          }
        });
        hidePopover();
      }
    });
  }

  // ==========================================================================
  // APP INFO & SYSTEM UPDATE CHECKER ENGINE (BULLETPROOF HYBRID)
  // ==========================================================================

  function openAppInfoModal() {
    if (DOM.userProfileModalOverlay) DOM.userProfileModalOverlay.classList.remove('is-active');
    if (DOM.updateModalOverlay) DOM.updateModalOverlay.classList.remove('is-active');

    const curVer = updateState.currentVersion || '1.4.0';
    if (DOM.appInfoVersionBadge) DOM.appInfoVersionBadge.textContent = `v${curVer}`;
    if (DOM.appInfoVerText) DOM.appInfoVerText.textContent = `${curVer} (Official)`;

    if (DOM.appInfoPlatformText) {
      let pName = 'macOS (Desktop Application)';
      if (window.electronAPI) {
        if (window.electronAPI.platform === 'darwin') pName = 'macOS (Desktop Application)';
        else if (window.electronAPI.platform === 'win32') pName = 'Windows (Desktop Application)';
        else if (window.electronAPI.platform === 'linux') pName = 'Linux (Desktop Application)';
      } else {
        pName = `${navigator.platform || 'Web Browser'} (Web Engine)`;
      }
      DOM.appInfoPlatformText.textContent = pName;
    }

    if (DOM.appInfoModalOverlay) {
      DOM.appInfoModalOverlay.classList.add('is-active');
    }
  }

  function closeAppInfoModal() {
    if (DOM.appInfoModalOverlay) {
      DOM.appInfoModalOverlay.classList.remove('is-active');
    }
  }

  const updateState = {
    currentVersion: '1.4.0',
    availableUpdateInfo: null,
    isDownloading: false
  };

  function initUpdateSystem() {
    if (window.electronAPI && window.electronAPI.appVersion) {
      updateState.currentVersion = window.electronAPI.appVersion;
    }
    if (DOM.profileAppVersionText) {
      DOM.profileAppVersionText.textContent = `v${updateState.currentVersion}`;
    }
    if (DOM.updateCurrentVersionText) {
      DOM.updateCurrentVersionText.textContent = `v${updateState.currentVersion}`;
    }
    if (DOM.latestVersionBadge) {
      DOM.latestVersionBadge.textContent = `v${updateState.currentVersion}`;
    }
    if (DOM.appInfoVersionBadge) {
      DOM.appInfoVersionBadge.textContent = `v${updateState.currentVersion}`;
    }
    if (DOM.appInfoVerText) {
      DOM.appInfoVerText.textContent = `${updateState.currentVersion} (Official)`;
    }

    // Listen to native menu trigger
    if (window.electronAPI && typeof window.electronAPI.onMenuTrigger === 'function') {
      window.electronAPI.onMenuTrigger('trigger-check-update', () => {
        triggerCheckForUpdates();
      });
      window.electronAPI.onMenuTrigger('menu-app-info', () => {
        openAppInfoModal();
      });
    }

    // Listen to updater IPC events from Electron
    if (window.electronAPI && typeof window.electronAPI.onUpdaterEvent === 'function') {
      window.electronAPI.onUpdaterEvent('updater-checking', () => {
        setUpdateModalState('checking');
      });

      window.electronAPI.onUpdaterEvent('updater-available', (info) => {
        updateState.availableUpdateInfo = info;
        setUpdateModalState('available', info);
      });

      window.electronAPI.onUpdaterEvent('updater-not-available', (info) => {
        setUpdateModalState('latest', info);
      });

      window.electronAPI.onUpdaterEvent('updater-progress', (progressObj) => {
        setUpdateModalState('downloading', progressObj);
      });

      window.electronAPI.onUpdaterEvent('updater-downloaded', (info) => {
        setUpdateModalState('ready', info);
      });

      window.electronAPI.onUpdaterEvent('updater-error', (errMsg) => {
        console.warn('AutoUpdater Electron Error:', errMsg);
        // Fallback langsung ke GitHub Release API jika autoUpdater menemui kendala local config
        checkGitHubDirectFallback();
      });

      window.electronAPI.onUpdaterEvent('updater-dev-mode', () => {
        checkGitHubDirectFallback();
      });

      window.electronAPI.onUpdaterEvent('menu-app-info', () => {
        openAppInfoModal();
      });
    }
  }

  let updateCheckTimeout = null;
  let updateCheckStepInterval = null;

  function openUpdateModal(initialState = 'checking') {
    if (DOM.userProfileModalOverlay) DOM.userProfileModalOverlay.classList.remove('is-active');
    if (DOM.appInfoModalOverlay) DOM.appInfoModalOverlay.classList.remove('is-active');

    if (DOM.updateModalOverlay) {
      DOM.updateModalOverlay.classList.add('is-active');
    }
    setUpdateModalState(initialState);
  }

  function closeUpdateModal() {
    clearTimeout(updateCheckTimeout);
    clearInterval(updateCheckStepInterval);
    if (DOM.updateModalOverlay) {
      DOM.updateModalOverlay.classList.remove('is-active');
    }
  }

  function triggerCheckForUpdates(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    openUpdateModal('checking');
    clearTimeout(updateCheckTimeout);
    clearInterval(updateCheckStepInterval);

    const descEl = document.querySelector('#updateStateChecking .update-status-desc');
    if (descEl) descEl.textContent = 'Menghubungkan ke server rilis GitHub...';

    let elapsed = 0;
    updateCheckStepInterval = setInterval(() => {
      elapsed += 1;
      if (descEl) {
        if (elapsed === 1) {
          descEl.textContent = 'Membaca metadata rilis terbaru di GitHub...';
        } else if (elapsed === 3) {
          descEl.textContent = 'Memverifikasi paket rilis dan catatan fitur baru...';
        } else if (elapsed === 5) {
          descEl.textContent = 'Menyelesaikan sinkronisasi server...';
        }
      }
    }, 1000);

    // Timeout safety net (8 seconds) -> Auto fallback to direct GitHub check
    updateCheckTimeout = setTimeout(() => {
      clearInterval(updateCheckStepInterval);
      if (DOM.updateStateChecking && DOM.updateStateChecking.style.display !== 'none') {
        checkGitHubDirectFallback();
      }
    }, 8000);

    if (window.electronAPI && typeof window.electronAPI.checkForUpdates === 'function') {
      try {
        window.electronAPI.checkForUpdates();
      } catch (err) {
        console.warn('Error calling checkForUpdates:', err);
        checkGitHubDirectFallback();
      }
    } else {
      setTimeout(() => {
        checkGitHubDirectFallback();
      }, 1200);
    }
  }

  function compareSemVer(a, b) {
    const pa = String(a || '0').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    const pb = String(b || '0').replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < 3; i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na > nb) return 1;
      if (na < nb) return -1;
    }
    return 0;
  }

  async function checkGitHubDirectFallback() {
    clearInterval(updateCheckStepInterval);
    clearTimeout(updateCheckTimeout);

    try {
      const response = await fetch('https://api.github.com/repos/ThoriqMP/timeline-app/releases/latest', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      if (!response.ok) {
        throw new Error(`Server rilis GitHub merespon dengan status ${response.status}`);
      }
      const data = await response.json();
      const latestTag = (data.tag_name || data.name || '1.4.0').replace(/^v/, '').trim();
      const currentVer = String(updateState.currentVersion || '1.4.0').replace(/^v/, '').trim();

      const defaultNotes = `
### Fitur Baru & Peningkatan Versi ${latestTag}:
- 🚀 **Double-Layer Navigation**: Tampilan navigasi dua tingkat yang rapi, modern, dan ergonomis.
- 🎨 **Icon Vector Overhaul**: Seluruh ikon diperbarui ke font vector Font Awesome profesional.
- 📋 **Drag-and-Drop & Duplicate Support**: Fleksibilitas memindahkan atau menggandakan target harian dan roadmap.
- 🖨️ **Executive PDF Reporting**: Pencetakan dokumen kalender dan aktivitas berkualitas tinggi.
- 🔄 **Pusat Pembaruan Otomatis**: Integrasi pembaruan sistem langsung dari repositori GitHub.
- ⚡ **Optimasi Performa**: Responsivitas sistem lebih cepat dan alokasi memori lebih hemat.
      `.trim();

      const notes = (data.body && data.body.trim()) ? data.body.trim() : defaultNotes;

      const isNewer = compareSemVer(latestTag, currentVer) > 0;

      if (isNewer) {
        updateState.availableUpdateInfo = {
          version: latestTag,
          releaseName: data.name || `TimelineFlow v${latestTag}`,
          releaseNotes: notes,
          releaseUrl: data.html_url
        };
        setUpdateModalState('available', updateState.availableUpdateInfo);
      } else {
        setUpdateModalState('latest', { version: currentVer });
      }
    } catch (err) {
      console.warn('Gagal memeriksa GitHub release:', err);
      setUpdateModalState('error', {
        message: 'Tidak dapat terhubung ke server rilis GitHub. Pastikan koneksi internet Anda aktif lalu coba beberapa saat lagi.'
      });
    }
  }

  function startDownloadUpdate() {
    setUpdateModalState('downloading', { percent: 0 });
    if (window.electronAPI && typeof window.electronAPI.startDownloadUpdate === 'function') {
      window.electronAPI.startDownloadUpdate();
    } else {
      const releaseUrl = 'https://github.com/ThoriqMP/timeline-app/releases/latest';
      if (window.electronAPI && typeof window.electronAPI.openExternal === 'function') {
        window.electronAPI.openExternal(releaseUrl);
      } else {
        window.open(releaseUrl, '_blank');
      }
      closeUpdateModal();
      showToast('Membuka halaman unduhan rilis terbaru di GitHub');
    }
  }

  function installAndRestart() {
    if (window.electronAPI && typeof window.electronAPI.installUpdate === 'function') {
      window.electronAPI.installUpdate();
    } else {
      showToast('Aplikasi akan memuat ulang');
      setTimeout(() => window.location.reload(), 800);
    }
  }

  function setUpdateModalState(stateName, data = {}) {
    clearInterval(updateCheckStepInterval);
    clearTimeout(updateCheckTimeout);

    const states = [
      DOM.updateStateChecking,
      DOM.updateStateAvailable,
      DOM.updateStateDownloading,
      DOM.updateStateReady,
      DOM.updateStateLatest,
      DOM.updateStateError
    ];

    states.forEach(el => {
      if (el) el.style.display = 'none';
    });

    if (stateName === 'checking') {
      if (DOM.updateStateChecking) DOM.updateStateChecking.style.display = 'flex';
      if (DOM.updateModalHeading) DOM.updateModalHeading.textContent = 'Memeriksa Pembaruan';
      if (DOM.updateModalSubheading) DOM.updateModalSubheading.textContent = 'Menghubungkan ke server pembaruan...';
    } else if (stateName === 'available') {
      if (DOM.updateStateAvailable) DOM.updateStateAvailable.style.display = 'flex';
      if (DOM.updateModalHeading) DOM.updateModalHeading.textContent = 'Pembaruan Tersedia!';
      if (DOM.updateModalSubheading) DOM.updateModalSubheading.textContent = 'Versi baru siap diunduh dan dipasang';

      const newVer = data.version || (updateState.availableUpdateInfo && updateState.availableUpdateInfo.version) || '1.4.0';
      if (DOM.updateCurrentVersionText) DOM.updateCurrentVersionText.textContent = `v${updateState.currentVersion}`;
      if (DOM.updateNewVersionText) DOM.updateNewVersionText.textContent = `v${newVer}`;

      renderReleaseNotes(data.releaseNotes || (updateState.availableUpdateInfo && updateState.availableUpdateInfo.releaseNotes));
    } else if (stateName === 'downloading') {
      if (DOM.updateStateDownloading) DOM.updateStateDownloading.style.display = 'flex';
      if (DOM.updateModalHeading) DOM.updateModalHeading.textContent = 'Mengunduh Pembaruan';
      if (DOM.updateModalSubheading) DOM.updateModalSubheading.textContent = 'Proses berlangsung di latar belakang...';

      const percent = Math.round(data.percent || 0);
      if (DOM.updateProgressBarFill) DOM.updateProgressBarFill.style.width = `${percent}%`;
      if (DOM.updateProgressPercentText) DOM.updateProgressPercentText.textContent = `${percent}%`;

      let speedText = 'Mengunduh...';
      if (data.bytesPerSecond) {
        const speedMb = (data.bytesPerSecond / (1024 * 1024)).toFixed(1);
        const transMb = ((data.transferred || 0) / (1024 * 1024)).toFixed(1);
        const totalMb = ((data.total || 0) / (1024 * 1024)).toFixed(1);
        speedText = `${speedMb} MB/s (${transMb} MB / ${totalMb} MB)`;
      }
      if (DOM.updateProgressSpeedText) DOM.updateProgressSpeedText.textContent = speedText;
    } else if (stateName === 'ready') {
      if (DOM.updateStateReady) DOM.updateStateReady.style.display = 'flex';
      if (DOM.updateModalHeading) DOM.updateModalHeading.textContent = 'Pembaruan Siap Dipasang';
      if (DOM.updateModalSubheading) DOM.updateModalSubheading.textContent = 'Instalasi paket pembaruan selesai';
    } else if (stateName === 'latest') {
      if (DOM.updateStateLatest) DOM.updateStateLatest.style.display = 'flex';
      if (DOM.updateModalHeading) DOM.updateModalHeading.textContent = 'Aplikasi Terkini';
      if (DOM.updateModalSubheading) DOM.updateModalSubheading.textContent = 'TimelineFlow sudah dalam versi terbaru';
      if (DOM.latestVersionBadge) DOM.latestVersionBadge.textContent = `v${updateState.currentVersion}`;
    } else if (stateName === 'error') {
      if (DOM.updateStateError) DOM.updateStateError.style.display = 'flex';
      if (DOM.updateModalHeading) DOM.updateModalHeading.textContent = 'Pemeriksaan Gagal';
      if (DOM.updateModalSubheading) DOM.updateModalSubheading.textContent = 'Terjadi kendala saat memeriksa pembaruan';
      if (DOM.updateErrorDetailText && data.message) {
        DOM.updateErrorDetailText.textContent = data.message;
      }
    }
  }

  function renderReleaseNotes(notes) {
    if (!DOM.updateReleaseNotesList) return;
    DOM.updateReleaseNotesList.innerHTML = '';

    if (!notes || (typeof notes === 'string' && !notes.trim())) {
      notes = `
- Double-Layer Navigation: Tampilan navigasi dua tingkat yang rapi, modern, dan ergonomis.
- Icon Vector Overhaul: Seluruh emoji diganti dengan vector icons Font Awesome profesional.
- Drag-and-Drop & Duplikat: Opsi memindahkan atau menyalin tugas harian dan inisiatif roadmap tahunan.
- Executive PDF Reporting: Ekspor dokumen kalender dan aktivitas berkualitas tinggi.
- Peningkatan Stabilitas: Optimasi kinerja dan responsivitas aplikasi.
      `.trim();
    }

    let lines = [];
    if (typeof notes === 'string') {
      lines = notes.split('\n');
    } else if (Array.isArray(notes)) {
      lines = notes.map(item => {
        if (typeof item === 'string') return item;
        if (item && item.note) return item.note;
        return String(item || '');
      });
    } else {
      lines = [String(notes)];
    }

    lines.forEach(line => {
      const trimmed = String(line || '').trim();
      if (!trimmed) return;

      if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
        const h = document.createElement('div');
        h.style.fontWeight = '700';
        h.style.color = 'var(--text-main)';
        h.style.margin = '8px 0 4px';
        h.textContent = trimmed.replace(/^#+\s*/, '');
        DOM.updateReleaseNotesList.appendChild(h);
      } else {
        const itemEl = document.createElement('div');
        itemEl.className = 'update-feature-item';

        const cleanText = trimmed.replace(/^[-*•]\s*/, '');
        itemEl.innerHTML = `
          <i class="fa-solid fa-circle-check"></i>
          <span>${cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span>
        `;
        DOM.updateReleaseNotesList.appendChild(itemEl);
      }
    });
  }

  function formatDateToISO(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(msg, type = 'info') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    const iconClass = type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    toast.innerHTML = `
      <i class="${iconClass}" style="color: ${type === 'error' ? 'var(--priority-high)' : 'var(--primary)'}; font-size: 1rem;"></i>
      <span>${escapeHtml(msg)}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
