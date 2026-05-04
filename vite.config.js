import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
    root: '.',
    plugins: [
        ViteImageOptimizer({
            png: {
                quality: 80,
            },
            jpeg: {
                quality: 80,
            },
            jpg: {
                quality: 80,
            },
            webp: {
                quality: 80,
            },
        }),
    ],
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
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});
