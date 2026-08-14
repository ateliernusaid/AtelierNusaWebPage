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

export function applyLanguage() {
  const language = getPageLanguage();
  document.documentElement.lang = language;
  if (language !== 'id') return language;

  const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
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
  return language;
}
