import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
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
            },
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});
