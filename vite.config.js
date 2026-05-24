import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    plugins: [],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                projects: resolve(__dirname, 'projects.html'),
                services: resolve(__dirname, 'services.html'),
                luxuryResidential: resolve(__dirname, 'luxury-residential-mataram.html'),
                privateResidence: resolve(__dirname, 'private-residence-lombok-barat.html'),
                industrialResidence: resolve(__dirname, 'industrial-residence-mataram.html'),
                tropicalVilla: resolve(__dirname, 'tropical-villa-senggigi.html'),
                privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
                termsOfService: resolve(__dirname, 'terms-of-service.html'),
                jasaArsitekLombok: resolve(__dirname, 'jasa-arsitek-lombok.html'),
                arsitekMataram: resolve(__dirname, 'arsitek-mataram.html'),
                artikel: resolve(__dirname, 'artikel.html'),
                jasaArsitekSenggigi: resolve(__dirname, 'jasa-arsitek-senggigi.html'),
                arsitekKutaMandalika: resolve(__dirname, 'arsitek-kuta-mandalika.html'),
                desainInteriorLombok: resolve(__dirname, 'desain-interior-lombok.html'),
                arsitekVillaMewah: resolve(__dirname, 'arsitek-villa-mewah-lombok.html'),
                biayaArsitekLombok: resolve(__dirname, 'biaya-arsitek-lombok.html'),
                trenDesainInterior: resolve(__dirname, 'tren-desain-interior-lombok.html'),
                renovasiRumah: resolve(__dirname, 'renovasi-rumah-mataram-lombok.html'),
                konsultasiGratis: resolve(__dirname, 'konsultasi-gratis.html'),
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});
