// Shared language state and copy for the core brand pages.

export function getPageLanguage() {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (requested === 'id' || requested === 'en') return requested;
  return document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en';
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setHtml(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = value;
}

function setAll(selector, values) {
  document.querySelectorAll(selector).forEach((element, index) => {
    if (values[index] !== undefined) element.textContent = values[index];
  });
}

function setLabel(selector, value) {
  const element = document.querySelector(selector);
  if (!element) return;
  [...element.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .forEach(node => node.remove());
  element.appendChild(document.createTextNode(` ${value}`));
}

function applyHomeIndonesian() {
  setText('.hero__badge', 'Arsitektur dan konstruksi di Lombok');
  setText('.hero__title-sub', 'Arsitek dan kontraktor di Mataram');
  setText('.hero__subtitle', 'Atelier Nusa merancang dan membangun rumah, villa, serta ruang hospitality di Lombok. Kami memperhatikan hal-hal yang tetap penting setelah render selesai: panas, hujan, perawatan, anggaran, dan cara ruang benar-benar digunakan.');
  setLabel('#hero .btn--primary', 'Konsultasi Gratis');
  setLabel('#hero .btn--outline', 'Lihat Proyek Kami');

  setText('#services .section-label', 'Layanan Kami');
  setText('#services .section-title', 'Dari Sketsa Pertama hingga Bangunan Selesai');
  setText('#services .section-desc', 'Kami menjaga desain dan konstruksi tetap terhubung agar setiap keputusan dapat diuji terhadap pekerjaan nyata. Anda mendapatkan proses yang jelas, gambar yang praktis, dan satu tim untuk diajak berdiskusi.');
  setAll('#services .arch-card__title', ['Desain Villa dan Rumah Tropis', 'Design & Build', 'Kontraktor dan Konstruksi Mataram']);
  setAll('#services .arch-card__desc', [
    'Sebelum menggambar, kami mempelajari lahan, matahari, angin, akses, dan lingkungan sekitar. Detail tersebut membentuk denah jauh sebelum material atau fasad dipilih.',
    'Ketika desain dan konstruksi ditangani satu studio, pertanyaan dapat dijawab saat masih kecil. Kami membawa pemikiran dari sketsa pertama hingga detail yang akhirnya dibangun.',
    'Membangun adalah rangkaian keputusan biasa yang dilakukan dengan teliti: apa yang dipesan, kapan dipesan, siapa yang perlu berada di lokasi, dan apa yang harus diperiksa sebelum pekerjaan berikutnya dimulai.'
  ]);

  setText('#approach .section-label', 'Cara Kami Bekerja');
  setText('#approach .section-title', 'Mulai dari tempatnya');
  setText('.approach__text', 'Setiap proyek di Lombok memiliki kondisi yang berbeda. Lahan pesisir membutuhkan respons yang berbeda dari lereng teduh atau jalan hunian yang ramai. Kami mempelajari matahari, hujan, aliran udara, pemandangan, dan perawatan sejak awal, lalu menggunakannya untuk menentukan posisi ruang, bukaan, naungan, dan area luar.');
  setAll('.stats__label', ['Proyek yang Dirancang', 'Kepuasan Klien', 'Klien yang Dilayani', 'Area di Lombok']);

  setText('#showcase .section-label', 'Karya Terpilih');
  setText('#showcase .section-title', 'Proyek Terbaru');
  setText('#showcase .section-desc', 'Rumah, villa, dan ruang hospitality di Lombok serta pulau-pulau sekitarnya.');
  setAll('#showcase .project-card__badge', ['Selesai', 'Berjalan', 'Konsep', 'Konsep']);
  setLabel('#showcase .btn--outline', 'Lihat Semua Proyek');

  setText('#roots .section-label', 'Studio');
  setText('#roots .section-title', 'Cara kerja yang praktis');
  setAll('.roots__item-title', ['Lahan menjadi titik awal', 'Desain tetap terhubung dengan konstruksi', 'Kami bekerja dari Lombok']);
  setAll('.roots__item-desc', [
    'Villa di tepi pantai Kuta Mandalika memiliki kebutuhan berbeda dari rumah keluarga di Mataram atau tempat peristirahatan di lereng Senggigi. Kami menjadikan perbedaan kondisi lahan sebagai bagian dari solusi desain.',
    'Tim yang mengerjakan desain tetap dekat dengan konstruksi. Hal ini memudahkan klarifikasi detail, penyesuaian keputusan, dan menjaga bangunan selesai tetap dekat dengan maksud gambar.',
    'Kami berbasis di Mataram dan bekerja di seluruh pulau, dari Senggigi dan Gili hingga Kuta Mandalika dan Lombok Timur. Kedekatan dengan proyek membantu kami mengambil keputusan berdasarkan kondisi lokasi, rantai pasok, dan cuaca yang nyata.'
  ]);

  setText('#konsultasi .cta__title', 'Ceritakan rencana Anda');
  setText('#konsultasi .cta__desc', 'Anda mungkin sudah memiliki lahan dan brief yang jelas, atau baru memiliki beberapa gambar referensi dan pertanyaan tentang langkah awal. Ceritakan informasi yang sudah ada dan kami akan membantu menentukan langkah berikutnya.');
  setAll('#konsultasi .cta__trust-item span', [
    'Bagikan lokasi, jenis proyek, dan informasi yang sudah Anda punya.',
    'Kami meninjau brief dan menjelaskan langkah berikutnya yang paling berguna.',
    'Anda mendapatkan titik awal yang praktis untuk desain atau konstruksi.',
    'Konsultasi awal gratis tanpa komitmen',
    'Langkah berikutnya jelas setelah konsultasi',
    'Karya terpilih di seluruh Lombok'
  ]);
  setLabel('#konsultasi .cta__links a:nth-child(1)', 'Layanan Arsitektur & Design-Build');
  setLabel('#konsultasi .cta__links a:nth-child(2)', 'Panduan Biaya Bangun');
  setLabel('#konsultasi .cta__links a:nth-child(3)', 'Lihat Proyek Villa');
  setText('#konsultasi .cta__form-title', 'Mulai Konsultasi');
  setAll('#konsultasi label', ['Nama *', 'WhatsApp *', 'Email (opsional)', 'Jenis Proyek', 'Ceritakan proyek Anda']);
  setAll('#konsultasi select option', ['Pilih jenis proyek', 'Hunian', 'Villa', 'Komersial / Hospitality', 'Desain Interior', 'Renovasi', 'Lainnya']);
  document.querySelector('#hp-name')?.setAttribute('placeholder', 'Nama lengkap Anda');
  document.querySelector('#hp-email')?.setAttribute('placeholder', 'anda@contoh.com');
  document.querySelector('#hp-message')?.setAttribute('placeholder', 'contoh: villa 3 kamar di Senggigi dengan gaya tropis modern...');
  setLabel('#konsultasi .cta__submit', 'Kirim Brief Proyek');
  setText('#cta-success h3', 'Terima kasih');
  setText('#cta-success p', 'Kami akan meninjau brief Anda dan menghubungi Anda dengan langkah berikutnya yang paling berguna.');
}

function applyServicesIndonesian() {
  setText('.page-hero .section-label', 'Layanan Arsitektur di Lombok');
  setHtml('.page-hero__title', 'Desain dan konstruksi<br>di Lombok');
  setText('.page-hero__subtitle', 'Atelier Nusa membantu membentuk rumah, villa, interior, renovasi, dan proyek hospitality dari konsep pertama hingga konstruksi. Studio kami berbasis di Mataram dan bekerja di seluruh Lombok.');
  setAll('.service-block__title', ['Arsitektur untuk rumah, villa, dan hospitality', 'Manajemen konstruksi']);
  setAll('.service-block__desc', [
    'Kami mulai dengan memahami lahan dan kebutuhan proyek: bagaimana bangunan dicapai, bagian mana yang perlu terbuka, ruang yang membutuhkan privasi, dan kemampuan anggaran. Dari tata letak awal hingga gambar kerja, kami mengembangkan desain yang jelas untuk dibangun dan cukup spesifik untuk terasa milik Anda.',
    'Kami mengoordinasikan sisi praktis pembangunan: material, tenaga kerja, keputusan di lokasi, dan pemeriksaan kualitas. Ketika kondisi di lapangan berubah, konteks desain sudah dikenal tim sehingga respons dapat dibahas bersama orang yang tepat.'
  ]);
  setText('.values .section-label', 'Mengapa Berjalan Baik');
  setText('.values .section-title', 'Arti menjaga pekerjaan tetap terhubung');
  setText('.values .section-desc', 'Studio bersama tidak menghilangkan bagian sulit dari proyek. Namun, masalah dapat terlihat lebih awal dan ditangani secara langsung.');
  setAll('.value-card__title', ['Berpikir dari kondisi lahan', 'Lebih sedikit celah antara gambar dan lokasi', 'Material yang sesuai dengan tempatnya']);
  setAll('.value-card__desc', [
    'Kami memulai dari iklim, orientasi, akses, dan cara lahan digunakan sebelum mengambil keputusan desain.',
    'Desain dan konstruksi berjalan berdekatan agar pertanyaan penting dapat diselesaikan sebelum menjadi masalah di lapangan.',
    'Panas, kelembapan, udara asin, hujan, pembersihan, dan penggantian material semuanya dipertimbangkan sejak awal.'
  ]);
  setText('.process .section-label', 'Langkah demi Langkah');
  setText('.process .section-title', 'Tahapan proyek');
  setAll('.process__step-content h3', ['Percakapan awal dan kunjungan lahan', 'Desain konsep', 'Desain detail dan gambar kerja', 'Konstruksi dan serah terima']);
  setAll('.process__step-content p', [
    'Kami membahas lahan, kebutuhan, perkiraan anggaran, dan hal-hal yang masih belum jelas. Jika proyek siap dikunjungi, kami melihat kondisi yang akan memengaruhi desain dan pembangunan.',
    'Kami menguji susunan dasar bangunan: posisinya, pergerakan orang, ruang dengan cahaya terbaik, dan arah material awal. Anda dapat memberi masukan sebelum detail mengambil alih.',
    'Setelah arahnya tepat, kami menyelesaikan dimensi, struktur, utilitas, material, dan informasi yang dibutuhkan tim konstruksi untuk menghitung dan membangun.',
    'Selama konstruksi, kami mengoordinasikan kemajuan dan menjawab pertanyaan yang muncul. Setelah selesai, kami memeriksa pekerjaan bersama dan menyerahkan bangunan yang siap digunakan.'
  ]);
  setText('.about-intro__text h2', 'Studio berbasis di Mataram');
  setAll('.about-intro__text p', [
    'Atelier Nusa berbasis di Mataram dan bekerja di seluruh Lombok. Kami tetap dekat dengan lokasi proyek, sejak pertanyaan awal tentang lahan hingga keputusan praktis yang mengikutinya.',
    'Tujuannya sederhana: bangunan harus masuk akal setelah render selesai, nyaman digunakan, mudah dirawat, dan cukup jelas bagi orang yang membangunnya.'
  ]);
  setLabel('.about-intro__text .btn', 'Tentang Kami');
}

function applyProjectsIndonesian() {
  setText('.page-hero .section-label', 'Karya Kami');
  setHtml('.page-hero__title', 'Proyek Arsitektur<br>di Lombok');
  setText('.page-hero__subtitle', 'Pilihan rumah, villa, dan gagasan hospitality dari proyek di dalam dan sekitar Lombok. Sebagian telah selesai, sebagian masih berjalan, dan sebagian lainnya masih berada pada tahap konsep.');
  setAll('.projects-filter__btn', ['Semua', 'Selesai', 'Berjalan', 'Konsep']);
  setAll('.project-card__badge', ['Selesai', 'Konsep', 'Konsep', 'Konsep', 'Berjalan', 'Berjalan', 'Konsep', 'Selesai']);
  setText('.locations .section-label', 'Area Kerja');
  setText('.locations .section-title', 'Di mana kami bekerja');
  setText('.locations .section-desc', 'Sebagian besar pekerjaan kami berada di Lombok. Kondisinya berubah dari satu proyek ke proyek berikutnya, dan perubahan itu menjadi bagian dari percakapan desain.');
  setAll('.location-tag__type', ['Hunian', 'Hospitality', 'Resort & Villa', 'Hospitality', 'Villa', 'Beragam']);
  setText('.cta__title', 'Memiliki lahan atau ide?');
  setText('.cta__desc', 'Kirim informasi yang sudah Anda punya: lokasi, brief singkat, atau beberapa referensi. Kami dapat membantu melihat hal-hal yang perlu dijawab sebelum proyek berjalan lebih jauh.');
  setLabel('.cta .btn--primary', 'Mulai Percakapan');
}

function applyArtikelEnglish() {
  setHtml('.page-hero__title', 'Insights for <em>building better</em>');
  setText('.page-hero__subtitle', 'Practical guides to homes, villas, costs, materials, and the decisions that matter before building in Lombok.');
  setText('.section-header .section-label', 'Read by project need');
  setText('.section-header .section-title', 'Ideas, numbers, and context');
  setText('.section-header .section-desc', 'Use these articles as a starting point. Every project still needs a close reading of its site, brief, and budget.');
  setAll('.journal-filter', ['All', 'Starting a project', 'Cost & budget', 'Tropical design', 'Renovation']);
  setAll('.journal-card__meta', ['Starting a project - Guide', 'Cost & budget', 'Tropical design', 'Renovation', 'Tropical design', 'Commercial']);
  setAll('.journal-card__title', [
    'How to Choose an Architect in Lombok',
    'Building Costs in Lombok: How to Read an Estimate',
    'Modern Tropical Interior Design in Lombok',
    'House Renovation in Mataram and Lombok',
    "Modern Tropical Homes for Lombok's Climate",
    'Tropical Cafe and Restaurant Design in Lombok'
  ]);
  setAll('.journal-card__excerpt', [
    'How to evaluate a portfolio, working style, scope, credentials, communication, and fee structure before choosing an architect.',
    'The components that affect cost per square metre and how to create a more realistic early budget.',
    'Local materials, colour, lighting, and indoor-outdoor connections for a lighter tropical home.',
    'Stages, work priorities, estimates, and situations where a renovation benefits from an architect.',
    'Important design elements for heat, rain, humidity, and everyday comfort.',
    'How layout, circulation, materials, and atmosphere shape the visitor experience.'
  ]);
  setAll('.journal-card__link', ['Read the guide', 'Read the article', 'Read the article', 'Read the article', 'Read the article', 'Read the article']);
  setText('.cta__left .section-label', 'Need project context?');
  setText('.cta__title', 'Articles give direction. The site gives the answer.');
  setText('.cta__desc', 'If you already have a location or a project outline, tell the Atelier Nusa team where you are in the process.');
  setText('.cta__form-title', 'Start a conversation');
  setAll('#article-lead-form label', ['Name *', 'WhatsApp *', 'What are you planning to build?']);
  document.querySelector('#article-name')?.setAttribute('placeholder', 'Your full name');
  document.querySelector('#article-message')?.setAttribute('placeholder', 'Home, villa, renovation, or commercial space');
  setLabel('#article-lead-form .cta__submit', 'Send via WhatsApp');
  setText('#article-success h3', 'Thank you.');
  setText('#article-success p', 'WhatsApp will open with a summary of your brief.');
}

function applyLahanEnglish() {
  setText('.lahan-section .section-label', 'Available land');
  setText('.lahan-section .section-title', 'Available plots');
  setAll('.lahan-card__location', ['East Lombok', 'West Lombok']);
  setAll('.lahan-card__title', ['Labuhan Lombok Productive Land', 'Batu Layar Hillside Land']);
  setAll('.lahan-card__description', [
    'A productive 2.5-hectare garden plot with gentle terrain, open green views, and practical road access. Suitable for a garden, retreat, or residential development.',
    'A 1.7-hectare hillside plot in West Batu Layar with stepped terrain and expansive views. Well suited to a premium villa resort development.'
  ]);
  setAll('.lahan-card__spec-label', ['Area', 'Legal status', 'Access', 'Area', 'Legal status', 'Terrain']);
  setAll('.lahan-card__spec-val', ['2.5 Ha', 'SHM', 'Paved road', '1.7 Ha', 'SHM', 'Stepped']);
  setAll('.lahan-card__price-label', ['Asking price', 'Asking price']);
  setAll('.lahan-card .btn--outline', ['View land details', 'View land details']);
  setText('.lahan-section + .section .section-label', 'Custom sourcing');
  setText('.lahan-section + .section .section-title', 'Looking for a specific site?');
  setText('.lahan-section + .section .arch-text--large', 'If you have specific land criteria in Lombok - area, location, budget, or intended use - that is not listed in our catalogue, our consultants can help source suitable land with clear documentation.');
  setLabel('#btn-custom-lahan', 'Discuss your land requirements');
}

function applyArtikelIndonesian() {
  setHtml('.page-hero__title', 'Wawasan untuk <em>membangun lebih baik</em>');
  setText('.page-hero__subtitle', 'Panduan praktis tentang desain rumah, villa, biaya, material, dan keputusan penting sebelum membangun di Lombok.');
  setText('.section-header .section-label', 'Baca berdasarkan kebutuhan');
  setText('.section-header .section-title', 'Ide, angka, dan konteks');
  setText('.section-header .section-desc', 'Gunakan artikel ini sebagai titik awal. Setiap proyek tetap membutuhkan pembacaan lahan, kebutuhan, dan anggaran yang spesifik.');
  setAll('.journal-filter', ['Semua', 'Memulai proyek', 'Biaya & anggaran', 'Desain tropis', 'Renovasi']);
  setAll('.journal-card__meta', ['Memulai proyek - Panduan', 'Biaya & anggaran', 'Desain tropis', 'Renovasi', 'Desain tropis', 'Komersial']);
  setAll('.journal-card__title', [
    'Panduan Lengkap Memilih Jasa Arsitek Profesional di Lombok',
    'Biaya Bangun Rumah di Lombok: Cara Membaca Estimasi',
    'Tren Desain Interior Tropis Modern di Lombok',
    'Renovasi Rumah di Mataram dan Lombok',
    'Desain Rumah Tropis Modern untuk Iklim Lombok',
    'Desain Cafe dan Restoran Tropis di Lombok'
  ]);
  setAll('.journal-card__excerpt', [
    'Cara mengevaluasi portofolio, kecocokan cara kerja, ruang lingkup, legalitas, komunikasi, dan struktur biaya sebelum memilih arsitek.',
    'Komponen yang memengaruhi biaya per meter persegi dan cara menyusun anggaran awal dengan lebih realistis.',
    'Material lokal, warna, pencahayaan, dan hubungan ruang dalam-luar untuk hunian tropis yang terasa ringan.',
    'Tahapan, prioritas pekerjaan, estimasi, dan situasi ketika renovasi perlu didampingi arsitek.',
    'Elemen penting untuk menghadapi panas, hujan, kelembapan, dan kebutuhan kenyamanan sehari-hari.',
    'Bagaimana layout, sirkulasi, material, dan suasana ruang membantu membentuk pengalaman pengunjung.'
  ]);
  setAll('.journal-card__link', ['Baca panduan', 'Baca artikel', 'Baca artikel', 'Baca artikel', 'Baca artikel', 'Baca artikel']);
  setText('.cta__left .section-label', 'Butuh konteks proyek?');
  setText('.cta__title', 'Artikel memberi arah. Lahan memberi jawabannya.');
  setText('.cta__desc', 'Jika Anda sudah memiliki lokasi atau gambaran proyek, ceritakan tahapnya kepada tim Atelier Nusa.');
  setText('.cta__form-title', 'Mulai Percakapan');
  setAll('#article-lead-form label', ['Nama *', 'WhatsApp *', 'Apa yang ingin Anda bangun?']);
  document.querySelector('#article-name')?.setAttribute('placeholder', 'Nama lengkap');
  document.querySelector('#article-message')?.setAttribute('placeholder', 'Rumah, villa, renovasi, atau ruang komersial');
  setLabel('#article-lead-form .cta__submit', 'Kirim ke WhatsApp');
  setText('#article-success h3', 'Terima kasih.');
  setText('#article-success p', 'WhatsApp akan terbuka dengan ringkasan kebutuhan Anda.');
}

function applyLahanIndonesian() {
  setHtml('.page-hero__title', 'Investasi Lahan<br>Pilihan di Lombok');
  setText('.page-hero__subtitle', 'Menyediakan pilihan lahan potensial dengan legalitas bersih untuk pengembangan hunian, villa resort, kebun produktif, atau instrumen investasi jangka panjang Anda.');
  setText('.lahan-section .section-label', 'Katalog Lahan');
  setText('.lahan-section .section-title', 'Lahan Tersedia');
  setAll('.lahan-card__location', ['Lombok Timur', 'Lombok Barat']);
  setAll('.lahan-card__title', ['Tanah Kebun Labuhan Lombok', 'Tanah Bukit Batu Layar']);
  setAll('.lahan-card__spec-label', ['Luas', 'Legalitas', 'Akses', 'Luas', 'Legalitas', 'Kontur']);
  setAll('.lahan-card__spec-val', ['2.5 Ha', 'SHM', 'Jalan Aspal', '1.7 Ha', 'SHM', 'Berundak']);
  setAll('.lahan-card__price-label', ['Harga Penawaran', 'Harga Penawaran']);
  setAll('.lahan-card .btn--outline', ['Detail Lahan', 'Detail Lahan']);
  setText('.lahan-section + .section .section-label', 'Custom Sourcing');
  setText('.lahan-section + .section .section-title', 'Mencari Lahan Spesifik?');
  setText('.lahan-section + .section .arch-text--large', 'Jika Anda memiliki kriteria lahan tertentu di Lombok (luas, lokasi, anggaran, atau peruntukan bisnis) yang belum terdaftar di katalog kami, tim konsultan kami siap membantu mencarikan lahan terbaik dengan legalitas yang terjamin aman.');
  setLabel('#btn-custom-lahan', 'Konsultasi Kebutuhan Lahan');
}

export function applyLanguage() {
  const language = getPageLanguage();
  document.documentElement.lang = language;
  const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
  if (language !== 'id') {
    if (path === '/artikel') applyArtikelEnglish();
    if (path === '/lahan') applyLahanEnglish();
    return language;
  }

  if (path === '/') {
    document.title = 'Jasa Arsitek dan Konstruksi di Lombok | Atelier Nusa';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Atelier Nusa merancang rumah, villa, dan proyek design-build di Lombok dari konsep hingga konstruksi.');
    applyHomeIndonesian();
  }
  if (path === '/services') {
    document.title = 'Layanan Arsitektur dan Design-Build di Lombok | Atelier Nusa';
    applyServicesIndonesian();
  }
  if (path === '/projects') {
    document.title = 'Proyek Arsitektur di Lombok | Atelier Nusa';
    applyProjectsIndonesian();
  }
  if (path === '/artikel') applyArtikelIndonesian();
  if (path === '/lahan') applyLahanIndonesian();
  return language;
}
