// Shared language state and copy for the core brand pages.

export function getPageLanguage() {
const requested = new URLSearchParams(window.location.search).get('lang');
if (requested === 'id' || requested === 'en') return requested;
return document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en';
}

function updateLanguageMetadata(language) {
  const canonical = document.querySelector('link[rel="canonical"]');
  const englishUrl = new URL(canonical?.href || window.location.href);
  englishUrl.search = '';
  englishUrl.hash = '';

  const localizedUrl = new URL(englishUrl);
  if (language === 'id') localizedUrl.searchParams.set('lang', 'id');

  if (canonical) canonical.href = localizedUrl.href;

  const setAlternate = (languageCode, href) => {
    let link = document.querySelector(`link[rel="alternate"][hreflang="${languageCode}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = languageCode;
      document.head.appendChild(link);
    }
    link.href = href;
  };

  setAlternate('en', englishUrl.href);
  setAlternate('id', new URL(`${englishUrl.pathname}?lang=id`, englishUrl.origin).href);
  setAlternate('x-default', englishUrl.href);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'id' ? 'id_ID' : 'en_US');
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

function setAllDirectText(selector, values) {
  document.querySelectorAll(selector).forEach((element, index) => {
    if (values[index] === undefined) return;
    [...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .forEach(node => node.remove());
    element.appendChild(document.createTextNode(` ${values[index]}`));
  });
}

function applyHomeIndonesian() {
  const setMeta = (selector, value) => document.querySelector(selector)?.setAttribute('content', value);
  document.title = 'Studio Arsitektur dan Konstruksi di Lombok | Atelier Nusa';
  setMeta('meta[name="description"]', 'Atelier Nusa merancang rumah, villa, ruang hospitality, dan proyek konstruksi di Lombok. Mulai dari lahan, brief, dan keputusan yang membentuk bangunan.');
  setMeta('meta[property="og:title"]', 'Studio Arsitektur dan Konstruksi di Lombok | Atelier Nusa');
  setMeta('meta[property="og:description"]', 'Studio di Lombok untuk rumah, villa, ruang hospitality, dan konstruksi. Mulai dari lahan dan keputusan yang membentuk bangunan.');
  setMeta('meta[name="twitter:title"]', 'Studio Arsitektur dan Konstruksi di Lombok | Atelier Nusa');
  setMeta('meta[name="twitter:description"]', 'Atelier Nusa merancang rumah, villa, ruang hospitality, dan proyek konstruksi di Lombok.');

  setText('.hero__badge', 'Studio arsitektur dan konstruksi di Lombok');
  setHtml('.hero__title', 'Sedang merencanakan rumah atau villa di Lombok? <span class="hero__title-sub">Mulai dari lahannya.</span>');
  setText('.hero__subtitle', 'Sebelum menggambar, kami melihat lahan, akses, matahari, hujan, anggaran, dan cara bangunan akan digunakan. Jika Anda sudah memiliki lokasi atau gambaran awal, ceritakan yang sudah Anda ketahui.');
  setLabel('#hero .btn--primary', 'Bicarakan proyek Anda');
  setLabel('#hero .btn--outline', 'Lihat proyek');
  document.querySelector('#hero .btn--primary')?.setAttribute('href', 'https://wa.me/6285190645078?text=Halo%20Atelier%20Nusa.%20Saya%20ingin%20membicarakan%20proyek%20rumah%20atau%20villa%20di%20Lombok.');
  setText('.hero__vertical-text', 'Studio arsitektur Lombok');

  setText('#services .section-label', 'Yang Kami Kerjakan');
  setText('#services .section-title', 'Gambar yang baik dimulai dari pertanyaan biasa');
  setText('#services .section-desc', 'Di mana jalan masuknya? Ruang mana yang butuh cahaya pagi? Apa yang akan sulit dirawat? Seberapa jauh anggaran dapat berjalan? Kami menanyakan hal ini sebelum keputusan yang indah menjadi mahal untuk diubah.');
  setAll('#services .arch-card__title', ['Baca lahannya lebih dulu', 'Ubah ide menjadi gambar', 'Tetap dekat dengan pekerjaan']);
  setAll('#services .arch-card__desc', [
    'Kami melihat akses, kontur, matahari, angin, tetangga, dan pemandangan yang ingin Anda pertahankan. Detail ini memberi arah lebih banyak daripada gambar referensi.',
    'Render adalah awal. Kami mengembangkan denah, detail, material, dan informasi biaya agar ide tersebut dapat dipakai di lokasi.',
    'Saat pembangunan berjalan, pertanyaan kecil muncul setiap hari. Kami membantu memeriksa keputusan yang memengaruhi pesanan, tukang, mutu, dan ruang yang selesai.'
  ]);

  setText('#approach .section-label', 'Titik awal kami');
  setText('#approach .section-title', 'Lahan di Kuta tidak sama dengan lahan di Mataram');
  setText('.approach__text', 'Udara pesisir, hujan deras, jalan menanjak, jalan lingkungan yang ramai, dan orang yang akan menggunakan bangunan mengubah jawabannya. Kami melihat kondisi tersebut sejak awal, lalu menentukan hal yang perlu diperiksa lebih dulu. Kadang naungan dan aliran udara. Kadang akses, drainase, penyimpanan, atau percakapan yang lebih jujur tentang anggaran.');
  setAll('.stats__number--text', ['Mataram', 'Rumah', 'Desain', 'Lombok']);
  setAll('.stats__label', ['Basis studio', 'Villa dan hospitality', 'Keputusan konstruksi ikut dibahas', 'Area kerja']);

  setText('#showcase .section-label', 'Karya terpilih');
  setText('#showcase .section-title', 'Desain selesai, sedang dibangun, dan masih dieksplorasi');
  setText('#showcase .section-desc', 'Beberapa rumah dan studi villa dari Lombok. Setiap kartu menunjukkan tahap proyek.');
  setAll('#showcase .project-card__badge', ['Desain selesai', 'Dalam konstruksi', 'Studi konsep', 'Studi konsep']);
  setAll('#showcase .project-card__title', ['Hunian mewah', 'Hunian privat', 'Hunian industrial', 'Villa tropis']);
  setAll('#showcase .project-card__subtitle', ['Hunian, Kota Mataram', 'Hunian, Lombok Barat', 'Hunian, Mataram', 'Villa, Senggigi']);
  setLabel('#showcase .btn--outline', 'Lihat semua proyek');

  setText('#testimonials .section-label', 'Catatan proyek');
  setText('#testimonials .section-title', 'Melihat pekerjaan apa adanya');
  setText('#testimonials .section-desc', 'Kami memilih menunjukkan jenis proyek dan tahapnya daripada mengisi halaman dengan kutipan yang terdengar sempurna tetapi tidak memberi konteks.');
  setAll('.project-note__status', ['Desain selesai', 'Dalam konstruksi', 'Studi konsep']);
  setAll('.testimonial-card__quote', [
    'Proyek hunian mewah di Kota Mataram. Lihat halaman proyek untuk melihat pekerjaan yang sudah selesai.',
    'Hunian privat di Lombok Barat. Halaman proyek mencatat pekerjaan ini masih berjalan.',
    'Studi villa tropis di Senggigi. Ini adalah konsep desain, bukan bangunan yang sudah selesai.'
  ]);
  setAll('.testimonial-card__name', ['Hunian mewah', 'Hunian privat', 'Villa tropis']);
  setAll('.testimonial-card__role', ['Hunian · Kota Mataram', 'Hunian · Lombok Barat', 'Villa · Senggigi']);

  setText('#artikel .section-label', 'Catatan dan panduan');
  setText('#artikel .section-title', 'Hal yang berguna dibaca sebelum membangun');
  setText('#artikel .section-desc', 'Biaya, pertanyaan tentang lahan, dan ide desain yang sering muncul saat berbicara dengan pemilik proyek di Lombok.');
  setAll('#artikel .artikel-card h3', [
    'Berapa biaya membangun rumah di Lombok?',
    'Merancang cafe atau restoran',
    'Studi desain villa dari Lombok',
    'Memilih arsitek di Lombok',
    'Membuat rumah nyaman di iklim NTB',
    'Panduan biaya rumah dua lantai'
  ]);
  setAll('#artikel .artikel-card p', [
    'Panduan membaca biaya konstruksi berdasarkan luas, lokasi, material, dan tahap proyek.',
    'Pertanyaan tentang denah, naungan, material, dan cara pengunjung bergerak di dalam ruang.',
    'Ide untuk villa di Senggigi, Kuta, dan Gili dengan lahan tetap menjadi pertimbangan.',
    'Hal yang perlu diperiksa dari portofolio, ruang lingkup kerja, biaya, dan percakapan awal.',
    'Naungan, aliran udara, hujan, dan material yang penting dalam kehidupan sehari hari.',
    'Titik awal untuk memikirkan struktur, luas, finishing, dan anggaran.'
  ]);
  setAll('#artikel .artikel-card span', ['Baca panduan', 'Baca artikel', 'Lihat studi', 'Baca panduan', 'Baca artikel', 'Baca panduan']);

  setText('#pricing .section-label', 'Biaya proyek');
  setText('#pricing .section-title', 'Bicarakan angka sejak awal');
  setText('#pricing .section-desc', 'Ide yang indah tetap membutuhkan anggaran yang mampu membawanya. Kami membahas ruang lingkup, material, dan konstruksi sebelum desain berjalan terlalu jauh dari kemampuan biaya.');
  setAll('.pricing-card__title', ['Desain arsitektur', 'Desain dan konstruksi']);
  setHtml('#pricing .pricing-card:nth-child(1) .pricing-card__price', 'Rp 150.000 sampai Rp 350.000<span class="pricing-card__unit"> / m²</span>');
  setText('#pricing .pricing-card:nth-child(2) .pricing-card__price', 'Proposal berdasarkan ruang lingkup');
  setAll('.pricing-card__badge', ['Dibahas setelah brief']);
  setAllDirectText('#pricing .pricing-card__features li', [
    'Konsep dan render 3D',
    'Gambar kerja',
    'Estimasi biaya',
    'Diskusi material',
    'Desain arsitektur',
    'Diskusi material dan konstruksi',
    'Koordinasi lokasi',
    'Ruang lingkup konstruksi disepakati sebelum pekerjaan dimulai'
  ]);
  setAllDirectText('#pricing .pricing-card .btn', ['Bicarakan ruang lingkup desain', 'Tinjau ruang lingkup desain dan konstruksi']);
  setText('#pricing .pricing__note', 'Biaya desain bergantung pada ruang lingkup dan kompleksitas. Konstruksi dihitung setelah kami meninjau lahan, brief, dan material.');

  setText('#faq .section-label', 'FAQ');
  setText('#faq .section-title', 'Pertanyaan sebelum mulai');
  setAll('#faq .faq__question span', [
    'Berapa biaya jasa arsitek di Lombok?',
    'Berapa lama sebuah proyek berlangsung?',
    'Apakah Anda bekerja di luar Mataram?',
    'Apa saja yang dapat Anda bantu?'
  ]);
  setAll('#faq .faq__answer p', [
    'Referensi biaya desain yang tercantum adalah Rp 150.000 sampai Rp 350.000 per meter persegi. Biaya akhir bergantung pada ruang lingkup, kompleksitas, dan informasi yang dibutuhkan proyek.',
    'Tidak ada satu jawaban untuk semua proyek. Urutannya bergantung pada lahan, ruang lingkup, perizinan, material, dan kecepatan pengambilan keputusan. Kami membahas urutan yang mungkin setelah membaca brief.',
    'Ya. Kami bekerja di seluruh Lombok, termasuk Senggigi, Kuta Mandalika, Selong Belanak, Gili, dan wilayah Nusa Tenggara Barat yang lebih luas.',
    'Kami membantu rumah, villa, ruang hospitality, interior, renovasi, desain arsitektur, dan proyek konstruksi.'
  ]);

  setText('#konsultasi .cta__title', 'Ceritakan rencana Anda');
  setText('#konsultasi .cta__desc', 'Jika Anda punya lahan, sketsa, atau baru punya pertanyaan, kirimkan yang sudah ada. Lokasi, jenis proyek, tahap, dan kisaran anggaran cukup untuk memulai.');
  setAll('#konsultasi .cta__trust-item span', [
    'Bagikan lokasi, jenis proyek, tahap, dan kisaran anggaran.',
    'Kami membaca brief dan membalas maksimal 1x24 jam kerja.',
    'Kami memberi tahu hal yang perlu diperiksa lebih dulu.',
    'Percakapan awal tanpa komitmen',
    'Balasan maksimal 1x24 jam kerja',
    'Berbasis di Mataram dan bekerja di seluruh Lombok'
  ]);
  setLabel('#konsultasi .cta__links a:nth-child(1)', 'Layanan arsitektur');
  setLabel('#konsultasi .cta__links a:nth-child(2)', 'Panduan biaya bangun');
  setLabel('#konsultasi .cta__links a:nth-child(3)', 'Lihat semua proyek');
  setText('#konsultasi .cta__form-title', 'Bicarakan proyek Anda');
  setAll('#konsultasi .cta__fg label', ['Nama *', 'WhatsApp *', 'Email opsional', 'Lokasi proyek', 'Jenis proyek', 'Tahap proyek', 'Kisaran anggaran', 'Ceritakan yang sudah Anda ketahui']);
  setAll('#hp-type option', ['Pilih jenis', 'Hunian', 'Villa', 'Komersial dan hospitality', 'Desain interior', 'Renovasi', 'Lainnya']);
  setAll('#hp-stage option', ['Pilih tahap', 'Baru mencari informasi', 'Sudah punya lahan', 'Sudah punya konsep', 'Siap mendesain', 'Konstruksi sedang berjalan']);
  setAll('#hp-budget option', ['Belum yakin', 'Di bawah Rp 500 juta', 'Rp 500 juta sampai Rp 1 miliar', 'Di atas Rp 1 miliar']);
  document.querySelector('#hp-name')?.setAttribute('placeholder', 'Nama Anda');
  document.querySelector('#hp-email')?.setAttribute('placeholder', 'anda@contoh.com');
  document.querySelector('#hp-location')?.setAttribute('placeholder', 'Senggigi, Mataram, atau area lain');
  document.querySelector('#hp-message')?.setAttribute('placeholder', 'Ceritakan tentang lahan, bangunan, atau pertanyaan yang ingin Anda jawab.');
  setLabel('#konsultasi .cta__submit', 'Kirim detail proyek');
  setText('#cta-success h3', 'Detail Anda sudah kami terima');
  setText('#cta-success p', 'Kami akan meninjaunya dan membalas maksimal 1x24 jam kerja.');

  setText('#location .section-label', 'Temui kami');
  setText('#location .section-title', 'Studio Atelier Nusa');
  setText('#location .section-desc', 'Jl. Jend. Sudirman No.34, Gegutu, Rembiga, Kec. Selaparang, Kota Mataram, NTB 83124');
  setText('#related-links h2', 'Jelajahi juga');
  setText('#related-links > div > p', 'Layanan, biaya, dan panduan untuk proyek arsitektur Anda di Lombok.');
  setAll('#related-links a', ['Jasa arsitek Lombok', 'Biaya arsitek Lombok', 'Arsitek Mataram', 'Portofolio villa', 'Desain interior', 'Konsultasi']);
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
  setText('.page-hero__subtitle', 'Pilihan rumah, villa, dan gagasan hospitality dari proyek di dalam dan sekitar Lombok. Sebagian telah selesai pada tahap desain, sebagian sedang dalam konstruksi, dan sebagian lainnya masih berupa studi konsep.');
  setAll('.projects-filter__btn', ['Semua', 'Desain selesai', 'Dalam konstruksi', 'Studi konsep']);
  setAll('.project-card__badge', ['Desain selesai', 'Studi konsep', 'Studi konsep', 'Studi konsep', 'Dalam konstruksi', 'Dalam konstruksi', 'Studi konsep', 'Desain selesai']);
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

function applyAboutIndonesian() {
  document.title = 'Tentang Atelier Nusa | Studio Arsitektur Tropis di Lombok';
  document.querySelector('meta[name="description"]')?.setAttribute('content', 'Atelier Nusa adalah studio arsitektur dan konstruksi tropis di Lombok yang merancang rumah, villa, dan ruang hospitality berdasarkan iklim, budaya, dan tempatnya.');

  setText('.page-hero .section-label', 'Tentang Studio');
  setHtml('.page-hero__title', 'Studio kecil yang<br>bekerja dari Lombok');
  setText('.page-hero__subtitle', 'Kami merancang rumah, villa, dan ruang hospitality di Lombok. Kami memulai dari lahan, cuaca, anggaran, dan cara bangunan akan digunakan — lalu menentukan langkah berikutnya yang perlu dilakukan.');

  setText('.about-intro .arch-card h2', 'Mengapa studio ini ada');
  setAll('.about-intro .arch-text p', [
    'Banyak proyek dimulai dari gambar referensi. Itu berguna, tetapi bukan merupakan brief desain. Rumah di lahan sempit Mataram, villa di lereng bukit, dan restoran pesisir memiliki masalah yang sangat berbeda untuk dipecahkan.',
    'Atelier Nusa hadir untuk menimbang perbedaan itu dengan saksama. Kami menjadikan referensi sebagai titik awal, lalu menyesuaikan denah, bukaan, material, dan anggaran dengan tempat nyata dan orang-orang yang akan menggunakannya.'
  ]);

  setText('.philosophy .section-label', 'Cara Kami Bekerja');
  setHtml('.philosophy .section-title', 'Keputusan yang berguna<br>didahulukan');
  setAll('.philosophy .arch-card h3', [
    'Referensi lokal, kehidupan masa kini',
    'Material dipilih sesuai tempatnya',
    'Desain harus selamat dari proses pembangunan',
    'Biarkan iklim mengerjakan sebagian tugas'
  ]);
  setAll('.philosophy .arch-card p', [
    'Bangunan tradisional memberi pelajaran berharga tentang naungan, aliran udara, transisi ruang, dan ruang bersama. Kami tidak menyalinnya sebagai hiasan. Kami menimbang gagasan mana yang tetap masuk akal untuk rumah keluarga, villa sewa, atau proyek hospitality masa kini.',
    'Opsi termurah tidak selalu paling hemat dalam jangka panjang. Kami menimbang udara asin, kelembapan, paparan UV, pembersihan, penggantian, dan ketersediaan lokal sebelum menetapkan sebuah finishing. Tujuannya adalah bangunan yang bisa dirawat tanpa mengimpor setiap solusi dari tempat lain.',
    'Gambar hanya berguna bila tim di lokasi bisa membaca dan membangun darinya. Kami mengawasi dimensi, sambungan material, dan urutan pekerjaan agar desain tetap jelas setelah meninggalkan layar.',
    'Teritis, teras beratap, ventilasi silang, dan posisi jendela dapat membuat ruangan lebih nyaman sebelum sistem mekanis ditambahkan. Keputusan ini sederhana, tetapi harus diambil sejak awal.'
  ]);

  setText('.about-team .arch-card h2', 'Kerja di balik pekerjaan');
  setAll('.about-team .arch-text p', [
    'Bangunan dibentuk oleh lebih dari fasadnya. Denah, potongan, contoh material, anggaran, dan percakapan di lokasi semuanya meninggalkan jejak pada hasil akhir.',
    'Kami menjaga bagian-bagian proses itu tetap terhubung. Bukan dengan menambah lapisan, melainkan membuat keputusan penting terlihat selagi masih ada waktu untuk mengubahnya.'
  ]);

  setText('.about-vision .section-label', 'Yang Kami Perhatikan');
  setHtml('.about-vision .section-title', 'Menambahkan bangunan yang baik<br>tanpa menghapus karakter tempatnya');
  setText('.about-vision .arch-text--large', 'Lombok berubah dengan cepat. Proyek hospitality, rumah kedua, dan pengembangan hunian membawa lebih banyak perhatian ke pulau ini. Pertumbuhan pasti terjadi; pembangunan yang sembarangan tidak harus.');
  setText('.about-vision .arch-text', 'Kami ingin proyek kami bermanfaat, tahan lama, dan nyaman dihuni. Jika sebuah bangunan dapat melakukannya sambil menjaga rasa tempatnya, kami menganggap pekerjaan ini sepadan.');

  setText('.about-gallery .section-label', 'Studi Desain');
  setText('.about-gallery .section-title', 'Gagasan sebelum menjadi bangunan');
  setText('.about-gallery .arch-text--large', 'Sebuah pilihan studi hunian dan hospitality yang mengeksplorasi naungan, proporsi, material, serta hubungan antara dalam dan luar.');
  setAll('.gallery-title', ['Studi Rumah Taman', 'Studi Villa Kolam', 'Studi Rumah Modern', 'Studi Teras Pesisir']);

  setText('.contact .contact__title', 'Punya tempat dalam pikiran?');
  setText('.contact .contact__desc', 'Jika Anda masih mengumpulkan referensi, sedang mencari lahan, atau siap mendiskusikan proyek, kirimkan yang Anda miliki. Percakapan pertama yang berguna biasanya dimulai dari pertanyaan yang masih terbuka.');
  setAll('.contact .contact__info-label', ['Email', 'Telepon / WhatsApp']);
  setLabel('.contact .btn--primary', 'Mulai Percakapan');
}

const PROJECT_PAGE_TRANSLATIONS = {
  '/tropical-villa-senggigi': {
    title: 'Villa Tropis di Senggigi | Desain Konsep | Atelier Nusa',
    description: 'Konsep villa tropis di lereng Senggigi dengan pemandangan laut panorama, atap berbidang lebar, dan hubungan dalam-luar yang terbuka.',
    client: 'Studi konsep',
    paragraphs: [
      'Berada di kontur perbukitan Senggigi yang rimbun, konsep Tropical Villa merupakan eksplorasi hunian lereng yang bekerja selaras dengan lingkungannya. Desainnya mengutamakan keterikatan mendalam pada lanskap, menawarkan pemandangan laut panorama sekaligus ruang tinggal yang intim dan terlindung.',
      'Bahasa arsitekturnya ditentukan oleh atap berbidang lebar yang dirancang menahan guyuran hujan monsun serta memberi naungan penting dari matahari ekuatorial. Palet material hangat berupa kayu lokal, dinding penahan bertekstur, dan beton polish menjadi fondasi visual rumah, memastikan bangunan terasa lahir dari lerengnya, bukan diletakkan di atasnya.',
      'Inti konsep ini adalah menghapus batas antara dalam dan luar. Ruang utama menggunakan sistem kaca dari lantai ke plafon yang dapat digeser seluruhnya, membuka inti interior menuju dek kayu luas dan kolam tepi infinity. Konfigurasi terbuka ini memaksimalkan ventilasi silang, membiarkan angin pesisir mendinginkan rumah secara alami tanpa bergantung berlebihan pada pendingin udara.',
      'Tata ruangnya mengikuti kontur alami lahan secara berundak, menciptakan zona tersendiri untuk berkumpul, makan, dan bersantai privat. Tropical Villa menghadirkan kemewahan barefoot: arsitektur yang berkelas, responsif terhadap lingkungan, dan mengikuti ritme santai kehidupan pulau.'
    ],
    credit: 'Arsitektur Konsep oleh Atelier Nusa.',
    ctaTitle: 'Sedang merencanakan proyek villa?',
    ctaDesc: 'Baik lahan berlereng menantang maupun petak pesisir datar, mari rancang hunian yang disesuaikan dengan lahan Anda.'
  },
  '/industrial-residence-mataram': {
    title: 'Residensial Industrial Mataram | Desain Konsep | Atelier Nusa',
    description: 'Konsep hunian dengan beton ekspos dan estetika industrial yang tetap menerapkan prinsip desain tropis di Mataram.',
    client: 'Studi konsep',
    paragraphs: [
      'Dirancang sebagai pernyataan arsitektur yang mencolok di lanskap urban Mataram, konsep Industrial Residence merangkul materialitas mentah dan bentuk yang polos. Desain ini menantang norma hunian konvensional dengan berani memamerkan elemen struktural yang biasanya disembunyikan.',
      'Karakter utamanya adalah penggunaan luas beton ekspos cetak papan. Material kokoh ini tidak hanya memberi integritas struktural, tetapi juga menghadirkan estetika brutalis yang konkret, menambatkan rumah dengan mantap pada lahannya. Nada abu-abu alami beton diimbangi oleh rangka baja hitam dan panel kaca berperforma tinggi yang luas.',
      'Meski sarat pengaruh industrial, hunian ini tetap berakar pada prinsip desain tropis. Teritis lebar dan orientasi yang cermat melindungi area kaca besar dari panas matahari langsung sambil tetap memasukkan cahaya alami berlimpah. Desainnya menyatukan teras hidup luar ruang dan kolam refleksi, mengaburkan batas antara kenyamanan interior dan relaksasi outdoor.',
      'Penataan ruang interiornya mengutamakan konsep open-plan, menciptakan kesan volume dan fluiditas. Dengan mengurangi ornamen yang tidak perlu, Industrial Residence membiarkan kemurnian material serta permainan cahaya dan bayangan menentukan pengalaman huniannya.'
    ],
    credit: 'Arsitektur Konsep oleh Atelier Nusa.',
    ctaTitle: 'Tertarik dengan konsep ini?',
    ctaDesc: 'Mari diskusikan bagaimana estetika industrial ini dapat kami adaptasikan untuk lahan Anda.'
  },
  '/luxury-residential-mataram': {
    title: 'Hunian Mewah Mataram | Desain Selesai | Atelier Nusa',
    description: 'Rumah mewah modern di kawasan premium pusat Mataram yang menyeimbangkan keanggunan dengan kelayakan huni tropis.',
    client: 'Desain Selesai',
    paragraphs: [
      'Berlokasi di kawasan hunian premium di pusat Mataram, proyek ini dirancang sebagai rumah mewah modern yang menyeimbangkan keanggunan dengan kelayakan huni tropis. Programnya mengakomodasi ruang tinggal yang luas dengan penekanan pada kenyamanan, cahaya alami, dan estetika kontemporer.',
      'Desainnya menampilkan bentuk geometris bersih dengan aksen kayu hangat, menciptakan kontras halus antara minimalisme modern dan kehangatan alami. Elemen vertikal serta lapisan fasad menambah kedalaman dan daya tarik visual pada sisi menghadap jalan.',
      'Pemilihan material mencerminkan pendekatan yang matang terhadap konteks tropis urbannya: memadukan beton ekspos, pelapis kayu, dan kaca untuk menyeimbangkan privasi dan keterbukaan. Balkon tertanam dengan rak tanaman terintegrasi menghadirkan unsur hijau ke dalam komposisi vertikal.',
      'Pencahayaan aksen LED menonjolkan garis-garis arsitektur di malam hari, mengubah hunian ini menjadi kehadiran yang mencolok di lingkungannya. Setiap detail, dari kanopi masuk hingga elemen screen berperforasi, dipikirkan dengan saksama.',
      'Tahap desain telah diselesaikan oleh Atelier Nusa, dan proyek ini mencerminkan komitmen kami menghadirkan arsitektur yang ekspresif sekaligus berpijak pada konteksnya.'
    ],
    credit: 'Arsitektur oleh Atelier Nusa.',
    ctaTitle: 'Tertarik dengan proyek serupa?',
    ctaDesc: 'Kami ingin mendengar visi Anda. Mari diskusikan apa yang mungkin untuk rumah Anda.'
  },
  '/private-residence-lombok-barat': {
    title: 'Residensial Privat Lombok Barat | Konstruksi Berjalan | Atelier Nusa',
    description: 'Renovasi strategis di Lombok Barat yang mempertahankan struktur utama, menghemat biaya, dan meningkatkan kualitas hunian.',
    client: 'Dalam konstruksi',
    paragraphs: [
      'Proyek ini berawal dari permintaan renovasi. Sejak awal, klien memiliki satu kekhawatiran yang jelas: mereka tidak ingin pembongkaran total yang dapat meningkatkan biaya konstruksi secara signifikan.',
      'Sebagai arsitek sekaligus pelaksana, kami menyikapinya sebagai peluang desain strategis, bukan keterbatasan. Kami melakukan penilaian menyeluruh terhadap struktur dan konfigurasi ruang yang ada, mengidentifikasi elemen mana yang dapat dipertahankan dan dioptimalkan alih-alih dibangun ulang.',
      'Alih-alih mulai dari nol, kami berfokus mempertahankan sistem struktur utama sebanyak mungkin. Dengan mempertahankan fondasi dan rangka utama yang ada, kami terhindar dari perubahan struktural yang tidak perlu dan mencegah pembengkakan biaya.',
      'Intervensi diarahkan pada rekonfigurasi ruang, peningkatan fungsi, dan penyempurnaan arsitektural. Penyesuaian tata ruang dirancang saksama untuk meningkatkan kejelasan, efisiensi, dan kualitas hunian secara keseluruhan dengan tetap menghormati integritas bangunan yang ada.',
      'Metodologi ini mencerminkan komitmen inti Atelier Nusa: menghadirkan arsitektur yang penuh pertimbangan, bertanggung jawab, dan dapat dibangun. Kami percaya desain yang baik bukan soal berlebihan, melainkan ketepatan — mengambil keputusan strategis yang menyeimbangkan estetika, fungsi, keterbangunan, dan disiplin anggaran.',
      'Proyek ini saat ini dalam tahap konstruksi, dengan tim kami mengelola proses pembangunan untuk memastikan maksud desain terlaksana dengan setia di lokasi.'
    ],
    credit: 'Arsitektur & Konstruksi oleh Atelier Nusa.',
    ctaTitle: 'Tertarik dengan proyek serupa?',
    ctaDesc: 'Renovasi maupun bangunan baru, kami senang mendiskusikan kemungkinannya. Mari bicarakan proyek Anda.'
  }
};

function applyProjectDetailIndonesian(config) {
  document.title = config.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', config.description);
  setLabel('.project-detail__back', 'Kembali ke Proyek');
  setText('.project-detail__client', config.client);
  setAll('.project-description__content p:not(.project-description__credit)', config.paragraphs);
  setText('.project-description__credit', config.credit);
  setText('.cta__title', config.ctaTitle);
  setText('.cta__desc', config.ctaDesc);
  setLabel('.cta .btn--primary', 'Mulai Percakapan');
}

export function applyLanguage() {
  const requestedLanguage = getPageLanguage();
  const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
  const translatedPaths = new Set([
    '/', '/services', '/projects', '/artikel', '/lahan', '/about',
    ...Object.keys(PROJECT_PAGE_TRANSLATIONS)
  ]);
  // Single-language pages keep their own document language and metadata
  // untouched — rewriting them here would mislabel Indonesian SEO pages
  // as English and announce hreflang pairs that do not exist.
  if (!translatedPaths.has(path)) {
    return document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en';
  }
  const language = requestedLanguage === 'id' ? 'id' : 'en';
  document.documentElement.lang = language;
  updateLanguageMetadata(language);
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
  if (path === '/about') applyAboutIndonesian();
  if (path === '/artikel') applyArtikelIndonesian();
  if (path === '/lahan') applyLahanIndonesian();
  if (PROJECT_PAGE_TRANSLATIONS[path]) applyProjectDetailIndonesian(PROJECT_PAGE_TRANSLATIONS[path]);
  return language;
}
